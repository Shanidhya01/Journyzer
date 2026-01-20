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
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};