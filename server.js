global.__base     = __dirname + '/';

var express       = require("express");
var bodyParser    = require("body-parser");


var app           = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var routes = require("./app/router.js")(app);

var server = app.listen(process.env.PORT || 8080, function () {
  console.log(" --- Server started in port: %s", server.address().port);
});
