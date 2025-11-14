const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { authMiddleware } = require('../utils/jwt');
const itineraryService = require('../services/itineraryService');
const pdfService = require('../services/pdfService');

// generate draft
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const draft = await itineraryService.generateItineraryDraft(req.body);
    res.json({ success: true, draft });
  } catch (err) {
    console.error('generate error:', err?.response?.data || err);
    res.status(500).json({ error: 'generate_failed', details: err?.message || err });
  }
});

// save/create trip
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const trip = await Trip.create({ ...data, userId: req.user.id });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// get trip
router.get('/:tripId', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'not found' });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// add destination
router.post('/:tripId/add-destination', authMiddleware, async (req, res) => {
  try {
    const { place } = req.body;
    if (!place) return res.status(400).json({ error: 'place required' });
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'trip not found' });
    trip.route = trip.route || [];
    const prev = trip.route.length ? trip.route[trip.route.length - 1] : null;
    const mapsLink = place.lat && place.lng ? `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}` : null;
    const mapsDirections = prev ? `https://www.google.com/maps/dir/?api=1&origin=${prev.lat},${prev.lng}&destination=${place.lat},${place.lng}` : null;
    trip.route.push({ ...place, mapsLink, mapsDirections });
    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// export PDF
router.post('/:tripId/export/pdf', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'not found' });
    const path = await pdfService.generateTripPdf(trip);
    res.json({ ok: true, pdfPath: path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// DOWNLOAD PDF FILE
router.get('/:tripId/pdf', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Generate fresh PDF
    const pdfPath = await pdfService.generateTripPdf(trip);

    return res.download(pdfPath, (err) => {
      if (err) {
        console.error('PDF download error:', err);
        return res.status(500).json({ error: 'Failed to download PDF' });
      }
    });
  } catch (err) {
    console.error('Download PDF error:', err);
    res.status(500).json({ error: 'server error' });
  }
});


// optimize (simple)
router.post('/:tripId/optimize', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'not found' });
    // simple optimize: sort by name
    trip.route = (trip.route || []).sort((a,b) => (a.name||'').localeCompare(b.name||''));
    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
