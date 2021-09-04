// importing middleware
const mongoose = require('mongoose');

// defining schema to use the schema object
const Schema = mongoose.Schema;

// defines a schema type for the middleware currency
require('mongoose-currency').loadType(mongoose);

// useing currency type for a specified key:value pair
const Currency = mongoose.Types.Currency;

// now seeing new keyword new instance of schema
const commentSchema = new Schema({
  // what is JSON
  // it is a data structure that contains a key:value pair
  // inside a schema we are defining its properties
  rating: {
    type: Number, // type refers to how will store in database
    min: 1,
    max: 5,
    required: true // user cannot make post request without having this
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
}, {
  timestamps: true // meaning we update or create document 
});

const campsiteSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true // there is only one bobby, one rodrick
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  elevation: {
    type: Number,
    required: true
  },
  cost: {
    type: Currency,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  // sub-document for when you need many of same instances in a document
  comments: [commentSchema]
}, {
    timestamps: true
});

//creating a variable named campsite
// the value uses third party middleware mongoose and uses
// a function called model()
// model the first arg is name of the collection
// the second arg is the schema we will have built
// in other words we are just creating this schema called campsite inside our database
const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports = Campsite;