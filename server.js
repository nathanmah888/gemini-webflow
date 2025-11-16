import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());
app.use(cors());

// Gemini client – uses GEMINI_API_KEY from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Simple health check
app.get("/", (req, res) => {
  res.send("OK");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const question = req.body.prompt || "";
    if (!question) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const result = await model.generateContent(question);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (e) {
    console.error("Gemini error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// Use Render's PORT if set, otherwise 8080 locally
const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server running on port " + port));

