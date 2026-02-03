const axios = require("axios");
const { TRIP_PACE_CONFIG } = require("../utils/constant");

// FIX: Updated to the latest supported model name (Gemini 2.0 Flash)
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

exports.generateItinerary = async ({
  country,
  destination,
  days,
  interests,
  tripPace = "balanced",
  maxBudget,
}) => {
  try {
    const place = country || destination;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from .env");
    }

    if (!place || !days || !Array.isArray(interests) || interests.length === 0) {
      throw new Error("Invalid input data provided");
    }

    const paceConfig = TRIP_PACE_CONFIG[tripPace] || TRIP_PACE_CONFIG.balanced;
    const spotsPerDay = paceConfig.spotsPerDay;

    let budgetConstraint = "";
    if (maxBudget) {
      budgetConstraint = `\nBudget constraint: Maximum $${maxBudget} for the entire trip. Include free and budget-friendly activities.`;
    }

    const prompt = `
Create a ${days}-day travel itinerary for ${place}.
Interests: ${interests.join(", ")}.
Trip Pace: ${tripPace} (approximately ${spotsPerDay} activities per day).
${budgetConstraint}

Return the data strictly in this JSON format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day Title",
      "activities": ["Activity 1", "Activity 2"]
    }
  ]
}`;

    const response = await axios.post(
      `${GEMINI_URL}?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          // This forces the model to output valid JSON
          response_mime_type: "application/json",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the text content
    const text = response.data.candidates[0].content.parts[0].text;

    // In JSON mode, text is a clean string, but we add a safety trim
    return JSON.parse(text.trim());
  } catch (error) {
    // Log detailed API errors for better debugging
    console.error("AI Service Error:", error.response?.data || error.message);
    throw new Error("AI itinerary generation failed");
  }
};

/**
 * Generate alternate plan based on scenario
 */
exports.generateAlternatePlan = async ({
  originalItinerary,
  destination,
  days,
  interests,
  scenario = "weather",
  tripPace = "balanced",
}) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from .env");
    }

    const paceConfig = TRIP_PACE_CONFIG[tripPace] || TRIP_PACE_CONFIG.balanced;

    const scenarioPrompts = {
      weather: "due to bad weather (rain/storm). Replace outdoor activities with indoor alternatives.",
      tired: "for a more relaxed pace. Reduce activities and add rest time.",
      budget: "to reduce costs. Replace expensive activities with free/budget alternatives.",
      indoor: "with only indoor activities due to extreme weather.",
      cultural: "focusing more on cultural and historical experiences.",
    };

    const scenarioDescription = scenarioPrompts[scenario] || scenarioPrompts.weather;

    const prompt = `
Create an alternate ${days}-day travel itinerary for ${destination} ${scenarioDescription}
Original interests: ${interests.join(", ")}.
Trip Pace: ${tripPace} (approximately ${paceConfig.spotsPerDay} activities per day).

Consider the original itinerary but provide completely different activities suitable for the scenario.

Return the data strictly in this JSON format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day Title",
      "activities": ["Activity 1", "Activity 2"],
      "reason": "Why this day plan works for the scenario"
    }
  ],
  "scenario": "${scenario}",
  "changes": "Brief summary of what changed from original plan"
}`;

    const response = await axios.post(
      `${GEMINI_URL}?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("AI Alternate Plan Error:", error.response?.data || error.message);
    throw new Error("Failed to generate alternate plan");
  }
};