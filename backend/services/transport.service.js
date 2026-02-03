const { TRANSPORT_MODES } = require("../utils/constant");

/**
 * Transport Optimization Service
 * Calculates travel time and cost based on transport mode
 */
class TransportService {
  /**
   * Calculate transport costs and time for locations
   * @param {Array} locations - Array of locations with coordinates
   * @param {String} transportMode - Selected transport mode
   * @returns {Object} Transport details with cost and time
   */
  static calculateTransport(locations, transportMode = "mixed") {
    const mode = TRANSPORT_MODES[transportMode] || TRANSPORT_MODES.mixed;

    if (!locations || locations.length < 2) {
      return {
        totalDistance: 0,
        totalCost: 0,
        totalTime: 0,
        mode: mode.label,
        details: [],
      };
    }

    let totalDistance = 0;
    const details = [];

    // Calculate distance between consecutive locations
    for (let i = 0; i < locations.length - 1; i++) {
      const distance = this.calculateDistance(
        locations[i].lat,
        locations[i].lng,
        locations[i + 1].lat,
        locations[i + 1].lng
      );

      const time = (distance / mode.speedKmPerHour) * 60; // in minutes
      const cost = distance * mode.costPerKm;

      totalDistance += distance;

      details.push({
        from: locations[i].name,
        to: locations[i + 1].name,
        distance: distance.toFixed(2),
        time: Math.round(time),
        cost: cost.toFixed(2),
      });
    }

    const totalTime = (totalDistance / mode.speedKmPerHour) * 60; // in minutes
    const totalCost = totalDistance * mode.costPerKm;

    return {
      totalDistance: totalDistance.toFixed(2),
      totalCost: totalCost.toFixed(2),
      totalTime: Math.round(totalTime),
      mode: mode.label,
      details,
      recommendation: this.getTransportRecommendation(totalDistance, transportMode),
    };
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Get transport recommendations based on distance and mode
   */
  static getTransportRecommendation(totalDistance, currentMode) {
    if (totalDistance < 5) {
      return {
        suggestion: "walking",
        reason: "Short distance - walking is recommended for better experience",
      };
    } else if (totalDistance < 20) {
      return {
        suggestion: "public",
        reason: "Moderate distance - public transport is cost-effective",
      };
    } else if (totalDistance < 50) {
      return {
        suggestion: "mixed",
        reason: "Long distance - mix of transport modes recommended",
      };
    } else {
      return {
        suggestion: "cab",
        reason: "Very long distance - cab/taxi recommended for comfort",
      };
    }
  }

  /**
   * Compare all transport modes
   */
  static compareTransportModes(locations) {
    const modes = Object.keys(TRANSPORT_MODES);
    const comparisons = [];

    for (const mode of modes) {
      const result = this.calculateTransport(locations, mode);
      comparisons.push({
        mode,
        label: TRANSPORT_MODES[mode].label,
        cost: result.totalCost,
        time: result.totalTime,
        distance: result.totalDistance,
      });
    }

    return comparisons;
  }
}

module.exports = TransportService;
