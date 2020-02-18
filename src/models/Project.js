const mongoose = require('../config/db');

// Relations
require('./Skill');
require('./Category');

// Functions
const { getYear } = require('../functions/general');

// Schema
const ProjectModel = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlengt: 3,
    maxlength: 26,
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
  },
  creation: {
    type: Number,
    require: true,
    min: 2019,
    validate: {
      validator: date => {
        if (date >= 2019 && date <= getYear()) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  difficulty: {
    type: Number,
    require: true,
    min: 0.5,
    max: 5,
    enum: [ 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 ]
  },
  img: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories"
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "skills",
    require: true,
    default: "5e4b1a7801bbd4668e04a92f"
  }]
}, { versionKey: false });

module.exports = mongoose.model('projects', ProjectModel);