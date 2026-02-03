const ai = require("../services/ai.service");
const map = require("../services/map.service");
const Trip = require("../models/Trip");
const BudgetOptimizer = require("../services/budget.optimizer");
const CrowdService = require("../services/crowd.service");
const TransportService = require("../services/transport.service");
const EmergencyService = require("../services/emergency.service");

exports.generate = async (req, res, next) => {
  try {
    const {
      destination,
      country,
      days,
      interests,
      budget,
      maxBudget,
      tripPace = "balanced",
      transportMode = "mixed",
    } = req.body;

    // Generate itinerary with AI
    const result = await ai.generateItinerary({
      country,
      destination,
      days,
      interests,
      tripPace,
      maxBudget,
    });
    
    let itinerary = result.itinerary;

    if (!Array.isArray(itinerary)) {
      const err = new Error("AI response did not include a valid itinerary array");
      err.statusCode = 502;
      throw err;
    }

    // Optimize itinerary based on budget if maxBudget is provided
    let budgetInfo = null;
    if (maxBudget) {
      budgetInfo = BudgetOptimizer.optimizeItinerary({
        itinerary,
        maxBudget,
        days,
        budgetLevel: budget || "Medium",
      });
      itinerary = budgetInfo.itinerary;
    }

    // Get coordinates for all locations
    const locations = [];
    const dest = destination || country;

    for (const day of itinerary) {
      if (!Array.isArray(day.activities)) continue;
      for (const activity of day.activities) {
        // Extract activity name - always produce a string
        const rawActivityName =
          typeof activity === "string"
            ? activity
            : typeof activity?.name === "string"
              ? activity.name
              : typeof activity?.name === "number" || typeof activity?.name === "boolean"
                ? String(activity.name)
                : typeof activity === "number" || typeof activity === "boolean"
                  ? String(activity)
                  : "Unknown Location";

        const activityName = rawActivityName.trim() || "Unknown Location";
        const loc = await map.getCoordinates(activityName, dest);

        if (loc) {
          locations.push({
            name: activityName,
            ...loc,
            day: day.day,
          });
        }
      }
    }

    // Calculate transport information
    const transportInfo = TransportService.calculateTransport(locations, transportMode);

    // Generate crowd and best time information
    const crowdInfo = CrowdService.generateCrowdInfo(locations);

    // Create a map of location names to their crowd info
    const crowdInfoMap = {};
    crowdInfo.forEach(info => {
      crowdInfoMap[info.location] = info;
    });

    // Embed crowd info into itinerary activities
    const enrichedItinerary = itinerary.map(day => ({
      ...day,
      activities: (Array.isArray(day.activities) ? day.activities : []).map(activity => {
        const rawActivityName =
          typeof activity === "string"
            ? activity
            : typeof activity?.name === "string"
              ? activity.name
              : typeof activity?.name === "number" || typeof activity?.name === "boolean"
                ? String(activity.name)
                : typeof activity === "number" || typeof activity === "boolean"
                  ? String(activity)
                  : "Unknown Location";

        const activityName = rawActivityName.trim() || "Unknown Location";
        const activityCrowdInfo = crowdInfoMap[activityName];
        if (activityCrowdInfo) {
          return {
            ...(activity && typeof activity === "object" ? activity : {}),
            name: activityName,
            bestTime: activityCrowdInfo.bestTime,
            crowdedHours: activityCrowdInfo.crowdedHours,
            crowdLevel: activityCrowdInfo.crowdLevel,
            weatherSuitability: activityCrowdInfo.weatherSuitability,
            peakDays: activityCrowdInfo.peakDays,
            tips: activityCrowdInfo.tips,
          };
        }
        if (activity && typeof activity === "object") return { ...activity, name: activityName };
        return { name: activityName };
      })
    }));

    // Get weather information
    const weatherInfo = await CrowdService.getWeatherInfo(dest, days);

    // Get emergency and safety information
    const emergencyInfo = EmergencyService.getEmergencyInfo(dest);

    // Calculate detailed cost breakdown
    const costBreakdown = BudgetOptimizer.calculateCostBreakdown({
      days,
      budgetLevel: budget || "Medium",
      transportMode,
      transportCost: parseFloat(transportInfo.totalCost),
    });

    const payload = {
      destination: dest,
      days,
      interests,
      budget,
      maxBudget,
      tripPace,
      transportMode,
      itinerary: enrichedItinerary,
      locations,
      totalCost: budgetInfo ? budgetInfo.totalCost : costBreakdown.total,
      estimatedTransportCost: parseFloat(transportInfo.totalCost),
      crowdInfo,
      weatherInfo,
      emergencyInfo,
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

      return res.status(200).json({
        trip,
        itinerary: enrichedItinerary,
        locations,
        budgetInfo,
        transportInfo,
        crowdInfo,
        weatherInfo,
        emergencyInfo,
        costBreakdown,
      });
    }

    trip = await Trip.create({ userId: req.user.uid, ...payload });
    
    return res.status(201).json({
      trip,
      itinerary: enrichedItinerary,
      locations,
      budgetInfo,
      transportInfo,
      crowdInfo,
      weatherInfo,
      emergencyInfo,
      costBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate alternate plan for existing trip
 */
exports.generateAlternate = async (req, res, next) => {
  try {
    const { tripId, scenario = "weather" } = req.body;

    // Get existing trip
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.uid });

    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }

    // Generate alternate plan
    const alternateResult = await ai.generateAlternatePlan({
      originalItinerary: trip.itinerary,
      destination: trip.destination,
      days: trip.days,
      interests: trip.interests,
      scenario,
      tripPace: trip.tripPace || "balanced",
    });

    const alternateItinerary = alternateResult.itinerary;

    // Get coordinates for alternate locations
    const alternateLocations = [];
    for (const day of alternateItinerary) {
      if (!Array.isArray(day.activities)) continue;
      for (const activity of day.activities) {
        const rawActivityName =
          typeof activity === "string"
            ? activity
            : typeof activity?.name === "string"
              ? activity.name
              : typeof activity?.name === "number" || typeof activity?.name === "boolean"
                ? String(activity.name)
                : typeof activity === "number" || typeof activity === "boolean"
                  ? String(activity)
                  : "Unknown Location";

        const activityName = rawActivityName.trim() || "Unknown Location";
        const loc = await map.getCoordinates(activityName, trip.destination);
        if (loc) {
          alternateLocations.push({
            name: activityName,
            ...loc,
            day: day.day,
          });
        }
      }
    }

    // Calculate transport for alternate plan
    const alternateTransport = TransportService.calculateTransport(
      alternateLocations,
      trip.transportMode
    );

    // Generate crowd info for alternate plan
    const alternateCrowdInfo = CrowdService.generateCrowdInfo(alternateLocations);

    // Store alternate plan in trip
    const alternatePlan = {
      scenario,
      itinerary: alternateItinerary,
      locations: alternateLocations,
      transportInfo: alternateTransport,
      crowdInfo: alternateCrowdInfo,
      changes: alternateResult.changes,
      generatedAt: new Date(),
    };

    // Add to alternativePlans array
    trip.alternativePlans = trip.alternativePlans || [];
    trip.alternativePlans.push(alternatePlan);
    await trip.save();

    return res.status(200).json({
      success: true,
      alternatePlan,
      message: "Alternate plan generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare transport modes for a trip
 */
exports.compareTransport = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findOne({ _id: tripId, userId: req.user.uid });

    if (!trip) {
      const err = new Error("Trip not found");
      err.statusCode = 404;
      throw err;
    }

    const comparisons = TransportService.compareTransportModes(trip.locations);

    return res.status(200).json({
      success: true,
      comparisons,
      currentMode: trip.transportMode,
    });
  } catch (error) {
    next(error);
  }
};