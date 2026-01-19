const express = require("express");
const router = express.Router();
const { createPDF } = require("../services/pdf.service");
const auth = require("../middlewares/auth.middleware");

// Example Trip (replace with DB data)
router.post("/trip", auth, async (req, res, next) => {
  try {
    const trip = req.body;
    await createPDF(trip, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;