const groq = require('./groqService');
const google = require('./googleService');

function makeGoogleMapsLink(lat, lng, name) {
  if (!lat || !lng) return null;
  const encoded = encodeURIComponent(name || '');
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}%20(${encoded})`;
}

async function estimateCosts(country, days = 1, budget = 'medium') {
  const multiplier = budget === 'low' ? 0.7 : budget === 'luxury' ? 2 : 1;
  const accommodation = Math.round(50 * multiplier * days);
  const food = Math.round(30 * multiplier * days);
  const transport = Math.round(8 * multiplier * days);
  const attractions = Math.round(12 * multiplier * days);
  const total = accommodation + food + transport + attractions;
  return { accommodation, food, transport, attractions, total, currency: 'USD' };
}

async function predictCrowdLevel({ date }) {
  try {
    const d = date ? new Date(date) : new Date();
    const isWeekend = [0, 6].includes(d.getUTCDay());
    return { level: isWeekend ? 'High' : 'Medium', bestHours: isWeekend ? '08:00–11:00' : '09:00–12:00', reason: 'heuristic' };
  } catch {
    return { level: 'Unknown', bestHours: null, reason: 'error' };
  }
}

function safeJsonParse(raw) {
  if (!raw) return null;
  let txt = raw.trim();
  const fenced = txt.match(/```json([\s\S]*?)```/);
  if (fenced) txt = fenced[1].trim();
  const first = txt.indexOf('{');
  const last = txt.lastIndexOf('}');
  if (first !== -1 && last !== -1) txt = txt.substring(first, last + 1);
  return JSON.parse(txt);
}

function buildPrompt(meta, places) {
  const snippet = JSON.stringify(places.slice(0, 20), null, 2);
  return `
Generate a detailed day-wise itinerary. Output ONLY valid JSON in this format:

{
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "morning": [{ "placeId":"", "name":"", "lat":0, "lng":0 }],
      "afternoon": [],
      "evening": [],
      "notes": ""
    }
  ],
  "route": [
    { "placeId":"", "name":"", "lat":0, "lng":0, "mapsLink":"" }
  ],
  "warnings": []
}

User Input:
${JSON.stringify(meta)}

Places to use:
${snippet}

RULES:
- ALWAYS return valid JSON.
- Use only places from "Places to use".
- If lat/lng missing, set them to null.
- Add mapsLink as: https://www.google.com/maps/search/?api=1&query=LAT,LNG (NAME)
- If unsure, leave arrays empty.
`.trim();
}

async function generateItineraryDraft(payload = {}) {
  const { country, city, days = 1, interests = [], budget = 'medium', travelStyle = 'relaxed', startDate = null } = payload;

  // 1. fetch places
  let places = [];
  try {
    const q = `${city || country || ''} ${interests[0] || 'tourist attractions'}`.trim();
    places = await google.cachedSearch({ query: q, regionKey: `${city || country}_search` });
  } catch (err) {
    console.error('Google search failed', err);
    places = [];
  }

  // 2. cost
  const costEstimate = await estimateCosts(country, days, budget);

  // 3. build prompt
  const prompt = buildPrompt({ country, city, days, interests, budget, travelStyle, startDate }, places);

  // 4. call GROQ
  let raw;
  try {
    raw = await groq.callGroq(prompt);
  } catch (err) {
    console.error('Groq call failed', err);
    throw err;
  }

  // 5. parse
  let parsed;
  try {
    parsed = safeJsonParse(raw);
  } catch (err) {
    console.error('Parse failed, falling back', err);
    parsed = null;
  }

  // 6. fallback
  if (!parsed) {
    parsed = {
      days: Array.from({ length: days }).map((_, i) => ({
        day: i + 1,
        date: startDate ? new Date(new Date(startDate).getTime() + i * 86400000).toISOString().slice(0, 10) : null,
        morning: [],
        afternoon: [],
        evening: [],
        notes: 'Fallback itinerary — AI parse failed.'
      })),
      route: places.map(p => ({ placeId: p.placeId, name: p.name, lat: p.lat, lng: p.lng, mapsLink: p.lat && p.lng ? makeGoogleMapsLink(p.lat, p.lng, p.name) : null })),
      warnings: []
    };
  }

  // 7. ensure coords/mapsLink and crowd
  const placesMap = new Map((places || []).map(p => [p.placeId, p]));
  parsed.route = (parsed.route || []).map(item => {
    const p = item.placeId ? placesMap.get(item.placeId) : null;
    const lat = item.lat ?? p?.lat ?? null;
    const lng = item.lng ?? p?.lng ?? null;
    return { ...item, lat, lng, mapsLink: lat && lng ? makeGoogleMapsLink(lat, lng, item.name || p?.name) : null };
  });

  for (let i = 0; i < parsed.route.length; i++) {
    try {
      parsed.route[i].crowdPrediction = await predictCrowdLevel({ date: startDate });
    } catch {
      parsed.route[i].crowdPrediction = { level: 'Unknown', bestHours: null, reason: 'error' };
    }
  }

  parsed.costEstimate = parsed.costEstimate || costEstimate;

  return { generatedPlan: parsed, costEstimate: parsed.costEstimate, route: parsed.route };
}

module.exports = { generateItineraryDraft };
