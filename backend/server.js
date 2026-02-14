const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const { generateRoast } = require("./gemini");
const { textToSpeech } = require("./elevenlabs");

// --- App Init ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Multer: store uploaded audio in memory as a Buffer
const upload = multer({ storage: multer.memoryStorage() });

// --- Routes ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", message: "The interviewer is ready to roast." });
});

// Core endpoint — accepts code + optional audio, returns a roast
app.post("/api/roast", upload.single("audio"), async (req, res) => {
  const { language, code } = req.body;
  const audioFile = req.file; // multer attaches this

  // --- Validation ---
  if (!code) {
    return res.status(400).json({ error: "No code submitted. Too scared to even try?" });
  }

  // Log what we received (helpful for debugging)
  console.log("--- Roast Request Received ---");
  console.log(`Language: ${language || "not specified"}`);
  console.log(`Code length: ${code.length} chars`);
  console.log(`Audio: ${audioFile ? `${audioFile.size} bytes` : "none"}`);

  try {
    // --- Step 1: Generate roast text via Gemini ---
    const roast = await generateRoast(code, language, audioFile?.buffer, audioFile?.mimetype);
    console.log(`Roast generated (${roast.length} chars): ${roast.substring(0, 100)}...`);

    // --- Step 2: Convert roast to speech via ElevenLabs ---
    console.log("Converting roast to speech via ElevenLabs...");
    const audioBuffer = await textToSpeech(roast);
    console.log(`Audio buffer received: ${audioBuffer.length} bytes`);

    // Sanity check: real MP3 files are at least a few KB
    if (audioBuffer.length < 1000) {
      console.warn("WARNING: Audio buffer suspiciously small, may not be valid audio");
      console.warn("First 200 bytes as string:", audioBuffer.toString("utf-8", 0, 200));
    }

    // Send audio as MP3 stream
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "X-Roast-Text": encodeURIComponent(roast), // frontend can read the text too
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("Pipeline error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "The interviewer had a meltdown. Try again.", details: err.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🔥 Brainrot Interviewer backend running on http://localhost:${PORT}`);
});
