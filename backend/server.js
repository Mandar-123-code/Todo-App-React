/* eslint-disable no-undef */

import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import todoRoutes from "./routes/todos.js";

// Load environment variables from .env
dotenv.config({ path: path.resolve("./backend/.env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MONGO_URI not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/todos", todoRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));