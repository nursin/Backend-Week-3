const mongoose = require('mongoose');
// 
const passportLocalMongoose = require('passport-local-mongoose'); // imports middleware
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
});

// handles hashing and salting the user info, also provides additional 
// authentication methods. such as the authenicate method we use later
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', userSchema);