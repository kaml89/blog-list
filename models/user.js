const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const userSchema = Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  name: String,
  blogs: [{ type: Schema.Types.ObjectID, ref: 'Blog' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)

