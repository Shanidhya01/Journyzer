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

    // helper to normalize ui tokens to the expected client tokens
    const normalizeUi = (raw: any) => {
      if (!raw && raw !== 0) return "final";
      const s = String(raw).toLowerCase();
      if (s.includes("group")) return "groupSize";
      if (s.includes("budget")) return "budget";
      if (s.includes("trip") && s.includes("duration")) return "tripDuration";
      if (s.includes("interest") || s.includes("interests")) return "interests";
      if (s.includes("final") || s.includes("done") || s.includes("complete")) return "final";
      // fallback: return lowercased token if matches expected words
      if (s === "groupsize") return "groupSize";
      if (s === "tripduration") return "tripDuration";
      return String(raw);
    };

    let parsed: any = { resp: String(message.content ?? ""), ui: "final" };

    try {
      if (typeof message.content === "object") {
        parsed = { ...(message.content as object) } as any;
      } else {
        parsed = JSON.parse(String(message.content ?? "{}"));
      }
    } catch (err) {
      // try to extract a JSON-like substring if possible
      try {
        const text = String(message.content ?? "");
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          parsed = { resp: text, ui: "final" };
        }
      } catch (e) {
        parsed = { resp: String(message.content ?? ""), ui: "final" };
      }
    }

    // normalize fields
    parsed.resp = parsed.resp ?? String(message.content ?? "");
    parsed.ui = normalizeUi(parsed.ui);

    // If model-provided ui contradicts the natural language resp, infer from resp
    const inferUiFromText = (text: string) => {
      if (!text) return null;
      const s = text.toLowerCase();
      // budget detection: explicit words
      if (s.includes("budget") || s.includes("low") || s.includes("medium") || s.includes("high")) return "budget";
      // group size detection
      if (s.includes("group size") || s.includes("group") || s.includes("just me") || s.includes("couple") || s.includes("family") || s.includes("friends")) return "groupSize";
      // trip duration
      if (s.includes("duration") || s.includes("days") || s.match(/\b\d+\s+days?\b/)) return "tripDuration";
      // interests
      if (s.includes("interest") || s.includes("adventure") || s.includes("sightseeing") || s.includes("food") || s.includes("nightlife") || s.includes("relax")) return "interests";
      // final / view
      if (s.includes("view trip") || s.includes("planning your") || s.includes("final") || s.includes("prepare") || s.includes("itinerary")) return "final";
      return null;
    };

    const inferred = inferUiFromText(String(parsed.resp ?? ""));
    if (inferred && inferred !== parsed.ui) {
      console.log("[aimodel] overriding ui from", parsed.ui, "to", inferred, "based on resp text");
      parsed.ui = inferred;
    }

    // debug log to help diagnose mismatches
    console.log("[aimodel] raw message.content:", message.content);
    console.log("[aimodel] parsed:", parsed);

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