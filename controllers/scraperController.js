const express = require('express')
const axios = require("axios");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
var router = express.Router();

// Require all models
var db = require("../models");


// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});


// scrape articles
router.get("/scrape", function (req, res) {
  // A GET route for scraping the nytimes website
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {

      // Save an empty result object
      var result = {};
      result.headline = $(element).find("h2").text().trim();
      result.url = `https://www.nytimes.com${$(element).find("a").attr("href")}`;
      result.summary = $(element).find("p").text().trim();

      console.log(result)



      if (result.headline !== '' && result.summary !== '') {
        db.Article.findOne({
          headline: result.headline
        }, function (err, data) {
          if (err) {
            console.log(err)
          } else {
            if (data === null) {
              db.Article.create(result)
                .then(function (dbArticle) {
                  console.log(dbArticle)
                })
                .catch(function (err) {
                  // If an error occurred, send it to the client
                  console.log(err)
                });
            }
            console.log(data)
          }
        });
      }

    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("scraper completed");
  });
});


// Route for getting all Articles from the db
router.get("/", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      console.log(dbArticle)
      // If we were able to successfully find Articles, send them back to the client
      var hbsObject = {
        //the object we pass to the handlebar
        article: dbArticle
      };
      res.render("index", hbsObject);
      //

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for getting all Articles from the db
router.get("/saved", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({
    "saved": true
  }).populate("notes").exec(function (error, articles){
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
    });
});



router.post("/note/save/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new db.Note({
    body: req.body.text,
    article: req.params.id
  });
  // And save the new note the db
  newNote.save(function (error, note) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's notes
      db.Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
        // Execute the above query
        .exec(function (err) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            // Or send the note to the browser
            res.send(note);
          }
        });
    }
  });
});


router.put("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({
    _id: req.params.id
  }, {
      saved: true
    })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      console.log(data)
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
})

// get back all notes for a given article
router.get("/article/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.find({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate({
      path: 'note',
      model: 'Note'
    })
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle.note);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/article/delete/:id", function (req, res) {
  db.Article.findOneAndRemove({
      _id: req.params.id
    })
    .then(function (data) {

      console.log(data)
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
});

router.get("/articles/clear", function (req, res) {
  console.log(req.body)
  db.Article.deleteMany({}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.send(true)
    }
  })
});










module.exports = router;