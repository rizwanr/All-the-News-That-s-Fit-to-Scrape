const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema({

  // `title` is of type String
  title: {
    type: String
  },
  // `body` is of type String
  body: {
    type: String
  }

})

const Note = mongoose.model("Note", NoteSchema)

module.exports = Note