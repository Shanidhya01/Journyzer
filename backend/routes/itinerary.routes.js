const r = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const c = require("../controllers/itinerary.controller");

r.post("/generate", auth, c.generate);
r.post("/generate-alternate", auth, c.generateAlternate);
r.get("/compare-transport/:tripId", auth, c.compareTransport);

module.exports = r;