const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
  uid: String,
  name: String,
  email: String,
  provider: String,
}));