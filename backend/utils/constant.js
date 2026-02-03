exports.DAY_TIMES = ["morning", "afternoon", "evening"];

exports.BUDGET_RATES = {
  Low: 50,
  Medium: 100,
  Luxury: 200,
};

// New: Trip Pace configurations
exports.TRIP_PACE_CONFIG = {
  relaxed: {
    spotsPerDay: 3,
    travelDistanceMultiplier: 0.7,
    restTimeMinutes: 120,
  },
  balanced: {
    spotsPerDay: 5,
    travelDistanceMultiplier: 1.0,
    restTimeMinutes: 60,
  },
  fast: {
    spotsPerDay: 7,
    travelDistanceMultiplier: 1.3,
    restTimeMinutes: 30,
  },
};

// New: Transport mode estimates
exports.TRANSPORT_MODES = {
  public: {
    costPerKm: 0.5,
    speedKmPerHour: 30,
    label: "Public Transport",
  },
  cab: {
    costPerKm: 2.0,
    speedKmPerHour: 40,
    label: "Cab/Taxi",
  },
  walking: {
    costPerKm: 0,
    speedKmPerHour: 5,
    label: "Walking",
  },
  mixed: {
    costPerKm: 1.0,
    speedKmPerHour: 25,
    label: "Mixed Transport",
  },
};

// New: Mock crowd data (can be replaced with real API)
exports.CROWD_LEVELS = {
  LOW: "🟢 Low",
  MEDIUM: "🟡 Medium",
  HIGH: "🔴 High",
};

// New: Emergency info template per country/city
exports.EMERGENCY_INFO = {
  default: {
    police: "911",
    ambulance: "911",
    fire: "911",
    touristHelpline: "N/A",
    safeZones: ["Hotels", "Tourist information centers", "Major shopping areas"],
    localCustoms: [
      "Respect local traditions",
      "Dress modestly in religious places",
      "Ask before taking photos of people",
    ],
  },
};

exports.HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};