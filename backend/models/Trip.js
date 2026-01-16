const mongoose = require("mongoose");

module.exports = mongoose.model("Trip", new mongoose.Schema({
  userId: String,
  destination: String,
  days: Number,
  interests: [String],
  budget: String,
  itinerary: Array,
  locations: Array,
  totalCost: Number,
  createdAt: { type: Date, default: Date.now },
}));
