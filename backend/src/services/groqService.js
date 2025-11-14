// uses groq-sdk
const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY missing in .env');
}

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGroq(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // adjust if you prefer another llama3 model
      messages: [
        { role: 'system', content: 'You are an expert travel planner. Output ONLY valid JSON as requested.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 3000
    });

    // response.choices[0].message.content expected
    return response.choices?.[0]?.message?.content;
  } catch (err) {
    console.error('Groq API error:', err);
    throw err;
  }
}

module.exports = { callGroq };
