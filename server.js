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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.raw({type: 'application/vnd.custom-type'}));
app.use(bodyParser.text({type:'text/html'}));

app.get("/", function(request, response){
    response.sendfile("./public/home.html");
});

app.get("/survey", function(request, response){
    response.sendfile("./public/survey.html");
});

app.get("/api/friends",function(request, response){
    response.json(friendModule.friendArray);
});

app.get("/whoIsMyFriend/:name?", function(request, response){
    //Taking in the name parameter so that we do not return self as the best match
    var resHTML = "<h1>Your Best Match Is...</h1>";
    
    //Get the id of the person submitting this request based on their name
    let friend;
    for (friendIndex in friendModule.friendArray){
        var possibleFriend = friendModule.friendArray[friendIndex];
        console.log("Name Params: " + request.params.name);
        console.log("Possible Friend Name: " + possibleFriend.name);
        if (request.params.name == possibleFriend.name){
            friend = possibleFriend;
        }
    }
    
    //Calculate the best match based on the masterful algorithm
    var currentBestMatch;
    
    var runningMinDifference = 1000000;
    var currentDifference = runningMinDifference;
    for (candidateIndex in friendModule.friendArray){
        
        var candidate = friendModule.friendArray[candidateIndex];
        var candidateScores = candidate.scores;
        var friendScores = friend.scores;

        var totalDifference = 0;
        for (var i=0; i< 10; i++){
            candidateScore = candidateScores[i];
            friendScore = friendScores[i];
            var difference = Math.abs(friendScore - candidateScore);
            totalDifference = totalDifference + difference;
        }

        if (totalDifference < runningMinDifference){
            runningMinDifference = totalDifference;
            currentBestMatch = candidate;
        }
    }

    resHTML = resHTML + `<h2>Name: ${currentBestMatch.name}</h2>`;
    resHTML = resHTML + `<img src=${currentBestMatch.image}/>`
    
    response.send(resHTML);
});

app.post("/api/new", function(request, response){
    var newFriend = request.body;
    //Process the input from the form and convert the text input into numerical values
    var scores = [];
    for(var key in newFriend){
        var value = newFriend[key];
        console.log(value);
        if (value == "1 (Strongly Disagree)"){
            scores.push(1);
        }

        if (value == "2"){
            scores.push(2);
        }

        if (value == "3"){
            scores.push(3);
        }

        if (value == "4"){
            scores.push(4);
        }

        if (value == "5 (Strongly Agree)"){
            scores.push(5);
        }
    }

    newFriend.scores = scores;

    delete newFriend.question1;
    delete newFriend.question2;
    delete newFriend.question3;
    delete newFriend.question4;
    delete newFriend.question5;
    delete newFriend.question6;
    delete newFriend.question7;
    delete newFriend.question8;
    delete newFriend.question9;
    delete newFriend.question10;

    response.json(newFriend);

    friendModule.friendArray.push(newFriend);
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });