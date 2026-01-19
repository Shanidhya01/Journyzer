const r = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const c = require("../controllers/itinerary.controller");

r.post("/generate", auth, c.generate);
module.exports = r;