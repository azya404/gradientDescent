// Simple mock server for frontend testing (no API keys needed)
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/api/health", (req, res) => {
  res.json({ status: "alive", message: "Mock server running (no real AI)" });
});

app.post("/api/roast", upload.single("audio"), async (req, res) => {
  const { language, code } = req.body;
  const audioFile = req.file;

  console.log("--- Mock Roast Request ---");
  console.log(`Language: ${language || "not specified"}`);
  console.log(`Code length: ${code?.length || 0} chars`);
  console.log(`Audio: ${audioFile ? `${audioFile.size} bytes` : "none"}`);

  // Mock roast text
  const mockRoast = `Bruh, this ${language || 'code'} is straight bussin' with bugs, no cap. You really thought this O(n²) solution was sigma? That's some Ohio-level code right there. Back at Google we'd reject this in 0.5 seconds. Negative aura points for you, fr fr.`;

  // Send mock MP3 audio (use a pre-recorded sample or generate silence)
  // For now, we'll use a test file if it exists, or send minimal audio
  const testAudioPath = path.join(__dirname, "test-audio.mp3");

  if (fs.existsSync(testAudioPath)) {
    const audioBuffer = fs.readFileSync(testAudioPath);
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "X-Roast-Text": encodeURIComponent(mockRoast),
    });
    res.send(audioBuffer);
  } else {
    // Send minimal valid MP3 header if no test file exists
    console.log("⚠️ No test-audio.mp3 found, sending mock response without real audio");
    res.set({
      "Content-Type": "audio/mpeg",
      "X-Roast-Text": encodeURIComponent(mockRoast),
    });
    // Minimal MP3 frame (silent audio)
    const minimalMp3 = Buffer.from([
      0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    res.send(minimalMp3);
  }

  console.log("✅ Mock roast sent");
});

app.listen(PORT, () => {
  console.log(`🔥 MOCK Backend running on http://localhost:${PORT}`);
  console.log("⚠️ This is a mock server - no real AI calls are made");
  console.log("💡 Use this to test the frontend without API keys");
});
