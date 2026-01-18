const r = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const c = require("../controllers/user.controller");

r.get("/profile", auth, c.getProfile);
r.put("/profile", auth, c.updateProfile);

r.get("/settings", auth, c.getSettings);
r.put("/settings", auth, c.updateSettings);

r.post("/change-password", auth, c.changePassword);
r.delete("/account", auth, c.deleteAccount);

module.exports = r;
