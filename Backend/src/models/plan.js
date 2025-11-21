import mongoose from "mongoose";
const { Schema } = mongoose;

const PlanSchema = new Schema(
  {
    name: { type: String },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 }, 
    currency: { type: String, default: "USD" },
    durationDays: { type: Number, default: 30 }, 
    aiCredits: { type: Number, default: 0 }, 
    creditCostPerTrip: { type: Number, default: 10 }, 
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
); 

export default mongoose.model("Plan", PlanSchema);
