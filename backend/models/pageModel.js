const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 40,
  },

  subText: String,

  content: {
    type: String,
    required: true,
  },

  attachment: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  createdBy: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  modifiedAt: {
    type: Date,
    default: Date.now(),
  },

  status: {
    type: String,
    required: true,
  },

  publishTime: {
    type: Date,
  },

  pageUrl: {
    type: String,
    required: true,
    unique: true,
  },

  showAuthor: {
    type: Boolean,
    default: false,
  },

  emailSent: {
    type: Boolean,
    default: false,
  },
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
