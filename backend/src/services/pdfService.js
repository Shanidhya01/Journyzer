const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function listPlaces(arr) {
  if (!arr || !arr.length) return '—';
  return arr.map(p => p.name || p).join(', ');
}

function buildTripHtml(trip) {
  const daysHtml = (trip.generatedPlan?.days || []).map(d => `
    <h3>Day ${d.day} ${d.date ? '- ' + d.date : ''}</h3>
    <p><strong>Morning:</strong> ${listPlaces(d.morning)}</p>
    <p><strong>Afternoon:</strong> ${listPlaces(d.afternoon)}</p>
    <p><strong>Evening:</strong> ${listPlaces(d.evening)}</p>
    <p>${d.notes || ''}</p>
    <hr/>
  `).join('\n');

  const routeHtml = (trip.route || []).map((r,i) => `<li>${i+1}. ${r.name || ''} — ${r.mapsLink ? `<a href="${r.mapsLink}">maps</a>` : 'no link'}</li>`).join('');

  const cost = trip.costEstimate ? `
    <h3>Costs</h3>
    <ul>
      <li>Accommodation: ${trip.costEstimate.accommodation}</li>
      <li>Food: ${trip.costEstimate.food}</li>
      <li>Transport: ${trip.costEstimate.transport}</li>
      <li>Attractions: ${trip.costEstimate.attractions}</li>
      <li><strong>Total:</strong> ${trip.costEstimate.total} ${trip.costEstimate.currency || ''}</li>
    </ul>
  ` : '';

  return `
  <html>
    <head><meta charset="utf-8"/><title>${trip.name || 'Trip'}</title></head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>${trip.name || 'Itinerary'}</h1>
      <p>${trip.city || ''} ${trip.country || ''} — ${trip.days || ''} days</p>
      ${cost}
      <h3>Daily Plan</h3>
      ${daysHtml}
      <h3>Route</h3>
      <ol>${routeHtml}</ol>
    </body>
  </html>
  `;
}

async function generateTripPdf(trip) {
  const tmpDir = process.env.PDF_TMP_DIR || '/tmp';
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const html = buildTripHtml(trip);
  const filename = `trip-${trip._id}-${Date.now()}.pdf`;
  const outPath = path.join(tmpDir, filename);
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outPath, format: 'A4', printBackground: true });
    return outPath;
  } finally {
    await browser.close();
  }
}

module.exports = { generateTripPdf };
