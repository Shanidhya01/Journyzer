const axios = require('axios');
const PlacesCache = require('../models/PlacesCache');

const KEY = process.env.GOOGLE_PLACES_KEY;
if (!KEY) console.warn('GOOGLE_PLACES_KEY not set — places endpoints will fail');

async function searchPlaces({ query }) {
  if (!query) return [];
  try {
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const params = { key: KEY, query };
    const res = await axios.get(url, { params }).then(r => r.data);
    return (res.results || []).map(p => ({
      placeId: p.place_id,
      name: p.name,
      address: p.formatted_address,
      lat: p.geometry?.location?.lat ?? null,
      lng: p.geometry?.location?.lng ?? null,
      rating: p.rating ?? null,
      types: p.types ?? []
    }));
  } catch (err) {
    console.error('Google Places search error:', err?.response?.data || err?.message || err);
    return [];
  }
}

async function getDetails(placeId) {
  try {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = { key: KEY, place_id: placeId, fields: 'name,rating,formatted_address,geometry,opening_hours,website,formatted_phone_number' };
    const res = await axios.get(url, { params }).then(r => r.data);
    const r = res.result;
    if (!r) return null;
    return {
      placeId,
      name: r.name,
      address: r.formatted_address,
      lat: r.geometry?.location?.lat ?? null,
      lng: r.geometry?.location?.lng ?? null,
      rating: r.rating ?? null,
      openingHours: r.opening_hours ?? null,
      website: r.website ?? null,
      phone: r.formatted_phone_number ?? null
    };
  } catch (err) {
    console.error('Google Places details error:', err?.response?.data || err?.message || err);
    return null;
  }
}

// caching helper
async function cachedSearch({ query, regionKey }) {
  try {
    const key = regionKey || query.toLowerCase().replace(/\s+/g, '_');
    const cached = await PlacesCache.findOne({ regionKey: key });
    const now = Date.now();
    if (cached && (now - new Date(cached.updatedAt).getTime()) < 1000 * 60 * 60 * 24) {
      return cached.places;
    }
    const places = await searchPlaces({ query });
    await PlacesCache.findOneAndUpdate({ regionKey: key }, { places, updatedAt: new Date() }, { upsert: true });
    return places;
  } catch (err) {
    console.error('cachedSearch error:', err);
    return [];
  }
}

module.exports = { searchPlaces, getDetails, cachedSearch };
