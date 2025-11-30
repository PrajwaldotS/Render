// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());              // allow frontend (different port) to call this API
app.use(express.json());      // parse JSON body

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define a Schema (structure of your form data)
const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

// Create a Model (collection = "forms")
const Form = mongoose.model("Form", formSchema);

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Route to handle form submission
app.post("/api/form", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEntry = new Form({ name, email });
    await newEntry.save();

    res.status(201).json({ message: "Form data saved successfully", data: newEntry });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
