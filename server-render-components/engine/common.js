const fs = require("fs");

module.exports.genClassName = function(comName) {
    return comName.replace("/", "-");
}

module.exports.readFile = function(fName) {
    return new Promise((resolve) => {
        fs.readFile(fName, (err, str) => resolve(str || ""));
    });
}
