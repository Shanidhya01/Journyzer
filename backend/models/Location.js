const mongoose = require("mongoose");

module.exports = mongoose.model("Location", new mongoose.Schema({
  tripId: mongoose.Schema.Types.ObjectId,
  name: String,
  lat: Number,
  lng: Number,
  day: Number,
  time: String,
}));