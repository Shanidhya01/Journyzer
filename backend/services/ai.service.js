const axios = require("axios");

// FIX: Updated to the latest supported model name (Gemini 2.0 Flash)
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

exports.generateItinerary = async ({ country, destination, days, interests }) => {
  try {
    const place = country || destination;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from .env");
    }

    if (!place || !days || !Array.isArray(interests) || interests.length === 0) {
      throw new Error("Invalid input data provided");
    }

    const prompt = `
Create a ${days}-day travel itinerary for ${place}.
Interests: ${interests.join(", ")}.

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
    console.error(
      "AI Service Error:",
      error.response?.data || error.message
    );
    throw new Error("AI itinerary generation failed");
  }
};