const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlacesCacheSchema = new Schema({
  regionKey: { type: String, unique: true },
  places: Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlacesCache', PlacesCacheSchema);
