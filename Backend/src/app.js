import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routers/user.js";
import itineraryRoutes from "./routers/itineraryRoutes.js";
import paymentRoutes from "./routers/paymentRoutes.js";
import { stripeWebhook } from "./controllers/paymentController.js";

const app = express();
dotenv.config();
connectDB();

app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5175", // your React app URL
    credentials: true, // allow cookies from frontend
  })
);

app.get("/", (req, res) => {
  res.send("🌍 AI Travel Planner Backend Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/payment", paymentRoutes);

export default app;
