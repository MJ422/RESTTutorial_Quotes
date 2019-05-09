//
//// QUOTES-API - Mike C - Re-Do 5/3/2019!
//
//First, require express and body-parser as dependencies!
var express = require("express");
var bodyParser = require("body-parser");
//Now, it's time for some database action! First, create dependency for the DBMS sqlite3 
var sqlite = require('sqlite3');

//We also need to create a db object for our quotes database
var db = new sqlite.Database('QuotesBank.db');


//Then, create an object of the Express module to use in this server
var app = express();
// Also, create an instance of usage for body-parser as an addon to Express
// This is allows url-encoded data - HTML forms are this type of data format
app.use(bodyParser.urlencoded({ extended: true }));

//Now, create the port at the required port#
var port = 3000;

//Remember, every REST API must set up its request handler!
app.listen(port, function () {
  console.log("Now listening on port: " + port);
});

//Now, we set up the endpoints for specific requests (.get) and their URI (p1)
app.get("/", function (request, response) {
  response.send("Welcome to the Home Page, Baby!");
});

// Since we dont have a DATABASE YET!! we will have to hard code our data
// object (an array JSON objects)
var quotes = [
  {
    id: 1,
    quote: "It's all in the reflexes.",
    author: "Jack Burton",
    year: 1986
  },
  {
    id: 2,
    quote: "If it bleeds, we can kill it.",
    author: "Maj. Alan 'Dutch' Schaefer",
    year: 1987
  },
  {
    id: 3,
    quote: "Either put on these glasses, or start eating that trash can...",
    author: "John Nada",
    year: 1988
  }
];

/* 
We want our API to be able to return quotes filtered by year. For that, 
we let it accept a Query String, an extra piece of information inlcuded 
in the request URL!

Query Strings can be included in the Request URI in the following format:
    baseURL/path?query=value 
    ---------
    query == the name of the query string
    value == its value to filter by 

    example for this quotes project would be:
    localhost3000/quotes?year=1987
*/
//Set up endpoint for GET reqs at the /quotes path
//

//Request handler for: GET request, on "/quotes", with query option for year
app.get("/quotes", function (req, res) {
  if (req.query.year) {
    db.all('SELECT * FROM quotes WHERE year = ?', [parseInt(req.query.year)], function (err, rows) {
      if (err) {
        res.send("Error!: " + err.message);
      }
      else {
        console.log("Returning a list of quotes from the year: " + req.query.year);
        res.json(rows);
        //convert all of the information in the rows that come up after the query in to a JSON
      }
    });
    // make a placeholder message that tells the developer
    // (to create code that tells the API to...) return only the query'd year
  }
  else if (req.query.author) {
    db.all('SELECT * FROM quotes WHERE author = ?', (req.query.author), function (err, rows) {
      if (err) {
        res.send("Error!: " + err.message);
      }
      else {
        console.log("Returning a list of quotes from author: " + req.query.author);
        res.json(rows);
        //convert all of the information in the rows that come up after the query in to a JSON
      }
    });
  }
  else if (req.query.id) {
    db.get('SELECT * FROM quotes WHERE author = ?', (req.query.id), function (err, rows) {
      if (err) {
        res.send("Error!: " + err.message);
      }
      else {
        console.log("Returning a math for the quote: " + req.query.id);
        res.json(rows);
        //convert all of the information in the rows that come up after the query in to a JSON
      }
    });
  }
  else {
    db.all('SELECT * FROM quotes', function processRows(err, rows) {
      if (err) {
        res.send(err.message);
      }
      else {
        for (var i = 0; i < rows.length; i++) {
          console.log(rows[i].quote);
        }//end inner for loop
        res.json(rows);
      }
    });
  }
  // We have a catch if anyone passes a query for year in the URL asking
  // for a specific year category of quotes.
});




//This code is now moot! We have added a new catch for querying author AND id in lines 75 - 112
app.get("/quotes/:id", function (req, res) {
  console.log("Return quote with the ID: " + req.params.id);
  res.send("Return quote with the ID: " + req.params.id);
  /* Notice how the :id is created as a sort-of param that awaits any
     actual number passed in to represent the id number

     Note: this is not the same as a query, so there is no use of ?query=val
     instead, it is created as a sub-file delimited by /

     so: localhost:3000/quotes/2
  */
});




// The next two get handlers will use Named Route Parameters - this is where
// the API is expecting a specific search key to be passed in the URI as
// denoted by the " : " character preceding "id"



app.get("/quotes/by/:author", function (req, res) {
  console.log("Returning quotes by the author: " + req.params.author);
  //first, log the process for developer notes
  res.send("Return a quote with by the author: " + req.params.author);
  // Response currently set: notification in the form of a string,
  // using the req object in the .get's parameter to call the parameters
  // of the object passed in: in this case, a JSON object. That JSON
  // has a field "author", this is where Express will look to find the content
  // to display
});



app.delete("/quotes/delete/:id", function (req, res) {
  console.log("Deleting quote with the quote ID: " + req.params.id);
});



app.post("/quotes", function (req, res) {
  console.log("Insert a new quote: " + req.body.quote);
  //log the synopsis of the process
  res.json(req.body);
  //assign the response (in JSON format) = the body of the POST request
});

