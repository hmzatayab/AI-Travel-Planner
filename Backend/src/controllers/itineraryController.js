import Itinerary from "../models/itinerary.js";
import User from "../models/user.js";
import Plan from "../models/plan.js";
import { callAI, extractJSON } from "../services/aiService.js";
import {
  buildPrompt,
  buildHotelPrompt,
  buildFlightPrompt,
} from "../services/itineraryPrompt.js";

export const generateItinerary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });

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
        success: false,
        message:
          "Please provide origin or destination, durationDays and budget.",
      });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.isBlocked)
      return res
        .status(403)
        .json({ success: false, message: "User account is blocked." });
    if (!user.subscription || user.subscription.aiCredits < 10)
      return res
        .status(403)
        .json({ success: false, message: "Insufficient AI credits." });

    const currentPlan = await Plan.findById(user.subscription.planId);
    if (!currentPlan)
      return res
        .status(404)
        .json({ success: false, message: "User plan not found." });
    if (currentPlan.aiCredits < currentPlan.creditCostPerTrip)
      return res
        .status(403)
        .json({ success: false, message: "Insufficient AI credits." });

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
      return res.status(502).json({
        success: false,
        message: "AI service error",
        error: aiErr.message,
      });
    }

    let itineraryData = aiResult.parsed || extractJSON(aiResult.raw);

    if (!itineraryData) {
      try {
        itineraryData = JSON.parse(aiResult.raw);
      } catch {
        return res.status(500).json({
          success: false,
          message: "AI returned invalid JSON.",
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
      hotelSuggestions: [],
      flights: [],
      costBreakdown: {
        flights: 0,
        hotels: 0,
        food: 0,
        transport: 0,
        activities: 0,
        other: 0,
      },
      totalEstimatedCost: 0,
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

    currentPlan.aiCredits -= currentPlan.creditCostPerTrip;
    await currentPlan.save();

    return res.status(201).json({
      success: true,
      message: "Itinerary generated and saved.",
      itinerary: newItinerary,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
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

export const generateHotelsForItinerary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });

    const { id: itineraryId } = req.params;
    if (!itineraryId)
      return res
        .status(400)
        .json({ success: false, message: "Itinerary ID is required." });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary)
      return res
        .status(404)
        .json({ success: false, message: "Itinerary not found." });
    if (itinerary.userId.toString() !== userId)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access." });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.isBlocked)
      return res
        .status(403)
        .json({ success: false, message: "User account is blocked." });
    if (!user.subscription || user.subscription.aiCredits < 5)
      return res
        .status(403)
        .json({ success: false, message: "Insufficient AI credits." });

    const currentPlan = await Plan.findById(user.subscription.planId);
    if (!currentPlan)
      return res
        .status(404)
        .json({ success: false, message: "User plan not found." });
    if (currentPlan.aiCredits < 5)
      return res
        .status(403)
        .json({ success: false, message: "Insufficient AI credits." });

    const prompt = buildHotelPrompt(itinerary.destination);

    let aiResult;
    try {
      aiResult = await callAI(prompt);
    } catch (aiErr) {
      return res.status(502).json({
        success: false,
        message: "AI service error",
        error: aiErr.message,
      });
    }

    let hotelData;
    try {
      hotelData = aiResult.parsed || JSON.parse(aiResult.raw);
      if (Array.isArray(hotelData)) hotelData = { hotels: hotelData };
      if (!Array.isArray(hotelData.hotels))
        throw new Error("AI returned invalid hotel array.");
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to parse hotel data from AI response",
        rawResponsePreview: aiResult.raw?.slice(0, 300) + "...",
      });
    }

    itinerary.hotelSuggestions = hotelData.hotels;
    await itinerary.save();

    currentPlan.aiCredits -= 5;
    await currentPlan.save();

    return res.status(201).json({
      success: true,
      message: "Hotels generated successfully.",
      hotels: hotelData.hotels,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const generateFlightsForItinerary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated" });

    const { id: itineraryId } = req.params;
    if (!itineraryId)
      return res
        .status(400)
        .json({ success: false, message: "Itinerary ID is required." });

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary)
      return res
        .status(404)
        .json({ success: false, message: "Itinerary not found." });
    if (itinerary.userId.toString() !== userId)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access." });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.isBlocked)
      return res
        .status(403)
        .json({ success: false, message: "User account is blocked." });
    if (!user.subscription || user.subscription.aiCredits < 5)
      return res
        .status(403)
        .json({ success: false, message: "Insufficient AI credits." });

    const currentPlan = await Plan.findById(user.subscription.planId);
    if (!currentPlan)
      return res
        .status(404)
        .json({ success: false, message: "User plan not found." });
    if (currentPlan.aiCredits < 5)
      return res
        .status(403)
        .json({ success: false, message: "Insufficient AI credits." });

    const prompt = buildFlightPrompt(itinerary.origin, itinerary.destination);

    let aiResult;
    try {
      aiResult = await callAI(prompt);
    } catch (aiErr) {
      return res
        .status(502)
        .json({
          success: false,
          message: "AI service error",
          error: aiErr.message,
        });
    }

    let flightData;
    try {
      flightData = aiResult.parsed || JSON.parse(aiResult.raw);
      if (Array.isArray(flightData)) flightData = { flights: flightData };
      if (!Array.isArray(flightData.flights))
        throw new Error("AI returned invalid flight array.");
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to parse flight data from AI response",
        rawResponsePreview: aiResult.raw?.slice(0, 300) + "...",
      });
    }

    itinerary.flights = flightData.flights;
    await itinerary.save();

    currentPlan.aiCredits -= 5;
    await currentPlan.save();

    return res.status(201).json({
      success: true,
      message: "Flights generated successfully.",
      flights: flightData.flights,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
