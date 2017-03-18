const express = require("express");
const componentEjs = require("./engine")({base:"/concat"});


const app = express();
app.engine("html", componentEjs.engine);
app.locals._layoutFile = 'layout.html';
app.set("views", __dirname + "/src");
app.set("view engine", "html");
app.use(componentEjs.middleware);


app.get("/", function(req, res, next) {
    res.render("home");
});

app.listen(3000, () => console.log('server listening at %s', 3000));
