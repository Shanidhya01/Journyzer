const PDFDocument = require("pdfkit");
const axios = require("axios");

exports.createPDF = async (trip, res) => {
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=trip-${trip.destination || "itinerary"}.pdf`
  );

  // ================= TITLE =================
  const destination = trip?.destination || "Your Trip";
  doc.fontSize(22).text(`Trip to ${destination}`, { align: "center" });
  doc.moveDown(1.5);

  const buildMapsUrl = (query) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const writeMapsLink = (label, query) => {
    const url = buildMapsUrl(query);
    doc
      .fontSize(10)
      .fillColor("#2563eb")
      .text(label, { link: url, underline: true });
    doc.fillColor("black");
  };

  // ================= GROUP LOCATIONS BY DAY =================
  const locationsByDay = {};
  (trip.locations || []).forEach((loc) => {
    const day = loc.day || 1;
    if (!locationsByDay[day]) locationsByDay[day] = [];
    locationsByDay[day].push(loc);
  });

  // ================= DAYS =================
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];

  for (let index = 0; index < itinerary.length; index++) {
    const day = itinerary[index];
    doc.fontSize(16).text(`Day ${day.day}`, { underline: true });
    doc.moveDown(0.5);

    // ---- ITINERARY TEXT + CLICKABLE MAP LINKS ----
    const items = [];
    if (Array.isArray(day.activities) && day.activities.length > 0) {
      for (const a of day.activities) {
        if (typeof a === "string" && a.trim()) items.push(a.trim());
      }
    } else {
      if (day.morning) items.push(`Morning: ${String(day.morning).trim()}`);
      if (day.afternoon) items.push(`Afternoon: ${String(day.afternoon).trim()}`);
      if (day.evening) items.push(`Evening: ${String(day.evening).trim()}`);
    }

    if (items.length === 0) {
      doc.fontSize(12).text("No itinerary details for this day.");
    } else {
      items.forEach((text, i) => {
        doc.fontSize(12).fillColor("black").text(`${i + 1}. ${text}`);
        const query = `${destination} ${text}`;
        writeMapsLink("View on Google Maps", query);
        doc.moveDown(0.2);
      });
    }

    doc.moveDown(0.5);

    // ---- MAP IMAGE ----
    const dayLocations = (locationsByDay[day.day] || []).filter(
      (l) =>
        typeof l?.lat === "number" &&
        typeof l?.lng === "number" &&
        Number.isFinite(l.lat) &&
        Number.isFinite(l.lng)
    );

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey && dayLocations.length > 0) {
      const markers = dayLocations.map((l) => `${l.lat},${l.lng}`).join("|");
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&markers=color:red|${markers}&key=${apiKey}`;

      try {
        const mapImage = await axios.get(mapUrl, { responseType: "arraybuffer" });
        doc.moveDown(0.5);
        doc.image(mapImage.data, { fit: [500, 250], align: "center" });
      } catch {
        // Intentionally skip map rendering if Google Static Map fails.
      }
    }

    if (index < itinerary.length - 1) {
      doc.addPage();
    }
  }

  doc.end();
};
