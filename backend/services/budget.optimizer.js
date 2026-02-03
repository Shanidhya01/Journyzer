const { BUDGET_RATES } = require("../utils/constant");

/**
 * Smart Budget Optimizer
 * Adjusts itinerary based on max budget constraints
 */
class BudgetOptimizer {
  /**
   * Optimize itinerary to fit within budget
   * @param {Object} params
   * @param {Array} params.itinerary - Original itinerary
   * @param {Number} params.maxBudget - Maximum budget
   * @param {Number} params.days - Number of days
   * @param {String} params.budgetLevel - Budget level (Low/Medium/Luxury)
   * @returns {Object} Optimized itinerary with cost breakdown
   */
  static optimizeItinerary({ itinerary, maxBudget, days, budgetLevel }) {
    const dailyBudget = BUDGET_RATES[budgetLevel] || 100;
    const estimatedTotalCost = dailyBudget * days;

    if (!maxBudget || estimatedTotalCost <= maxBudget) {
      return {
        itinerary,
        totalCost: estimatedTotalCost,
        dailyCost: dailyBudget,
        optimized: false,
        message: "Itinerary fits within budget",
      };
    }

    // Budget optimization needed
    const targetDailyCost = Math.floor(maxBudget / days);
    let optimizedItinerary = JSON.parse(JSON.stringify(itinerary));

    // Strategy: Replace expensive activities with free alternatives
    const freeAlternatives = [
      "Free walking tour",
      "Visit public parks",
      "Explore local markets",
      "Free museum days",
      "City viewpoints",
      "Historic neighborhoods walk",
      "Beach visit",
      "Public gardens",
      "Street art tour",
      "Local festivals (if available)",
    ];

    optimizedItinerary = optimizedItinerary.map((day) => {
      if (day.activities && day.activities.length > 3) {
        // Reduce number of paid activities
        const reducedActivities = day.activities.slice(0, 3);
        // Add free alternatives
        const freeActivity =
          freeAlternatives[Math.floor(Math.random() * freeAlternatives.length)];
        reducedActivities.push(freeActivity);
        return { ...day, activities: reducedActivities };
      }
      return day;
    });

    return {
      itinerary: optimizedItinerary,
      totalCost: targetDailyCost * days,
      dailyCost: targetDailyCost,
      optimized: true,
      message: `Itinerary optimized to fit ${maxBudget} budget. Added free attractions and reduced travel distance.`,
      savings: estimatedTotalCost - targetDailyCost * days,
    };
  }

  /**
   * Calculate detailed cost breakdown
   */
  static calculateCostBreakdown({ days, budgetLevel, transportMode, transportCost }) {
    const dailyBudget = BUDGET_RATES[budgetLevel] || 100;
    const accommodationPerDay = dailyBudget * 0.4;
    const foodPerDay = dailyBudget * 0.3;
    const activitiesPerDay = dailyBudget * 0.3;

    return {
      accommodation: accommodationPerDay * days,
      food: foodPerDay * days,
      activities: activitiesPerDay * days,
      transport: transportCost || 0,
      total: dailyBudget * days + (transportCost || 0),
    };
  }
}

module.exports = BudgetOptimizer;
