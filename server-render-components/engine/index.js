const path = require("path"),
    cheerio = require("cheerio"),
    ejs = require("ejs-mate");

const common = require("./common"),
    concat = require('./concat');

const REG_ROOT = /\<.+?>/;
const REG_TAG_ATTR = /(\w+)\=([\"\'])(.+?)\2/;

// bind in options
function loadComponent(cName, opts, attr = {}) {
    this.locals.components.add(cName);

    const $ = cheerio.load(ejs.partial.call(this, cName, opts), { normalizeWhitespace: true });

    const root = $.root();
    const rootDom = $(root.children()[0]);
    rootDom.addClass(common.genClassName(cName));

    for (let k in attr) {
        if (k === "class") {
            rootDom.addClass(attr[k]);
        } else {
            rootDom.attr(k, attr[k]);
        }
    }
    return root.html();
}

const MIME = {
    js: "application/javascript",
    css: "text/css"
}

module.exports = function({ base = "/com" } = {}) {
    const separator = "??";
    if (base.slice(-1) !== "/") base += "/";

    function concatUrl(coms, type) {
        const comList = Array.from(coms).join(",");
        return base + type + separator + comList;
    }

    return {
        middleware: function(req, resp, next) {
            if (req.url.indexOf(base) !== 0) return next();
            const type = req.path.slice(base.length);

            const patten = req.url.split(separator);
            if (patten.length < 2) next();

            concat[type](req.app.get("views"), patten[1].split(",")).then(result => {
                resp.set("Content-Type", MIME[type]);
                resp.send(result);
            });
        },


        engine(filePath, options, callback) {
            if (!options.locals) {
                options.locals = {};
            }
            const locals = options.locals;

            if (!locals.components) {
                locals.components = new Set();
                locals.component = loadComponent.bind(options);
            }
            const ext = options.settings["view engine"];
            const mainComponets = filePath.slice(options.settings.views.length + 1).replace("/index." + ext, "");

            return ejs(filePath, options, (err, html) => {
                if (err) return callback(err);
                locals.components.add(mainComponets);
                const $ = cheerio.load(html);
                $("head").append('<link rel="stylesheet" href="' + concatUrl(locals.components, "css") + '">');
                $("head").append('<script src="' + concatUrl(locals.components, "js") + '"></script>');
                callback(null, $.html());
            });
        }
    }
}
