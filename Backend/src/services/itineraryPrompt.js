export function buildPrompt(input) {
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
      "activities": [string], // each activity as a short text description
      "meals": [string],
      "transportNotes": string
    }
  ]
}


⚠️ Important:
- Return **strictly valid JSON** only.
- **activities array must contain only simple text descriptions** (no objects, no extra fields like location, cost, booking). 
- Each day can have maximum 3 activities.
- All object keys and arrays must be properly closed with commas.
- If any value is unknown, use null.
- No extra text, markdown, or explanation.
- Return JSON that can be parsed directly with JSON.parse().
`;
}

export function buildHotelPrompt(input) {
  const { origin, destination, durationDays, tripType, preferences } = input;

  const prefsText = Array.isArray(preferences)
    ? preferences.join(", ")
    : preferences || "";

  return `
You are an expert travel planner AI.

User details:
- Origin: ${origin || "N/A"}
- Destination: ${destination || "N/A"}
- Duration: ${durationDays} days
- Trip type: ${tripType || "Standard"}
- Preferences: ${prefsText}

Your job:
Generate a list of **hotels** in the destination area in **valid JSON format only**, following this structure:

[
  {
    "name": string,               // Hotel name
    "address": string,            // Full address
    "stars": number,              // Hotel rating (1-5)
    "openingHours": string,       // e.g., "24/7" or "Check-in: 2 PM - 10 PM"
    "website": string | null,     // Hotel website link if available
    "facilities": [string],       // e.g., ["Gym", "Pool", "Spa", "Wi-Fi"]
    "activities": [string]        // Activities offered in the hotel, e.g., ["Cooking class", "Yoga"]
  }
]

⚠️ Important:
- Return **strictly valid JSON** only.
- **Do not include extra text, markdown, or explanation**.
- All arrays and objects must be properly formatted.
- If any info is unknown, use null.
- Return JSON that can be parsed directly with JSON.parse().
`;
}
