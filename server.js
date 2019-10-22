const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser"); //JSON responses
const path = require("path")

const PORT = 3000;

// Initialize Express
const app = express();



// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(bodyParser.urlencoded({
  extended: true
}));

// Make public a static folder

// Set Handlebars.
var exphbs = require("express-handlebars");




app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// Import routes and give the server access to them.
var routes = require("./controllers/scraperController.js");



app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});