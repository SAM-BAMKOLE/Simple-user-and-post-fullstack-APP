const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  }
})

const postModel = mongoose
  .model('Post', postSchema);

module.exports = postModel
