import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [4, "Username must be at least 4 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      lowercase: true,
    },
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    subscription: {
      planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", default: null },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ["active", "expired", "none"],
        default: "none",
      },
    },
    savedTrips: [
      {
        title: String,
        destination: String,
        startDate: Date,
        endDate: Date,
        budget: Number,
        preferences: [String], // e.g., ["Family", "Luxury"]
        interests: [String], // e.g., ["Beaches", "Shopping"]
        itinerary: Object, // full AI-generated trip JSON
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isBlocked: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;