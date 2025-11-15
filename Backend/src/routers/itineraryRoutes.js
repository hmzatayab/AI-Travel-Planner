import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateItinerary, listUserItineraries, getItineraryById } from "../controllers/itineraryController.js";

const router = express.Router();

router.get("/", protect, listUserItineraries);
router.post("/generate", protect, generateItinerary);
router.get("/:id", protect, getItineraryById);

export default router;
