const PDF = require("pdfkit");

exports.createPDF = (trip, res) => {
  const doc = new PDF();
  doc.pipe(res);
  doc.text(`Trip to ${trip.destination}`);
  trip.itinerary.forEach(d =>
    doc.text(`Day ${d.day}: ${d.morning}, ${d.afternoon}, ${d.evening}`)
  );
  doc.end();
};
