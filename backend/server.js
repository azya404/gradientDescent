const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

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
app.post("/api/roast", upload.single("audio"), (req, res) => {
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

  // --- Dummy response (will be replaced with Gemini + ElevenLabs) ---
  const dummyRoast =
    "Bro really wrote a nested for-loop and called it 'optimized'. " +
    "This code has more red flags than your LinkedIn profile. " +
    "I've seen better architecture in a Minecraft dirt house.";

  res.json({
    roast: dummyRoast,
    meta: {
      language: language || "unknown",
      codeLength: code.length,
      hadAudio: !!audioFile,
    },
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🔥 Brainrot Interviewer backend running on http://localhost:${PORT}`);
});
