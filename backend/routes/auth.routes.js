const r = require("express").Router();
const c = require("../controllers/auth.controller");

r.post("/login", c.login);
r.post("/logout", c.logout);

module.exports = r;
