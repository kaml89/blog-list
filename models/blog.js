const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectID, ref: 'User' },
  author: String,
  url: {type: String, required: true},
  likes: { type: Number, default: 0 },
  comments: { type: [String], required: true }

})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)

