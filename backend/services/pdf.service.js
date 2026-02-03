let PDFDocument;
try {
  // pdfkit is an optional runtime dependency for the PDF export route.
  // If it isn't installed in the current deployment, don't crash the whole API.
  // eslint-disable-next-line global-require
  PDFDocument = require("pdfkit");
} catch {
  PDFDocument = null;
}
const axios = require("axios");

exports.createPDF = async (trip, res) => {
  if (!PDFDocument) {
    return res
      .status(501)
      .json({ message: "PDF generation is not available on this deployment." });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=trip-${trip.destination || "itinerary"}.pdf`
  );

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  const writeSectionTitle = (title) => {
    doc.moveDown(0.8);
    doc.fontSize(16).fillColor("black").text(title, { underline: true });
    doc.moveDown(0.3);
  };

  const writeLabelValue = (label, value) => {
    if (value === undefined || value === null || value === "") return;
    doc.fontSize(11).fillColor("#111827").text(`${label}: `, { continued: true });
    doc.fontSize(11).fillColor("#374151").text(String(value));
    doc.fillColor("black");
  };

  const writeBullets = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    items
      .filter((x) => x !== undefined && x !== null && String(x).trim())
      .forEach((x) => {
        doc.fontSize(11).fillColor("#374151").text(`• ${String(x).trim()}`);
      });
    doc.fillColor("black");
  };

  const formatTicketPrice = (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "number" && Number.isFinite(value)) {
      return `Paid: $${value}`;
    }

    const raw = String(value).trim();
    if (!raw) return null;

    if (/\bfree\b/i.test(raw) || /no\s*cost/i.test(raw) || /complimentary/i.test(raw)) {
      return "Free";
    }

    // Try to extract a price-like token (currency + digits, or digits with optional decimals).
    const priceToken = raw.match(/([₹$€£]\s*\d+(?:[\.,]\d+)?|\d+(?:[\.,]\d+)?\s*(?:INR|USD|EUR|GBP))/i);
    if (priceToken && priceToken[0]) {
      return `Paid: ${priceToken[0].trim()}`;
    }

    return `Paid: ${raw}`;
  };

  // ================= TITLE =================
  const destination = trip?.destination || "Your Trip";
  doc.fontSize(22).text(`Trip to ${destination}`, { align: "center" });
  doc.moveDown(1.5);

  // Keep the header compact to avoid duplicating details that are printed later.
  const metaParts = [];
  if (typeof trip?.days === "number" && trip.days > 0) metaParts.push(`${trip.days} day${trip.days === 1 ? "" : "s"}`);
  if (trip?.budget) metaParts.push(`Budget: ${trip.budget}`);
  if (typeof trip?.maxBudget === "number") metaParts.push(`Max budget: $${trip.maxBudget}`);
  if (trip?.tripPace) metaParts.push(`Pace: ${trip.tripPace}`);
  if (trip?.transportMode) metaParts.push(`Transport: ${trip.transportMode}`);
  if (metaParts.length > 0) {
    doc.fontSize(11).fillColor("#374151").text(metaParts.join(" • "), { align: "center" });
    doc.fillColor("black");
    doc.moveDown(1);
  }

  const buildDirectionsUrl = (destinationQuery) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;

  const extractPlaceName = (text) => {
    let t = String(text ?? "").trim();

    // Remove leading numbering like "1." and time-of-day prefixes.
    t = t.replace(/^\s*\d+\s*\.\s*/, "");
    t = t.replace(/^(Morning|Afternoon|Evening)\s*:\s*/i, "");

    // Prefer the title before ':' (common in your itinerary format).
    const colonIndex = t.indexOf(":");
    if (colonIndex > 0) {
      t = t.slice(0, colonIndex).trim();
    }

    // Remove common leading verbs.
    t = t.replace(/^(Visit|Explore|Evening at|Shopping at|Relax and enjoy)\s+/i, "");

    // Strip trailing punctuation.
    t = t.replace(/[.,;:\-–]+\s*$/, "").trim();

    return t.length >= 3 ? t : String(text ?? "").trim();
  };

  const writeMapsLink = (label, destinationQuery) => {
    const url = buildDirectionsUrl(destinationQuery);
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

  const hasTransport = !!trip?.transportInfo || trip?.estimatedTransportCost !== undefined;
  const hasWeather = !!trip?.weatherInfo;
  const hasEmergency = !!trip?.emergencyInfo;
  const hasBudget = trip?.maxBudget !== undefined && trip?.maxBudget !== null;
  const hasPace = !!trip?.tripPace;
  const hasAlternates = Array.isArray(trip?.alternativePlans) && trip.alternativePlans.length > 0;
  const hasExtras = hasTransport || hasWeather || hasEmergency || hasBudget || hasPace || hasAlternates;

  for (let index = 0; index < itinerary.length; index++) {
    const day = itinerary[index];
    doc.fontSize(16).text(`Day ${day.day}`, { underline: true });
    doc.moveDown(0.5);

    // ---- ITINERARY TEXT + CLICKABLE MAP LINKS ----
    const hasActivities = Array.isArray(day.activities) && day.activities.length > 0;
    const slotItems = [];
    if (!hasActivities) {
      if (day.morning) slotItems.push(`Morning: ${String(day.morning).trim()}`);
      if (day.afternoon) slotItems.push(`Afternoon: ${String(day.afternoon).trim()}`);
      if (day.evening) slotItems.push(`Evening: ${String(day.evening).trim()}`);
    }

    if (!hasActivities && slotItems.length === 0) {
      doc.fontSize(12).text("No itinerary details for this day.");
    } else if (!hasActivities) {
      slotItems.forEach((text, i) => {
        doc.fontSize(12).fillColor("black").text(`${i + 1}. ${text}`);
        const placeName = extractPlaceName(text);
        const destinationQuery =
          placeName.toLowerCase().includes(String(destination).toLowerCase())
            ? placeName
            : `${placeName}, ${destination}`;
        writeMapsLink("Get Directions (Google Maps)", destinationQuery);
        doc.moveDown(0.2);
      });
    } else {
      day.activities.forEach((a, i) => {
        const name =
          typeof a === "string"
            ? a.trim()
            : typeof a === "object" && a?.name && typeof a.name === "string"
              ? a.name.trim()
              : "";

        if (!name) return;

        doc.fontSize(12).fillColor("black").text(`${i + 1}. ${name}`);

        // Optional metadata from enriched activity objects
        if (typeof a === "object" && a) {
          const ticketText = formatTicketPrice(a.ticketPrice);
          if (ticketText) doc.fontSize(10).fillColor("#374151").text(`   Ticket: ${ticketText}`);
          if (a.bestTime) {
            doc.fontSize(10).fillColor("#374151").text(`   Best time: ${String(a.bestTime)}`);
          }
          doc.fillColor("black");
        }

        const placeName = extractPlaceName(name);
        const destinationQuery =
          placeName.toLowerCase().includes(String(destination).toLowerCase())
            ? placeName
            : `${placeName}, ${destination}`;
        writeMapsLink("Get Directions (Google Maps)", destinationQuery);
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

  // ================= EXTRAS (shown on page) =================
  // The trip details are already printed under the destination title.
  // Keep the detailed sections for longer content only when needed.
  if (hasExtras) {
    doc.addPage();
    writeSectionTitle("Trip Information");

    // ---- Transport ----
    if (hasTransport) {
      writeSectionTitle("Transport");

      const t = trip.transportInfo || {};
      const totalDistance = t.totalDistance ?? (trip.transportInfo?.totalDistance);
      const totalCost = t.totalCost ?? trip.estimatedTransportCost;
      const totalTime = t.totalTime;
      const mode = t.mode ?? trip.transportMode;

      if (totalDistance !== undefined) writeLabelValue("Total distance", `${totalDistance} km`);
      if (totalCost !== undefined) writeLabelValue("Total cost", `$${totalCost}`);
      if (typeof totalTime === "number") {
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        writeLabelValue("Total time", `${hours}h ${minutes}m`);
      }
      if (mode) writeLabelValue("Mode", mode);

      if (t.recommendation?.suggestion || t.recommendation?.reason) {
        doc.moveDown(0.2);
        writeLabelValue("Recommendation", `${t.recommendation?.suggestion || ""}${t.recommendation?.reason ? ` — ${t.recommendation.reason}` : ""}`.trim());
      }
    }

    // ---- Weather ----
    if (hasWeather) {
      writeSectionTitle("Weather");
      writeLabelValue("Season", trip.weatherInfo?.season);
      writeLabelValue("Temperature", trip.weatherInfo?.temp);
    }

    // ---- Emergency & Safety ----
    if (hasEmergency) {
      writeSectionTitle("Emergency & Safety");
      writeLabelValue("Destination", trip.emergencyInfo?.destination);
      writeLabelValue("Country", trip.emergencyInfo?.country);
      doc.moveDown(0.3);

      const numbers = [];
      if (trip.emergencyInfo?.police) numbers.push(`Police: ${trip.emergencyInfo.police}`);
      if (trip.emergencyInfo?.ambulance) numbers.push(`Ambulance: ${trip.emergencyInfo.ambulance}`);
      if (trip.emergencyInfo?.fire) numbers.push(`Fire: ${trip.emergencyInfo.fire}`);
      if (trip.emergencyInfo?.touristHelpline) numbers.push(`Tourist helpline: ${trip.emergencyInfo.touristHelpline}`);
      if (numbers.length > 0) {
        doc.fontSize(12).text("Emergency numbers:");
        writeBullets(numbers);
      }

      if (Array.isArray(trip.emergencyInfo?.safeZones) && trip.emergencyInfo.safeZones.length > 0) {
        doc.moveDown(0.3);
        doc.fontSize(12).text("Safe zones:");
        writeBullets(trip.emergencyInfo.safeZones);
      }

      if (Array.isArray(trip.emergencyInfo?.localCustoms) && trip.emergencyInfo.localCustoms.length > 0) {
        doc.moveDown(0.3);
        doc.fontSize(12).text("Local customs & tips:");
        writeBullets(trip.emergencyInfo.localCustoms);
      }

      if (Array.isArray(trip.emergencyInfo?.usefulPhrases) && trip.emergencyInfo.usefulPhrases.length > 0) {
        doc.moveDown(0.3);
        doc.fontSize(12).text("Useful emergency phrases:");
        writeBullets(trip.emergencyInfo.usefulPhrases);
      }
    }

    // ---- Budget ----
    if (hasBudget) {
      writeSectionTitle("Budget");
      writeLabelValue("Max budget", `$${trip.maxBudget}`);
    }

    // ---- Pace ----
    if (hasPace) {
      writeSectionTitle("Trip Pace");
      writeLabelValue("Pace", trip.tripPace);
    }

    // ---- Alternate Plans (if generated) ----
    if (hasAlternates) {
      writeSectionTitle("Alternate Plans");
      trip.alternativePlans.forEach((plan, idx) => {
        doc.fontSize(13).fillColor("#111827").text(`${idx + 1}. ${plan?.scenario || "Alternate plan"}`);
        doc.fillColor("black");

        if (Array.isArray(plan?.changes) && plan.changes.length > 0) {
          writeBullets(plan.changes);
        }

        const altItinerary = Array.isArray(plan?.itinerary) ? plan.itinerary : [];
        if (altItinerary.length > 0) {
          doc.fontSize(11).fillColor("#374151").text("Itinerary:");
          doc.fillColor("black");
          for (const d of altItinerary) {
            doc.fontSize(11).text(`Day ${d.day}`);
            const altItems = [];
            if (Array.isArray(d.activities) && d.activities.length > 0) {
              for (const a of d.activities) {
                if (typeof a === "string" && a.trim()) altItems.push(a.trim());
                else if (typeof a === "object" && a?.name && typeof a.name === "string") {
                  const ticketText = formatTicketPrice(a.ticketPrice);
                  altItems.push(ticketText ? `${a.name.trim()} (Ticket: ${ticketText})` : a.name.trim());
                }
              }
            } else {
              if (d.morning) altItems.push(`Morning: ${String(d.morning).trim()}`);
              if (d.afternoon) altItems.push(`Afternoon: ${String(d.afternoon).trim()}`);
              if (d.evening) altItems.push(`Evening: ${String(d.evening).trim()}`);
            }

            // Keep the PDF readable: show up to 5 items per day.
            writeBullets(altItems.slice(0, 5));
          }
        }

        doc.moveDown(0.5);
      });
    }
  }

  doc.end();
};