const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, index: true, unique: true },
    name: String,
    email: String,
    provider: String,

    // Profile fields
    displayName: String,
    photoURL: String,
    bio: String,
    location: String,
    interests: [String],

    // Persisted settings
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
        tripReminders: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ["public", "private", "friends"],
          default: "public",
        },
        showEmail: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: true },
      },
      preferences: {
        language: { type: String, default: "en" },
        currency: { type: String, default: "USD" },
        theme: {
          type: String,
          enum: ["light", "dark", "auto"],
          default: "light",
        },
        budgetDefault: { type: String, default: "moderate" },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
