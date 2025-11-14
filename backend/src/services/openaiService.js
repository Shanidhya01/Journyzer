const { OpenAI } = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callItineraryModel(prompt, maxTokens = 1200) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  // Use chat completion
  const resp = await client.chat.completions.create({
    model: 'gpt-5-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.7
  });
  return resp.choices?.[0]?.message?.content;
}

module.exports = { callItineraryModel };
