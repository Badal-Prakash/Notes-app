const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: {
    type: "String",
    required: true,
  },
  content: {
    type: "String",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  isPinned: {
    type: "Boolean",
    default: false,
  },
  userId: {
    type: "String",
    required: true,
  },
  created_on: { type: "Date", default: new Date().getTime() },
});
module.exports = mongoose.model("Note", noteSchema);
