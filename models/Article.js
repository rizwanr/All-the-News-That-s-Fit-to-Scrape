const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  // `title` is required and of type String
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true

  },
  url: {
    type: String,
    required: true

  },

  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }


})

const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article;