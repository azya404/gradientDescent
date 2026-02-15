const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { WebSocketServer } = require("ws");
require("dotenv").config();

const { generateRoast } = require("./gemini");
const { textToSpeech } = require("./elevenlabs");
const { createLiveSession, sendAudio, sendCode } = require("./live");

// --- App Init ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Multer: store uploaded audio in memory as a Buffer
const upload = multer({ storage: multer.memoryStorage() });

// --- HTTP Routes ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", message: "The interviewer is ready to roast." });
});

// Browser test page
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

// Legacy endpoint — accepts code + optional audio, returns a roast (kept as fallback)
app.post("/api/roast", upload.single("audio"), async (req, res) => {
  const { language, code } = req.body;
  const audioFile = req.file;

  if (!code) {
    return res.status(400).json({ error: "No code submitted. Too scared to even try?" });
  }

  console.log("--- Roast Request Received (Legacy) ---");
  console.log(`Language: ${language || "not specified"}`);
  console.log(`Code length: ${code.length} chars`);
  console.log(`Audio: ${audioFile ? `${audioFile.size} bytes` : "none"}`);

  try {
    const roast = await generateRoast(code, language, audioFile?.buffer, audioFile?.mimetype);
    console.log(`Roast generated (${roast.length} chars): ${roast.substring(0, 100)}...`);

    console.log("Converting roast to speech via ElevenLabs...");
    const audioBuffer = await textToSpeech(roast);
    console.log(`Audio buffer received: ${audioBuffer.length} bytes`);

    if (audioBuffer.length < 1000) {
      console.warn("WARNING: Audio buffer suspiciously small, may not be valid audio");
      console.warn("First 200 bytes as string:", audioBuffer.toString("utf-8", 0, 200));
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "X-Roast-Text": encodeURIComponent(roast),
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("Pipeline error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "The interviewer had a meltdown. Try again.", details: err.message });
  }
});

// --- HTTP Server + WebSocket ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("[WS] Client connected");
  let liveSession = null;

  ws.on("message", async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    switch (msg.type) {
      // --- Start a new live session ---
      case "start": {
        if (liveSession) {
          ws.send(JSON.stringify({ type: "error", message: "Session already active" }));
          return;
        }

        try {
          console.log(`[WS] Starting live session (language: ${msg.language || "any"})`);
          liveSession = await createLiveSession({
            onAudioChunk: (base64Data) => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "audio", data: base64Data }));
              }
            },
            onTranscript: (text) => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "transcript", text }));
              }
            },
            onInputTranscript: (text) => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "input_transcript", text }));
              }
            },
            onInterrupted: () => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "interrupted" }));
              }
            },
            onTurnComplete: () => {
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "turn_complete" }));
              }
            },
            onError: (err) => {
              console.error("[WS] Live session error:", err.message || err);
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "error", message: err.message || "Live session error" }));
              }
            },
            onClose: () => {
              console.log("[WS] Live session closed by Gemini");
              liveSession = null;
              if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({ type: "stopped" }));
              }
            },
          });

          ws.send(JSON.stringify({ type: "started" }));
          console.log("[WS] Live session started");
        } catch (err) {
          console.error("[WS] Failed to start live session:", err.message);
          ws.send(JSON.stringify({ type: "error", message: `Failed to start session: ${err.message}` }));
        }
        break;
      }

      // --- Send code update ---
      case "code": {
        if (!liveSession) {
          ws.send(JSON.stringify({ type: "error", message: "No active session. Send 'start' first." }));
          return;
        }
        console.log(`[WS] Code received (${msg.content?.length || 0} chars)`);
        sendCode(liveSession, msg.content, msg.language);
        break;
      }

      // --- Send audio chunk ---
      case "audio": {
        if (!liveSession) {
          ws.send(JSON.stringify({ type: "error", message: "No active session. Send 'start' first." }));
          return;
        }
        sendAudio(liveSession, msg.data);
        break;
      }

      // --- Stop session ---
      case "stop": {
        if (liveSession) {
          console.log("[WS] Stopping live session");
          try {
            liveSession.close();
          } catch (err) {
            console.error("[WS] Error closing session:", err.message);
          }
          liveSession = null;
          ws.send(JSON.stringify({ type: "stopped" }));
        }
        break;
      }

      default:
        ws.send(JSON.stringify({ type: "error", message: `Unknown message type: ${msg.type}` }));
    }
  });

  ws.on("close", () => {
    console.log("[WS] Client disconnected");
    if (liveSession) {
      try {
        liveSession.close();
      } catch (err) {
        console.error("[WS] Error closing session on disconnect:", err.message);
      }
      liveSession = null;
    }
  });

  ws.on("error", (err) => {
    console.error("[WS] WebSocket error:", err.message);
  });
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`🔥 Brainrot Interviewer backend running on http://localhost:${PORT}`);
  console.log(`🎤 Live WebSocket available at ws://localhost:${PORT}`);
});
