const path = require("path");

const common = require("./common");

module.exports = {
    js(viewPath, comList) {
        function wrapComJS(cName, jsStr) {
            if(!jsStr) return;
            const rootClassName = common.genClassName(cName);
            return `;Array.from(document.querySelectorAll(".${rootClassName}")).forEach((root) => {
                ${jsStr}
            });`
        }

        function wrapAllJS(jsStr) {
            return `;window.addEventListener("load", () => {
                ${jsStr}
            });`;
        }

        const fileReaderPros = comList.map(cName =>
            common.readFile(path.join(viewPath, cName, "index.js"))
            .then(jsStr => wrapComJS(cName, jsStr))
        );
        return Promise.all(fileReaderPros).then(inputs => inputs.filter(f => f).join("\n")).then(wrapAllJS);
    },
    css(viewPath, comList) {
        const fileReaderPros = comList.map(f => common.readFile(path.join(viewPath, f, "index.css")));
        return Promise.all(fileReaderPros).then(inputs => inputs.filter(f => f).join("\n"));
    }
};
