import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateItinerary, listUserItineraries, getItineraryById, generateHotelsForItinerary, generateFlightsForItinerary } from "../controllers/itineraryController.js";

const router = express.Router();

router.get("/", protect, listUserItineraries);
router.post("/generate", protect, generateItinerary);
router.get("/:id", protect, getItineraryById);

router.post("/:id/hotels", protect, generateHotelsForItinerary);
router.post("/:id/flights", protect, generateFlightsForItinerary);

export default router;
