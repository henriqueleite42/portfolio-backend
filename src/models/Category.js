const mongoose = require('../config/db');

const CategoryModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    unique: true
  },
  link: {
    type: String,
    require: true,
    minlengt: 3,
    maxlength: 26,
    lowercase: true,
    unique: true,
    validate: {
      validator: link => /^[a-z0-9_-]{3,16}$/.test(link)
    }
  }
}, { versionKey: false });

module.exports = mongoose.model('categories', CategoryModel);