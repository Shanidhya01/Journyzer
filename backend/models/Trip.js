const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: String,
  destination: String,
  days: Number,
  interests: [String],
  budget: String,
  maxBudget: Number, // New: user's max budget constraint
  tripPace: { type: String, enum: ["relaxed", "balanced", "fast"], default: "balanced" }, // New: trip pace
  transportMode: { type: String, enum: ["public", "cab", "walking", "mixed"], default: "mixed" }, // New: transport preference
  itinerary: Array,
  locations: Array,
  totalCost: Number,
  estimatedTransportCost: Number, // New: estimated transport cost
  crowdInfo: Array, // New: crowd and best time data for each location
  weatherInfo: Object, // New: weather information
  emergencyInfo: Object, // New: emergency and safety information
  alternativePlans: Array, // New: store alternative itineraries
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", tripSchema);