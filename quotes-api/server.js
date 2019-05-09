//
//// QUOTES-API - Mike C - Re-Do 5/3/2019!
//



/* 
 ***************************************************************************************************************************
       
 First, lets initialize our fields, ports, and all the good stuff needed to set up REST services

 ***************************************************************************************************************************
*/

//First, require express and body-parser as dependencies!
var express = require("express");
var bodyParser = require("body-parser");
//Now, it's time for some database action! First, create dependency for the DBMS sqlite3 
var sqlite = require('sqlite3');

//Then, create an object of the Express module to use in this server
var app = express();


// Also, create an instance of usage for body-parser as an addon to Express
// This is allows url-encoded data - HTML forms are this type of data format
app.use(bodyParser.urlencoded({ extended: true }));


//We also need to create a db object for our quotes database
var db = new sqlite.Database('QuotesBank.db');

//Now, create the port at the required port#
var port = 3000;

//Remember, every REST API must set up its request handler!
app.listen(port, function () {
  console.log("Now listening on port: " + port);
});

// This was a left-over quote array that we used before we attached our .db file.
// Let's figure out a way to transform this in to our Quotes table in QuotesBank.db! 
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
 ***************************************************************************************************************************
       
 Now, using the app and db variables we created and connected to Express and our database file, let's get to work
 creating methods that listen for certain requests and respond with logically-manipulated data!

 ***************************************************************************************************************************
*/

//Now, we set up the endpoints for specific requests: request type (.get) and their URI (param1)

// The first is just for a general page request. Takes you to the main index page of the application.
// For now, we'll denote it so we know it's the home page, via my cute message, and come back to it later.
app.get("/", function (request, response) {
  response.send("Welcome to the Home Page, Baby!");
});



/* 
We want our API to be able to return quotes filtered by year. For that, 
we let it accept a Query String: an extra piece of information inlcuded 
in the request URL!

Query Strings can be included in the Request URI in the following format:
    baseURL/path?query=value 
    ---------
    query == the name of the query string
    value == its value to filter by 

    example for this quotes project would be:
    localhost3000/quotes?year=1987
*/
//Firstly, set up a 'base' endpoint for GET requests at the /quotes path
//

app.get("/quotes", function (req, res) {

  if (req.query.year) //IF the req contains a query (?) denoted for "year", process this block
  {
    db.all('SELECT * FROM Quotes WHERE year = ?', [parseInt(req.query.year)], function (err, rows) {
      if (err) {
        res.send("Error!: " + err.message);
      }
      else {
        console.log("Returning a list of quotes from the year: " + req.query.year);
        res.json(rows);
        //convert all of the information in the rows that come up after the query in to a JSON
      }
    });
    // return only the query'd year
  }


  else if (req.query.author) //IF the req contains a query (?) denoted for "author", process this block
  {
    db.all('SELECT * FROM Quotes WHERE author = ?', (req.query.author), function (err, rows) {
      if (err) {
        res.send("Error!: " + err.message);
      }
      else {
        console.log("Returning a list of quotes from author: " + req.query.author);
        res.json(rows);
        //convert all of the information in the rows that come up after the query in to a JSON
      }
    });
    // return only the query'd author
  }


  else if (req.query.id) //IF the req contains a query (?) denoted for "id", process this block
  {
    db.get('SELECT * FROM Quotes WHERE id = ?', (req.query.id), function (err, row) {
      //Notice that we used .get instead of .all - we only expect one result because ID is the unique primary key!
      if (err) {
        res.send("Error!: " + err.message);
      }
      else {
        console.log("Returning a match for the id: " + req.query.id);
        res.json(row);
        //convert all of the information in the rows that come up after the query in to a JSON
      }
    });
    // return only the query'd id (primary key)
  }


  else //Otherwise, run a select-all query for Quotes table and return the result set as JSON (if no error)
  {
    db.all('SELECT * FROM Quotes', function processRows(err, rows) {
      if (err) {
        res.send(err.message);
      }
      else {
        for (var i = 0; i < rows.length; i++) {
          //in the npm shell, we log the values in 'quote' for each of the records in QuotesBank.db
          console.log(rows[i].quote);
        }//end inner for loop

        //Here, we send our response to the page: the entire Quotes table formatted as JSON objects 
        res.json(rows);

      }//end inner else-block for: if error report error, or else do as requested

    });//end processRows function on SELECT * FROM Quotes

  }//end outer else-block (see opening tag for note)

});//end the base function - the 'base' endpoint: .get() for /quotes 


// To delete an entry, we should make sure that we delete exactly the entry we want - this means
// that we need to identify it by a unique identifier (hint: what is the one field that gives 
// each record in the db a unique value?)
app.delete("/quotes/delete/:id", function (req, res) //Delete record with the id integer corresponding to the named route parameter (:id)
{
  console.log("Deleting quote with the quote ID: " + req.params.id);
  db.run('DELETE FROM Quotes WHERE id = ?', [req.params.id]);


});


// Finally, we learn how to convert POST requests in to records in our Quotes table! 
// First, we want to make sure we have enabled the body-parser module. (Let's recall back 
// in our lesson for the exact formatting needed when passing request body values in to Node via Express)
app.post("/quotes", function (req, res) {

  db.run('INSERT INTO Quotes (quote, author, year) VALUES(?,?,?)', [req.body.quote, req.body.author, req.body.year], function (err) {
    if (err) {
      console.log(err.message);
    }
    else {
      res.send("Inserted quote " + req.body.id);
    }

  });

});


