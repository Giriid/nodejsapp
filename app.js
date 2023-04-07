var express = require("express");
var app = express();
var router = express.Router();

app.use(router);

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});

router.get("/test", function(req, res) {
    res.status(200).send('Welcome to "/test"!')
});