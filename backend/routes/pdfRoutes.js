const express = require("express");
const router = express.Router();
const { createPDF } = require("../services/pdf.service");

// Example Trip (replace with DB data)
router.post("/trip", (req, res) => {
  const trip = req.body;
  createPDF(trip, res);
});

module.exports = router;
