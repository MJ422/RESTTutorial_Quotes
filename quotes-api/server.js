


//create Express dependecy 
var express = require('express');

//create body-parser depen
var bodyparse = require('body parser');
//then, let body-parser pass on url-encoded data (POST requests)
app.use(bodyParser.urlencoded({extended: true}));


//create Express object
var app = express();

//init the port# to 3000
var port = 3000;

//request handler function below
app.listen(port, function(){
    console.log('Now listening on port: ' + port);
});

//index page, default for the / GET call 
app.get('/', function(request, response){
    console.log('GET request for \"/\"');
    response.send('Welcome to the home page, baby!');
});

//quotes bank hard coded in an array of JSON objects
var quotes = [
    {
        quote: "To be or not to be",
        author: "Prince Hamlet",
        year: 1358
    },
    {
        quote: "Shall I compare thee to a summer's day?",
        author: "Romeo",
        year: 1680
    },
    {
        quote: "Not in my house!",
        author: "Dikembe Mutumbo",
        year: 1994
    }
];

//return the above
app.get("/quotes", function(req, res){
    //console.log('Get a list of quotes as a JSON');
    //res.json(quotes);

    if (req.query.year){
        res.send("Return a list of quotes from the year: " + req.query.year);
    }
    else{
        res.json(quotes);
    }
});

//find quote by the corresponding id integer passed in the url (named route parameter)
app.get('/quotes/:id', function(req, res){
    res.send("Return quote with the ID: " + req.params.id);
    console.log("Request made for quote with ID of " + req.params.id);
});

//find quote(s) by the corresponding author string passed in to the url (named route parameter)
app.get('/quotes/by/:author', function(req, res){
    res.send("Return a quote from author: " + req.params.author);
    console.log("Get request in for quotes from author: " + req.params.author);
});

app.post('/quotes',function(req, res){
    console.log("insert a new quote in the quotes array");
    //log the synopsis of the process 
    res.json(req.body);
    //assign the response (in JSON format) = the body of the POST request
});


