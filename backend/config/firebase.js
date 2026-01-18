const admin = require("firebase-admin");
const path = require("path");

const getServiceAccountFromEnv = () => {
  // Preferred in deployments: store the whole JSON in one env var
  // FIREBASE_SERVICE_ACCOUNT_JSON='{"project_id":"...","client_email":"...","private_key":"..."}'
  const jsonEnv =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT;

  if (jsonEnv) {
    const raw = jsonEnv;
    const parsed = JSON.parse(raw);
    if (parsed?.private_key && typeof parsed.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }

  // Alternative: split env vars
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  return null;
};

const getServiceAccountFromFile = () => {
  // Local development fallback only (do not rely on this in production)
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(path.join(__dirname, "../firebaseServiceAccount.json"));
};

if (!admin.apps.length) {
  const serviceAccount = getServiceAccountFromEnv() || getServiceAccountFromFile();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
