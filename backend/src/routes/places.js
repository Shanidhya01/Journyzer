const express = require('express');
const router = express.Router();
const { cachedSearch, getDetails } = require('../services/googleService');

router.get('/search', async (req, res) => {
  try {
    const { q, city, country } = req.query;
    const query = q || `${city || ''} ${country || ''}`.trim();
    if (!query) return res.status(400).json({ error: 'query required' });
    const places = await cachedSearch({ query, regionKey: query.toLowerCase().replace(/\s+/g,'_') });
    res.json({ places });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/:placeId', async (req, res) => {
  try {
    const details = await getDetails(req.params.placeId);
    if (!details) return res.status(404).json({ error: 'not found' });
    res.json(details);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
