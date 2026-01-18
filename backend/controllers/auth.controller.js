const { setToken, getCookieOptions } = require("../utils/jwt");

exports.login = (req, res) => {
  setToken(res, req.body.firebaseToken, req);
  res.json({ message: "Login successful" });
};

exports.logout = (req, res) => {
  res.clearCookie("token", getCookieOptions(req));
  res.json({ message: "Logged out" });
};
