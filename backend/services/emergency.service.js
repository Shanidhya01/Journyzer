const { EMERGENCY_INFO } = require("../utils/constant");

/**
 * Emergency and Safety Service
 * Provides emergency numbers, safe zones, and local customs information
 */
class EmergencyService {
  /**
   * Get emergency information for a destination
   * In production, this would be a comprehensive database
   */
  static getEmergencyInfo(destination) {
    const lowerDest = destination.toLowerCase();

    // Comprehensive emergency database
    const emergencyDB = {
      usa: {
        police: "911",
        ambulance: "911",
        fire: "911",
        touristHelpline: "1-800-VISIT-US",
        safeZones: [
          "Hotel lobbies",
          "Police stations",
          "Hospital emergency rooms",
          "Tourist information centers",
          "Major shopping malls",
        ],
        localCustoms: [
          "Tipping is expected (15-20% at restaurants)",
          "Always carry ID",
          "Do not jaywalk",
          "Respect personal space (about 2 feet)",
        ],
        usefulPhrases: ["Help!", "Emergency", "I need a doctor", "Where is the police station?"],
      },
      india: {
        police: "100",
        ambulance: "102",
        fire: "101",
        touristHelpline: "1800-111-363",
        safeZones: [
          "Hotel premises",
          "Police stations",
          "Government tourist offices",
          "Railway stations (enquiry counters)",
          "Major temples and religious sites",
        ],
        localCustoms: [
          "Remove shoes before entering homes/temples",
          "Use right hand for eating and greeting",
          "Dress modestly, especially in religious places",
          "Bargaining is common in markets",
        ],
        usefulPhrases: ["Madad!", "Help!", "Doctor kahan hai?", "Police bulao"],
      },
      uk: {
        police: "999",
        ambulance: "999",
        fire: "999",
        touristHelpline: "0844-847-5787",
        safeZones: [
          "Hotels and hostels",
          "Police stations",
          "NHS hospitals",
          "Tourist information centers",
          "Underground stations",
        ],
        localCustoms: [
          "Queue patiently",
          "Mind the gap (in tube)",
          "Tipping is optional but appreciated",
          "Stand on the right on escalators",
        ],
        usefulPhrases: ["Help!", "Emergency", "I need help", "Call the police"],
      },
      france: {
        police: "17",
        ambulance: "15",
        fire: "18",
        touristHelpline: "0033-1-4312-2222",
        safeZones: [
          "Hotel reception",
          "Gendarmerie (police stations)",
          "Train stations",
          "Tourist offices",
          "Major museums",
        ],
        localCustoms: [
          "Always greet with 'Bonjour'",
          "Service charge included in bills",
          "Dress well when dining out",
          "Learn basic French phrases",
        ],
        usefulPhrases: ["Au secours!", "Aidez-moi!", "Appelez la police!", "Où est l'hôpital?"],
      },
      japan: {
        police: "110",
        ambulance: "119",
        fire: "119",
        touristHelpline: "050-3816-2787",
        safeZones: [
          "Koban (police boxes)",
          "Hotels and ryokans",
          "Train stations",
          "Convenience stores (24/7)",
          "Tourist information centers",
        ],
        localCustoms: [
          "Bow when greeting",
          "Remove shoes indoors",
          "No tipping culture",
          "Be quiet in public transport",
          "Don't eat while walking",
        ],
        usefulPhrases: ["Tasukete!", "Help!", "Byoin wa doko desu ka?", "Keisatsu wo yonde!"],
      },
      thailand: {
        police: "191",
        ambulance: "1669",
        fire: "199",
        touristHelpline: "1155",
        safeZones: [
          "Hotels and guesthouses",
          "Tourist police booths",
          "Hospitals",
          "Shopping malls",
          "Temples",
        ],
        localCustoms: [
          "Wai greeting (hands together, slight bow)",
          "Never touch anyone's head",
          "Don't point feet at people or Buddha images",
          "Dress modestly at temples",
          "Remove shoes before entering homes/temples",
        ],
        usefulPhrases: ["Chuay duay!", "Help!", "Rong phayaban yoo thee nai?", "Kor tamruat"],
      },
    };

    // Try to match destination with database
    for (const [country, info] of Object.entries(emergencyDB)) {
      if (
        lowerDest.includes(country) ||
        this.checkCityMatch(lowerDest, country)
      ) {
        return {
          destination,
          country: country.toUpperCase(),
          ...info,
        };
      }
    }

    // Return default if no match found
    return {
      destination,
      country: "GENERAL",
      ...EMERGENCY_INFO.default,
      note: "Please research specific emergency numbers for your destination",
    };
  }

  /**
   * Check if destination matches major cities of a country
   */
  static checkCityMatch(destination, country) {
    const cityMap = {
      usa: ["new york", "los angeles", "chicago", "miami", "san francisco", "las vegas"],
      india: ["delhi", "mumbai", "bangalore", "kolkata", "chennai", "jaipur", "goa"],
      uk: ["london", "manchester", "edinburgh", "liverpool", "birmingham"],
      france: ["paris", "marseille", "lyon", "nice", "bordeaux"],
      japan: ["tokyo", "osaka", "kyoto", "hiroshima", "nara", "fukuoka"],
      thailand: ["bangkok", "phuket", "chiang mai", "pattaya", "krabi"],
    };

    return cityMap[country]?.some((city) => destination.includes(city)) || false;
  }

  /**
   * Get safety tips based on destination type
   */
  static getSafetyTips(destination) {
    return [
      "Keep copies of important documents separately",
      "Share your itinerary with family/friends",
      "Use hotel safe for valuables",
      "Be aware of common scams in the area",
      "Keep emergency numbers saved in your phone",
      "Purchase travel insurance",
      "Register with your embassy if available",
      "Avoid displaying expensive items",
      "Stay in well-lit areas at night",
      "Use licensed taxis or ride-sharing apps",
    ];
  }
}

module.exports = EmergencyService;
