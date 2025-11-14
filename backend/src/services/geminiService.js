const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY)
  console.warn("⚠ GEMINI_API_KEY missing");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    responseMimeType: "application/json"
  }
});


async function callGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text(); // always JSON
  } catch (err) {
    console.error("Gemini error:", err);
    throw err;
  }
}

module.exports = { callGemini };
