const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiModel = genAI.getGenerativeModel(
  {
    model: "models/gemini-1.5-flash",
  },
  {
    apiVersion: "v1",
  }
);

module.exports = geminiModel;
