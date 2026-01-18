const ai = require("../services/ai.service");
const map = require("../services/map.service");
const Trip = require("../models/Trip");

const splitActivitiesIntoSlots = (activities) => {
  const list = Array.isArray(activities)
    ? activities.map((a) => String(a ?? "").trim()).filter(Boolean)
    : [];

  if (list.length === 0) {
    return { morning: "", afternoon: "", evening: "" };
  }

  if (list.length === 1) {
    return { morning: list[0], afternoon: list[0], evening: list[0] };
  }

  if (list.length === 2) {
    return { morning: list[0], afternoon: list[1], evening: list[1] };
  }

  if (list.length === 3) {
    return { morning: list[0], afternoon: list[1], evening: list[2] };
  }

  const third = Math.ceil(list.length / 3);
  const morning = list.slice(0, third).join("; ");
  const afternoon = list.slice(third, third * 2).join("; ") || list[third] || "";
  const evening = list.slice(third * 2).join("; ") || list[list.length - 1] || "";
  return { morning, afternoon, evening };
};

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

    // Normalize to time-slot itinerary format expected by the UI.
    const itinerarySlots = itinerary.map((d, index) => {
      const dayNumber = Number(d?.day) || index + 1;
      const slots = splitActivitiesIntoSlots(d?.activities);
      return {
        day: dayNumber,
        ...slots,
      };
    });

    const payload = {
      destination,
      days: req.body.days,
      interests: req.body.interests,
      itinerary: itinerarySlots,
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

      return res.status(200).json({ trip, itinerary: itinerarySlots, locations });
    }

    trip = await Trip.create({ userId: req.user.uid, ...payload });
    return res.status(201).json({ trip, itinerary: itinerarySlots, locations });
  } catch (error) {
    next(error);
  }
};

exports.regenerateDay = async (req, res, next) => {
  try {
    const tripId = req.body?.tripId;
    const dayNumber = Number(req.body?.day);

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

    const destination = trip.destination;
    const days = Number(trip.days) || dayNumber;
    const interests = Array.isArray(trip.interests) ? trip.interests : [];

    // Generate a fresh 1-day plan and map it into the requested day number.
    const result = await ai.generateItinerary({ destination, days: 1, interests });
    const generated = Array.isArray(result?.itinerary) ? result.itinerary[0] : null;
    const activities = Array.isArray(generated?.activities) ? generated.activities : [];
    const slots = splitActivitiesIntoSlots(activities);

    const itinerary = Array.isArray(trip.itinerary) ? [...trip.itinerary] : [];
    const idx = itinerary.findIndex((d) => Number(d?.day) === dayNumber);
    const nextDay = {
      ...(idx >= 0 && typeof itinerary[idx] === "object" ? itinerary[idx] : {}),
      day: dayNumber,
      ...slots,
    };

    if (idx >= 0) itinerary[idx] = nextDay;
    else itinerary.push(nextDay);

    trip.itinerary = itinerary;

    // Refresh map locations for this day.
    const items = [slots.morning, slots.afternoon, slots.evening]
      .map((s) => String(s ?? "").trim())
      .filter(Boolean);

    const newLocations = [];
    for (const item of items) {
      const loc = await map.getCoordinates(item, destination);
      if (loc) {
        newLocations.push({
          name: item,
          ...loc,
          day: dayNumber,
        });
      }
    }

    const existingLocations = Array.isArray(trip.locations) ? trip.locations : [];
    trip.locations = [...existingLocations.filter((l) => Number(l?.day) !== dayNumber), ...newLocations];

    await trip.save();
    res.json(trip);
  } catch (error) {
    next(error);
  }
};
