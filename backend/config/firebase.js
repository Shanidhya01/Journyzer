const admin = require("firebase-admin");
const path = require("path");

// Load Firebase service account JSON file
const serviceAccount = require(path.join(
  __dirname,
  "../firebaseServiceAccount.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
