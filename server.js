// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // needed because import doesn't give __dirname

// Load env variables
dotenv.config();

const app = express();

// ------------------------------
// Middlewares
// ------------------------------
app.use(cors());              // allow frontend (different port/domains) to call this API
app.use(express.json());      // parse JSON body

// ------------------------------
// MongoDB Connection
// ------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------------------
// Mongoose Schema + Model
// ------------------------------
const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

// ------------------------------
// Frontend Serving (IMPORTANT)
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /client folder
app.use(express.static(path.join(__dirname, "client")));

// When user visits "/", send index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// ------------------------------
// API Routes
// ------------------------------
app.post("/api/form", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEntry = new Form({ name, email });
    await newEntry.save();

    res.status(201).json({
      message: "Form data saved successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
