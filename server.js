var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var app = express();
var db = require("./models");
var mongojs = require("mongojs");
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/News";

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ 
  extended: true 
}));
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ----- SHOW ALL SCRAPED ARTICLES -------
app.get("/", function(req, res) {
  console.log("showing all scraped articles");
  db.Article.find({}, function(err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("index",{articles:found});
    }
  });
});

// ----- SHOW SAVED ARTICLES ------
app.get("/saved/", function (req, res) {
  console.log("showing all saved articles");
  db.Article.find({ saved: true}, function (err, found) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("saved", {articles:found});
    }
  });
});

// ------ SAVE ARTICLES --------
app.get("/api/saved/:id", function(req, res) {
  console.log("is it getting hectic?");
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
    if (err) {
      console.log(err);
      res.send(err);
      }
      else {
      res.send(edited);
      }
    }
  );
});

// ------ DELETE ARTICLES --------
app.delete("/api/deleted/:id", function(req, res) {
  console.log("Here's the object to delete" + req.body);
  db.Article.remove({ _id: req.params.id}, function (error, response) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(response);
      res.send(response);
    }
  });
});

// ------ SHOW NOTE(S) FOR SELECTED ARTICLE --------
app.get("/api/notes/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.send(dbArticle);
    console.log(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});


app.get("/api/note/:id", function (req, res) {
  console.log("looking up specific note to show details of: " + req);
  db.Note.find(
    { 
      _id: mongojs.ObjectId(req.params.id)
    }, 
      function (err, noteData) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(noteData)
      console.log(noteData);
    }
  });
});

// ---------- SCRAPE ARTICLES ----------
app.get("/scrape", function(req, res) {
request("https://medium.com/", function(error, response, html) {
  var $ = cheerio.load(html);

  $("div.ui-summary").each(function(i, element) {
    var result = {};
    
    result.title = $(element).parent().prev().find("h3").text();
    var unformattedLink = $(element).parents("a").attr("href");
    result.link = unformattedLink.substr(0, unformattedLink.lastIndexOf("?") + 1);
    result.summary = $(element).text();

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

// ------- SAVE NOTE -------- 
//POST route for saving a note to the Note db. Then, update the article it is associated with the new Note object id
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true } );
    })
    .then(function(dbNote) {
      res.send(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// ------ DELETE NOTE --------
app.delete("/api/notes/:id", function(req, res) {
  console.log("Here's the id to delete" + req.params.id);
  db.Note.remove({ _id: req.params.id})
  .then(function() {
    return db.Article.update({ $pullAll: {note: [mongojs.ObjectId(req.params.id)]}})
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});


app.listen(PORT, function() {
    console.log("App running on port 3000!");
  });