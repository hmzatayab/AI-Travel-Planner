import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routers/user.js";
import itineraryRoutes from "./routers/itineraryRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5175", // your React app URL
    credentials: true, // allow cookies from frontend
  })
)

app.get("/", (req, res) => {
  res.send("🌍 AI Travel Planner Backend Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/itineraries", itineraryRoutes);

export default app;