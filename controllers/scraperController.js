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
router.get("/articles", function (req, res) {
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
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Delete One from the DB
router.get("/delete/:id", function (req, res) {
  // Remove a note using the objectID
  db.Article.remove({
      _id: mongojs.ObjectID(req.params.id)
    },
    function (error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.render("index", hbsObject);
      }
    }
  );
});


module.exports = router;