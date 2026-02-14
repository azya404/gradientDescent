const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const { generateRoast } = require("./gemini");

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
    // --- Generate roast via Gemini ---
    const roast = await generateRoast(code, language);
    console.log(`Roast generated: ${roast.substring(0, 80)}...`);

    res.json({
      roast,
      meta: {
        language: language || "unknown",
        codeLength: code.length,
        hadAudio: !!audioFile,
      },
    });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "The interviewer had a meltdown. Try again.", details: err.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🔥 Brainrot Interviewer backend running on http://localhost:${PORT}`);
});
