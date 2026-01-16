const { setToken } = require("../utils/jwt");

exports.login = (req, res) => {
  setToken(res, req.body.firebaseToken);
  res.json({ message: "Login successful" });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
