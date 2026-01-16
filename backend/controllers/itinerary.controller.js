const ai = require("../services/ai.service");
const map = require("../services/map.service");
const Trip = require("../models/Trip");

exports.generate = async (req, res, next) => {
  try {
    const result = await ai.generateItinerary(req.body);
    const itinerary = result.itinerary; // <-- IMPORTANT
    const locations = [];

    if (!Array.isArray(itinerary)) {
      const err = new Error("AI response did not include a valid itinerary array");
      err.statusCode = 502;
      throw err;
    }

    for (const day of itinerary) {
      for (const activity of day.activities) {
        const loc = await map.getCoordinates(
          activity,
          req.body.destination || req.body.country
        );

        if (loc) {
          locations.push({
            name: activity,
            ...loc,
            day: day.day,
          });
        }
      }
    }

    const destination = req.body.destination || req.body.country;
    const payload = {
      destination,
      days: req.body.days,
      interests: req.body.interests,
      itinerary,
      locations,
    };

    // If tripId is provided, update an existing trip, otherwise create a new one.
    let trip;
    if (req.body.tripId) {
      trip = await Trip.findOneAndUpdate(
        { _id: req.body.tripId, userId: req.user.uid },
        { $set: payload },
        { new: true }
      );

      if (!trip) {
        const err = new Error("Trip not found");
        err.statusCode = 404;
        throw err;
      }

      return res.status(200).json({ trip, itinerary, locations });
    }

    trip = await Trip.create({ userId: req.user.uid, ...payload });
    return res.status(201).json({ trip, itinerary, locations });
  } catch (error) {
    next(error);
  }
};
