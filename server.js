//Include Dependencies

//Packages
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

//Our Modules
const friendModule = require("./app/data/friends.js"); //Stackoverflow states that Node does not yet support ES6 Import statements

//App Setup and Initialization
var app = express();
const PORT = 4000;

app.get("/", function(request, response){
    response.sendfile("./public/home.html");
});

app.get("/survey", function(request, response){
    response.sendfile("./public/survey.html");
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });