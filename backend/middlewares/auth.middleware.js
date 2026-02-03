const admin = require("../config/firebase");

module.exports = async (req, res, next) => {
  try {
    let token = null;
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) throw new Error("Unauthorized");

    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (err) {
    // Helpful in production logs when Firebase Admin credentials/project mismatch causes 401s.
    // Do not log the token.
    console.error("Auth middleware failed:", err?.message || err);
    res.status(401).json({ message: "Unauthorized" });
  }
};