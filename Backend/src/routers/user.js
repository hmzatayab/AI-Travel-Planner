import express from "express";
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getProfile, getUserPlan } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getProfile);

router.get("/my-plan", protect, getUserPlan);

export default router;
