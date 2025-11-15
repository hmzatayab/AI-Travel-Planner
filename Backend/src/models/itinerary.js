import mongoose from "mongoose";
const { Schema } = mongoose;

const DaySchema = new Schema(
  {
    dayNumber: Number,
    title: String,
    activities: [String],
    meals: [String],
    transportNotes: String,
  },
  { _id: false }
);

const HotelSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    stars: { type: Number, default: 0 },
    openingHours: { type: String, default: "N/A" },
    website: { type: String, default: null },
    facilities: { type: [String], default: [] },
    activities: { type: [String], default: [] },
  },
  { _id: false }
);

const FlightSchema = new Schema(
  {
    flightNumber: { type: String, required: true },
    airline: { type: String, required: true },
    departureAirport: { type: String, required: true },
    arrivalAirport: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 0 },
    classes: {
      economy: {
        priceUSD: { type: Number, default: 0 },
        mealsIncluded: { type: Boolean, default: false },
      },
      business: {
        priceUSD: { type: Number, default: 0 },
        mealsIncluded: { type: Boolean, default: false },
      },
    },
    stops: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },
  },
  { _id: false }
);

const ItinerarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String },
    origin: String,
    destination: String,
    durationDays: Number,
    budget: Number,
    preferences: [String],
    interests: [String],
    tripType: String,
    generationStage: {
      type: String,
      enum: ["days", "hotels", "flights", "completed"],
      default: "days",
    },
    generatedBy: {
      modelName: String,
      modelVersion: String,
      promptSnippet: String,
    },
    days: [DaySchema],
    hotelSuggestions: { type: [HotelSchema], default: [] },
    flights: { type: [FlightSchema], default: [] },
    costBreakdown: {
      flights: { type: Number, default: 0 },
      hotels: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    totalEstimatedCost: { type: Number, default: 0 },
    rawAIResponse: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ItinerarySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Itinerary", ItinerarySchema);
