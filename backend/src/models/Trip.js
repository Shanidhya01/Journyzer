const mongoose = require('mongoose');
const { Schema } = mongoose;

const TripSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: 'Untitled trip' },
  country: String,
  city: String,
  days: Number,
  startDate: Date,
  interests: [String],
  budget: String,
  travelStyle: String,
  generatedPlan: Schema.Types.Mixed,
  costEstimate: Schema.Types.Mixed,
  route: Schema.Types.Mixed,
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);
