const { CROWD_LEVELS } = require("../utils/constant");

/**
 * Crowd and Best Time Service
 * Provides information about best times to visit and crowd levels
 */
class CrowdService {
  /**
   * Generate crowd information for locations
   * In production, this would integrate with Google Places API popular times
   * For now, using intelligent mock data based on location type
   */
  static generateCrowdInfo(locations) {
    return locations.map((location) => {
      const locationName = location.name || location;
      const crowdData = this.getMockCrowdData(locationName);

      return {
        location: locationName,
        ...crowdData,
      };
    });
  }

  /**
   * Get mock crowd data based on location type
   */
  static getMockCrowdData(locationName) {
    const lowerName = locationName.toLowerCase();

    // Museums and monuments
    if (
      lowerName.includes("museum") ||
      lowerName.includes("monument") ||
      lowerName.includes("tower") ||
      lowerName.includes("palace")
    ) {
      return {
        bestTime: "Early morning (8-10 AM) or late afternoon (4-6 PM)",
        crowdedHours: "11 AM - 3 PM",
        crowdLevel: CROWD_LEVELS.HIGH,
        peakDays: ["Saturday", "Sunday"],
        weatherSuitability: "All weather",
        tips: "Book tickets online to skip queues",
      };
    }

    // Markets and shopping
    if (
      lowerName.includes("market") ||
      lowerName.includes("bazaar") ||
      lowerName.includes("shopping")
    ) {
      return {
        bestTime: "Morning (9-11 AM) for fresh produce",
        crowdedHours: "12 PM - 6 PM",
        crowdLevel: CROWD_LEVELS.MEDIUM,
        peakDays: ["Friday", "Saturday", "Sunday"],
        weatherSuitability: "Clear weather preferred",
        tips: "Visit weekday mornings for better deals",
      };
    }

    // Parks and outdoor
    if (
      lowerName.includes("park") ||
      lowerName.includes("garden") ||
      lowerName.includes("beach") ||
      lowerName.includes("nature")
    ) {
      return {
        bestTime: "Early morning (6-9 AM) or sunset (5-7 PM)",
        crowdedHours: "12 PM - 4 PM",
        crowdLevel: CROWD_LEVELS.LOW,
        peakDays: ["Saturday", "Sunday"],
        weatherSuitability: "Clear, sunny weather",
        tips: "Bring sunscreen and water",
      };
    }

    // Restaurants and dining
    if (
      lowerName.includes("restaurant") ||
      lowerName.includes("cafe") ||
      lowerName.includes("dining") ||
      lowerName.includes("food")
    ) {
      return {
        bestTime: "Early lunch (11:30 AM) or early dinner (6-7 PM)",
        crowdedHours: "7 PM - 9 PM",
        crowdLevel: CROWD_LEVELS.MEDIUM,
        peakDays: ["Friday", "Saturday"],
        weatherSuitability: "All weather",
        tips: "Make reservations for popular spots",
      };
    }

    // Religious places
    if (
      lowerName.includes("temple") ||
      lowerName.includes("church") ||
      lowerName.includes("mosque") ||
      lowerName.includes("shrine")
    ) {
      return {
        bestTime: "Early morning (6-8 AM) or evening (5-7 PM)",
        crowdedHours: "10 AM - 12 PM",
        crowdLevel: CROWD_LEVELS.MEDIUM,
        peakDays: ["Sunday", "Religious holidays"],
        weatherSuitability: "All weather",
        tips: "Dress modestly and respect local customs",
      };
    }

    // Default for other attractions
    return {
      bestTime: "Morning (9-11 AM) or late afternoon (4-6 PM)",
      crowdedHours: "12 PM - 3 PM",
      crowdLevel: CROWD_LEVELS.MEDIUM,
      peakDays: ["Saturday", "Sunday"],
      weatherSuitability: "Clear weather preferred",
      tips: "Check local holidays and events",
    };
  }

  /**
   * Get weather suitability for a destination
   * In production, integrate with weather API
   */
  static async getWeatherInfo(destination, days) {
    // Mock weather data
    const seasons = {
      spring: { temp: "15-25°C", condition: "Pleasant", suitability: "Excellent" },
      summer: { temp: "25-35°C", condition: "Hot", suitability: "Good" },
      autumn: { temp: "15-25°C", condition: "Cool", suitability: "Excellent" },
      winter: { temp: "5-15°C", condition: "Cold", suitability: "Fair" },
    };

    // Simple season detection based on month
    const month = new Date().getMonth();
    let season = "spring";
    if (month >= 5 && month <= 7) season = "summer";
    else if (month >= 8 && month <= 10) season = "autumn";
    else if (month >= 11 || month <= 1) season = "winter";

    return {
      destination,
      season,
      ...seasons[season],
      forecast: `Expected ${seasons[season].condition.toLowerCase()} weather for the next ${days} days`,
      recommendations: [
        "Pack according to the weather",
        "Check local forecast before outdoor activities",
        "Stay hydrated",
      ],
    };
  }
}

module.exports = CrowdService;
