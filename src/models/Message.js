const mongoose = require('../config/db');

const MessageModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true
  },
  tag: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  }
}, { versionKey: false });

module.exports = mongoose.model('messages', MessageModel);