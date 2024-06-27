const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    required: true,
    lowercase: true,
  },
  password: {
    type: "String",
    required: true,
  },
  created_on: { type: "Date", default: new Date().getTime() },
});
module.exports = mongoose.model("user", userSchema);
