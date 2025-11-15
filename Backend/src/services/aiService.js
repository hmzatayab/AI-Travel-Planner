import process from "process";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * extractJSON tries to find the first {...} JSON substring in a text and parse it.
 * It's defensive because models sometimes return extra text.
 */
export function extractJSON(text) {
  if (!text || typeof text !== "string") return null;

  // Clean common formatting artifacts
  let cleaned = text
    .trim()
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ")
    .replace(/\r/g, "");

  try {
    // Try to parse directly
    return JSON.parse(cleaned);
  } catch (e) {
    // Fallback: try extracting first { ... } block
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      const candidate = cleaned.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch (err) {
        console.error("❌ JSON parse failed after cleanup:", err.message);
        return null;
      }
    }
    return null;
  }
}


/**
 * callAI: sends prompt to OpenAI Chat Completions and returns parsed JSON (or raw text).
 * - If USE_AI_SIMULATOR=true it returns a sample itinerary (for dev without API key).
 */

export async function callAI(prompt, options = {}) {
  const useSimulator = process.env.USE_AI_SIMULATOR === "true";

  // 🧪 Simulator mode for local testing
  if (useSimulator) {
    return {
      simulated: true,
      parsed: {
        title: "Simulated 3-day Sample Trip",
        origin: "Karachi",
        destination: "Istanbul",
        durationDays: 3,
        days: [
          {
            dayNumber: 1,
            title: "Arrival & Old City",
            activities: [
              { place: "Blue Mosque", startTime: "09:00", endTime: "11:00", estimatedCost: 0, description: "Visit historic mosque" },
              { place: "Grand Bazaar", startTime: "12:00", endTime: "15:00", estimatedCost: 1000, description: "Shopping & lunch" }
            ],
            meals: ["Hamdi Restaurant"],
            transportNotes: "Taxi or tram"
          },
          { dayNumber: 2, title: "Bosphorus cruise", activities: [], meals: [], transportNotes: "" },
          { dayNumber: 3, title: "Sultanahmet & Departure", activities: [], meals: [], transportNotes: "" }
        ],
        hotelSuggestions: [
          { name: "Istanbul Comfort", pricePerNight: 10000, rating: 4.2, address: "Old City", url: "" }
        ],
        costBreakdown: { flights: 25000, hotels: 15000, food: 5000, transport: 2000, activities: 2000, other: 1000 },
        totalEstimatedCost: 50000,
      },
      raw: "Simulated itinerary JSON",
      fullResponse: null,
    };
  }

  // 🧠 Real AI call
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const raw = response.choices?.[0]?.message?.content?.trim() || "";

  // 🧹 Clean output: extract JSON safely
  let parsed = null;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON parse error:", err.message);
  }

  return {
    parsed,
    raw,
    fullResponse: response,
  };
}