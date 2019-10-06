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
      saved: true
    })
    .then(function (dbArticle) {
      console.log(dbArticle)
      // If we were able to successfully find Articles, send them back to the client
      var hbsObject = {
        //the object we pass to the handlebar
        article: dbArticle
      };
      res.render("savedArticles", hbsObject);
      //

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
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

router.delete("/articles/delete/:id", function (req, res) {
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










module.exports = router;