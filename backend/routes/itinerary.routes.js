const r = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const c = require("../controllers/itinerary.controller");

r.post("/generate", auth, c.generate);
r.post("/regenerate-day", auth, c.regenerateDay);
module.exports = r;
