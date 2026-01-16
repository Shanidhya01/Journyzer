const admin = require("../config/firebase");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("Unauthorized");

    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
