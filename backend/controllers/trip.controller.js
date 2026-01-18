const Trip = require("../models/Trip");
const map = require("../services/map.service");

exports.save = async (req, res) => {
  res.json(await Trip.create({ userId: req.user.uid, ...req.body }));
};

exports.getAll = async (req, res) => {
  const limitRaw = req.query?.limit;
  const limit = Number(limitRaw);

  const query = Trip.find({ userId: req.user.uid }).sort({ createdAt: -1 });
  if (Number.isFinite(limit) && limit > 0) query.limit(limit);

  res.json(await query);
};

exports.updateItineraryDay = async (req, res, next) => {
  try {
    const tripId = req.params.tripId;
    const dayNumber = Number(req.params.day);

    if (!tripId) {
      const err = new Error("tripId is required");
      err.statusCode = 400;
      throw err;
    }

    if (!Number.isFinite(dayNumber) || dayNumber < 1) {
      const err = new Error("day must be a positive number");
      err.statusCode = 400;
      throw err;
    }

    const trip = await Trip.findOne({ _id: tripId, userId: req.user.uid });
    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }

    const itinerary = Array.isArray(trip.itinerary) ? [...trip.itinerary] : [];
    const idx = itinerary.findIndex((d) => Number(d?.day) === dayNumber);

    const morning = String(req.body?.morning ?? "");
    const afternoon = String(req.body?.afternoon ?? "");
    const evening = String(req.body?.evening ?? "");

    const nextDay = {
      ...(idx >= 0 && typeof itinerary[idx] === "object" ? itinerary[idx] : {}),
      day: dayNumber,
      morning,
      afternoon,
      evening,
    };

    if (idx >= 0) itinerary[idx] = nextDay;
    else itinerary.push(nextDay);

    trip.itinerary = itinerary;

    // Refresh map locations for this day based on updated text.
    const destination = trip.destination;
    const items = [morning, afternoon, evening].map((s) => String(s).trim()).filter(Boolean);
    const newLocations = [];
    for (const activity of items) {
      const loc = await map.getCoordinates(activity, destination);
      if (loc) {
        newLocations.push({
          name: activity,
          ...loc,
          day: dayNumber,
        });
      }
    }

    const existingLocations = Array.isArray(trip.locations) ? trip.locations : [];
    trip.locations = [...existingLocations.filter((l) => Number(l?.day) !== dayNumber), ...newLocations];

    await trip.save();
    res.json(trip);
  } catch (err) {
    next(err);
  }
};
