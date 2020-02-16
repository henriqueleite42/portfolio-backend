const mongoose = require('../config/db');

const ExperienceModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  start: {
    type: String,
    minlength: 7,
    maxlength: 7,
    required: true
  },
  end: {
    type: String,
    minlength: 7,
    maxlength: 7,
    required: true
  },
  actualJob: {
    type: Boolean,
    default: false
  },
  city: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlength: 100,
    maxlength: 1000,
    required: true
  }
}, { versionKey: false });

module.exports = mongoose.model('experience', ExperienceModel);