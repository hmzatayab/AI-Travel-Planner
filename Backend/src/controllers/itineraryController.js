import Itinerary from "../models/itinerary.js";
import User from "../models/user.js";
import { callAI, extractJSON } from "../services/aiService.js";

/**
 * buildPrompt: create a strict prompt that asks AI to return ONLY valid JSON
 */

function buildPrompt(input) {
  const {
    origin,
    destination,
    durationDays,
    budget,
    preferences,
    interests,
    tripType,
  } = input;
  const prefsText = Array.isArray(preferences)
    ? preferences.join(", ")
    : preferences || "";
  const interestsText = Array.isArray(interests)
    ? interests.join(", ")
    : interests || "";

  return `
You are an expert travel planner AI.

User details:
- Origin: ${origin || "N/A"}
- Destination: ${destination || "N/A"}
- Duration: ${durationDays} days
- Trip type: ${tripType || "Standard"}
- Budget: ${budget} (U.S. Dollars (USD $))
- Preferences: ${prefsText}
- Interests: ${interestsText}

Your job:
Generate a complete travel itinerary in **valid JSON format only**, following this structure:

{
  "title": string,
  "origin": string,
  "destination": string,
  "durationDays": number,
  "tripType": string,
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "activities": [
        {
          "place": string,
          "description": string,
          "startTime": string,
          "endTime": string,
          "estimatedCostUSD": number
        }
      ],
      "meals": [string],
      "transportNotes": string
    }
  ],
  "hotelSuggestions": [
    { "name": string, "pricePerNightUSD": number, "rating": number, "address": string, "url": string }
  ],
  "costBreakdownUSD": {
    "flights": number,
    "hotels": number,
    "food": number,
    "transport": number,
    "activities": number,
    "other": number
  },
  "totalEstimatedCostUSD": number
}

⚠️ Important:
- **All prices and costs must be in U.S. Dollars (USD $)**.
- If the local currency is different, convert it to USD at current approximate rates.
- Do not include any explanation, markdown, or text outside the JSON.
- Keep the JSON concise but realistic.
- Return **valid JSON only**, with no extra text or explanation.
Be concise but include **all fields exactly as shown in the structure**, even if some values are estimates or null.  
You must include:
- A realistic "costBreakdownUSD" object with numeric fields (flights, hotels, food, transport, activities, other).
- A numeric "totalEstimatedCostUSD" (sum of all costs).  
Respond ONLY with valid JSON (no markdown, no explanation). If any value is unknown, set it to null.

`;
}

export const generateItinerary = async (req, res) => {
  try {
    // Validate auth
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });

    // Validate incoming body
    const {
      origin,
      destination,
      durationDays,
      tripType,
      budget,
      preferences,
      interests,
      title,
    } = req.body;

    if (!durationDays || !budget || (!origin && !destination)) {
      return res.status(400).json({
        message:
          "Please provide origin or destination, durationDays and budget.",
      });
    }

    // Build prompt and call AI
    const prompt = buildPrompt({
      origin,
      destination,
      durationDays,
      budget,
      preferences,
      interests,
      tripType,
    });
    let aiResult;
    try {
      aiResult = await callAI(prompt);
    } catch (aiErr) {
      // If AI fails, return helpful message
      console.error("AI Error:", aiErr);
      return res
        .status(502)
        .json({ message: "AI service error", error: aiErr.message });
    }

    // Try to get parsed JSON from AI result
    // Try to extract valid JSON
    let itineraryData = aiResult.parsed;

    if (!itineraryData) {
      // Retry parsing from raw response (in case AI returned markdown or invalid commas)
      itineraryData = extractJSON(aiResult.raw);
    }

    if (!itineraryData) {
      try {
        itineraryData = JSON.parse(aiResult.raw);
      } catch (e) {
        console.error("❌ Failed to parse AI response as JSON:", e.message);
        console.log("AI RAW RESPONSE:", aiResult.raw);
        return res.status(500).json({
          message: "AI returned invalid JSON. Please try again later.",
          rawResponsePreview: aiResult.raw?.slice(0, 300) + "...",
        });
      }
    }

    const newItinerary = new Itinerary({
      userId,
      title:
        title ||
        itineraryData.title ||
        `${itineraryData.destination || destination} trip`,
      origin: itineraryData.origin || origin,
      destination: itineraryData.destination || destination,
      durationDays: itineraryData.durationDays || durationDays,
      budget,
      preferences: preferences || [],
      interests: interests || [],
      days: itineraryData.days || [],
      hotelSuggestions: itineraryData.hotelSuggestions || [],
      costBreakdown:
        itineraryData.costBreakdown || itineraryData.costBreakdownUSD || {},
      totalEstimatedCost:
        itineraryData.totalEstimatedCost ||
        itineraryData.totalEstimatedCostUSD ||
        null,
      generatedBy: {
        modelName: process.env.OPENAI_MODEL || "openai-chat",
        modelVersion: "unknown",
        promptSnippet:
          prompt.length > 500 ? prompt.slice(0, 500) + "..." : prompt,
      },
      rawAIResponse:
        aiResult.fullResponse || aiResult.rawAIResponse || aiResult.raw,
    });

    await newItinerary.save();

    return res.status(201).json({
      message: "Itinerary generated and saved.",
      itinerary: newItinerary,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const listUserItineraries = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });

    const items = await Itinerary.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ itineraries: items });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getItineraryById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const item = await Itinerary.findOne({ _id: id, userId });
    if (!item) return res.status(404).json({ message: "Itinerary not found." });
    res.json({ itinerary: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
