const mongoose = require('mongoose');
const { Schema } = mongoose;

const PreferencesSchema = new Schema({
  budget: { type: String, default: 'medium' },
  interests: [String],
  travelStyle: { type: String, default: 'relaxed' }
}, { _id: false });

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  preferences: PreferencesSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
