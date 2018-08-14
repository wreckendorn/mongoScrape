var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var app = express();
var db = require("./models");
var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.static("public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ 
  extended: true 
}));
// parse application/json
// app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI;
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//THIS WORKS - grabs all scraped articles from the collection
app.get("/", function(req, res) {
    // Query: In our database, go to the articles collection, then "find" everything
        db.Article.find({}, function(err, found) {
            // Log any errors if the server encounters one
            if (err) {
            console.log(err);
            }
            // Otherwise, send the result of this query to the browser
            else {
            res.render("index",{articles:found});
            }
        });
});

//THIS WORKS - displays all saved articles
app.get("/saved", function (req, res) {
  db.Article.find({ saved: true}, function (err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("saved", {articles:found})
    }
  });
});

//THIS WORKS - changes saved state to true when Save button is clicked
app.get("/api/saved/:id", function(req, res) {
  db.Article.update(
    {
      _id: mongojs.ObjectId(req.params.id)
  }, 
  {
    $set: {
      saved: true
    }
  },
  function(err, edited) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
      res.send(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        // console.log(found);
      res.send(edited);
      }
    }
  );
});

app.get("/api/notes/:id", function(req, res) {
  db.Article.find({ _id: mongojs.ObjectId(req.params.id)}, 
  function (err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(found);
    }
  });
});


console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from medium's webdev board:" +
            "\n***********************************\n");

            //THIS WORKS =========
app.get("/scrape", function(req, res) {
request("https://medium.com/", function(error, response, html) {
  var $ = cheerio.load(html);

  $("h3").each(function(i, element) {
    var result = {};
    
    result.title = $(element).text();
    result.link = $(element).parent().attr("href");

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
        });


      res.send("Scrape Complete");
    });
  });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/saved/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

app.listen(PORT, function() {
    console.log("App running on port 3000!");
  });