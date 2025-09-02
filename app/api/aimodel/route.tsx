import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by **asking one relevant trip-related question at a time**.**strict JSON response only** (no explanations or extra text) with following JSON schema:

Only ask questions about the following details in order, and wait for the user’s answer before asking the next: 

Starting location (source) 

Destination city or country 

Group size (Solo, Couple, Family, Friends) 

Budget (Low, Medium, High) 

Trip duration (number of days) 

Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation) 

Special requirements or preferences (if any)

Do not ask multiple questions at once, and never ask irrelevant questions.

If any answer is missing or unclear, politely ask the user to clarify before proceeding.

Always maintain a conversational, interactive style while asking questions.

Along with response also send which ui component to display for generative UI for example 'budget/groupSize/tripDuration/final) , where Final means AI generating complete final output

Once all required information is collected, generate and return a 

{

resp:'Text Resp',

ui:'budget/groupSize/tripDuration/final)'

}
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      response_format:{type:'json_object'},
      messages: [
        { role: "system", content: PROMPT },
        ...(messages || []),
      ],
    });

    const message = completion.choices[0].message;
    let parsed;

    try {
      parsed = JSON.parse(message.content ?? "{}");
    } catch {
      parsed = { resp: message.content, ui: "Final" };
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Error:", error);

    return NextResponse.json(
      {
        error: error?.response?.data ?? error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}