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

export function buildHotelPrompt(destination) {
  return `
You are an expert travel planner AI.

Destination: ${destination || "N/A"}

Generate a list of 5 hotels in valid JSON format only. Each hotel must follow this structure:

{
  "name": string,                           // Hotel name
  "address": string,                        // Full address
  "stars": number,                          // Hotel rating (1-10)
  "openingHours": string,                   // e.g., "24/7" or "Check-in: 2 PM - 10 PM"
  "website": string | null,                 // Hotel website link if available
  "facilities": [string],                   // e.g., ["Gym", "Pool", "Spa", "Wi-Fi"]
  "activities": [string]                    // Activities offered in the hotel, e.g., ["Cooking class", "Yoga"]
}

Return strictly valid JSON with **no extra text**. Example:

{
  "hotels": [
    {
      "name": "Hotel Name",
      "address": "Full address",
      "stars": 5,
      "openingHours": "24/7",
      "website": "https://example.com",
      "facilities": ["Gym", "Pool"],
      "activities": ["Yoga", "Cooking class"]
    }
  ]
}
`;
}

export function buildFlightPrompt(origin, destination) {
  return `
You are an expert travel planner AI.

User travel details:
- Origin: ${origin || "N/A"}
- Destination: ${destination || "N/A"}

Generate a list of 5 available flights in valid JSON format only. Each flight must follow this structure:

{
  "flightNumber": string,              // e.g., "AI202"
  "airline": string,                   // Airline name
  "departureAirport": string,          // e.g., "Indira Gandhi International Airport (DEL)"
  "arrivalAirport": string,            // e.g., "Chhatrapati Shivaji International Airport (BOM)"
  "departureTime": string,             // e.g., "2025-11-20T14:30:00"
  "arrivalTime": string,               // e.g., "2025-11-20T18:45:00"
  "durationMinutes": number,           // Flight duration in minutes
  "classes": {
    "economy": { "priceUSD": number, "mealsIncluded": boolean },
    "business": { "priceUSD": number, "mealsIncluded": boolean }
  },
  "stops": number,                     // Number of stops
  "availableSeats": number             // Total available seats
}

Return strictly valid JSON with an array called "flights". No extra text. Example:

{
  "flights": [
    {
      "flightNumber": "AI202",
      "airline": "Air India",
      "departureAirport": "Indira Gandhi International Airport (DEL)",
      "arrivalAirport": "Chhatrapati Shivaji International Airport (BOM)",
      "departureTime": "2025-11-20T14:30:00",
      "arrivalTime": "2025-11-20T18:45:00",
      "durationMinutes": 255,
      "classes": {
        "economy": { "priceUSD": 500, "mealsIncluded": true },
        "business": { "priceUSD": 1200, "mealsIncluded": true }
      },
      "stops": 1,
      "availableSeats": 50
    }
  ]
}
`;
}
