import mongoose from "mongoose";
const { Schema } = mongoose;

const ActivitySchema = new Schema({
  place: String,
  description: String,
  startTime: String,
  endTime: String,
  estimatedCost: Number,
  notes: String
}, { _id: false });

const DaySchema = new Schema({
  dayNumber: Number,
  title: String,
  activities: [ActivitySchema],
  meals: [String],
  transportNotes: String
}, { _id: false });

const HotelSchema = new Schema({
  name: String,
  pricePerNight: Number,
  rating: Number,
  address: String,
  url: String
}, { _id: false });

const ItinerarySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String },
  origin: String,
  destination: String,
  durationDays: Number,
  budget: Number,
  preferences: [String],
  interests: [String],
  tripType: String,
  generatedBy: {
    modelName: String,
    modelVersion: String,
    promptSnippet: String
  },
  days: [DaySchema],
  hotelSuggestions: [HotelSchema],
  costBreakdown: {
    flights: Number,
    hotels: Number,
    food: Number,
    transport: Number,
    activities: Number,
    other: Number
  },
  totalEstimatedCost: Number,
  rawAIResponse: Schema.Types.Mixed, // store raw response for debugging
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ItinerarySchema.pre("save", function(next){
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Itinerary", ItinerarySchema);
