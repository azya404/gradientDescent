# Backend Changes Summary: Main Branch vs Animations Branch

## Overview
Your teammate has updated the **main branch** with a completely new **WebSocket-based Live API** architecture, while your **animations branch** still uses the **legacy POST endpoint** architecture.

---

## Architecture Comparison

### ❌ Current (Animations Branch) - Legacy Architecture
**File:** `backend/server.js` (80 lines, simple)
- **Protocol:** HTTP POST to `/api/roast`
- **Flow:**
  1. User records audio + writes code
  2. Frontend POSTs FormData to `/api/roast`
  3. Backend calls Gemini API (text analysis)
  4. Backend calls ElevenLabs TTS (MP3 generation)
  5. Backend returns MP3 file
  6. Frontend plays MP3
- **Latency:** ~5-10 seconds (batch processing)
- **Files:**
  - `server.js` - Simple Express server
  - `gemini.js` - Text-based analysis
  - `elevenlabs.js` - TTS generation

### ✅ New (Main Branch) - Live WebSocket Architecture
**File:** `backend/server.js` (200+ lines with WebSocket)
- **Protocol:** WebSocket (`ws://localhost:3001`)
- **Flow:**
  1. Frontend opens WebSocket connection
  2. **Real-time streaming:**
     - User speaks → mic streams 16kHz PCM audio → backend
     - User types → code updates stream → backend
     - Backend streams back 16kHz PCM audio chunks
  3. **AI interruption:** User can interrupt AI mid-speech
- **Latency:** < 500ms (real-time)
- **Files:**
  - `server.js` - Express + WebSocketServer
  - `gemini.js` - *(likely updated for streaming)*
  - `live.js` - **NEW FILE** - Gemini Live API integration
  - `elevenlabs.js` - *(still exists but marked as "legacy only")*

---

## Key Differences

| Feature | Animations Branch (Legacy) | Main Branch (New) |
|---------|---------------------------|-------------------|
| **Connection** | HTTP POST | WebSocket |
| **Audio Format** | MP3 (compressed) | 16kHz PCM16 Mono (raw) |
| **Audio Processing** | ElevenLabs TTS | Gemini Live API (native audio) |
| **Latency** | 5-10 seconds | < 500ms |
| **User Interruption** | ❌ Not possible | ✅ Supported |
| **Code Streaming** | ❌ Submit once | ✅ Real-time updates |
| **Frontend Complexity** | Simple (fetch + audio element) | Complex (WebSocket + AudioContext) |

---

## Backend Files Changed on Main

### 1. **`server.js`** - Major Rewrite
**Old (80 lines):**
```javascript
app.post("/api/roast", upload.single("audio"), async (req, res) => {
  const roast = await generateRoast(code, language, audioFile?.buffer, audioFile?.mimetype);
  const audioBuffer = await textToSpeech(roast); // ElevenLabs
  res.send(audioBuffer); // MP3
});
```

**New (200+ lines):**
```javascript
// HTTP Server + WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  let liveSession = null;

  ws.on("message", async (raw) => {
    const msg = JSON.parse(raw.toString());

    switch (msg.type) {
      case "start": // Initialize Gemini Live session
      case "audio": // Stream PCM audio to Gemini
      case "code":  // Stream code updates to Gemini
      case "stop":  // End session
    }
  });
});

// Legacy /api/roast endpoint kept as fallback
app.post("/api/roast", ...); // Still works!
```

### 2. **`live.js`** - NEW FILE (deleted in animations branch)
This file was added on main, then deleted on animations:
```javascript
const { GoogleGenAI, Modality } = require("@google/genai");

async function createLiveSession(callbacks) {
  const session = await ai.live.connect({
    model: "gemini-2.5-flash-native-audio-preview-12-2025",
    responseModalities: [Modality.AUDIO],
    callbacks: {
      onAudioChunk: (base64PCM) => { /* Stream to frontend */ },
      onTranscript: (text) => { /* Display captions */ },
      onInterrupted: () => { /* Handle user interruption */ },
    }
  });
  return session;
}

function sendAudio(session, base64PCM) { ... }
function sendCode(session, code, language) { ... }
```

### 3. **`.env.example`**
**Changed:**
```diff
-ELEVENLABS_API_KEY=your_elevenlabs_api_key_here  # Optional — only needed for legacy /api/roast endpoint
+ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```
*(Comment removed, both APIs now co-exist)*

---

## Frontend Migration Required (from FRONTEND_MIGRATION_TASKS.md)

### ⚠️ Critical Tasks

#### A. **Remove Legacy Upload Logic**
- [ ] Remove `fetch('/api/roast', ...)` call
- [ ] Remove `FormData` construction

#### B. **Implement WebSocket Client**
- [ ] Create `useLiveSession` hook or WebSocket manager
- [ ] Handle connection lifecycle (Open, Close, Error)
- [ ] Handle incoming messages: `audio`, `transcript`, `input_transcript`, `interrupted`

#### C. **Audio Input (Microphone) - HARDEST PART**
- [ ] **Cannot use `MediaRecorder`** (produces WebM/Ogg, not PCM)
- [ ] **Must use `AudioContext` + `AudioWorklet`** (or `ScriptProcessorNode`)
- [ ] Downsample browser audio (44.1kHz/48kHz → 16kHz)
- [ ] Convert Float32 → Int16 → Base64
- [ ] Send chunks ~100ms apart

#### D. **Audio Output (Speaker)**
- [ ] **Cannot use `<audio>` element** (expects MP3, not PCM)
- [ ] **Must use `AudioContext`**
- [ ] Decode base64 → Int16 → Float32
- [ ] Schedule buffers on AudioContext timeline
- [ ] Maintain `nextStartTime` pointer for seamless playback

#### E. **Code Editor**
- [ ] Hook Monaco's `onChange`
- [ ] **Debounce** updates (send every 2s or on pause)
- [ ] Send `{ type: "code", content, language }`

---

## WebSocket Message Protocol

### Frontend → Backend (Send)
```javascript
{ type: "start", language: "python" }          // Start session
{ type: "audio", data: "base64_pcm..." }       // Microphone chunk (16kHz PCM16 Mono)
{ type: "code", content: "...", language: "python" } // Code update
{ type: "stop" }                                // End session
```

### Backend → Frontend (Receive)
```javascript
{ type: "audio", data: "base64_pcm..." }       // Play this PCM chunk immediately
{ type: "transcript", text: "..." }            // What AI is saying (captions)
{ type: "input_transcript", text: "..." }      // What user said (verification)
{ type: "interrupted" }                         // User spoke, STOP playback NOW
```

---

## Recommendation: Migration Strategy

### Option 1: Keep Legacy Flow (Quick Fix)
**Your animations branch works fine** with the legacy `/api/roast` endpoint, which **still exists on main** as a fallback. You can:
1. Merge animations → main
2. Keep using POST endpoint for now
3. Frontend migration to WebSocket can be done later as a separate task

**Pros:**
- ✅ Your work merges immediately
- ✅ No frontend rewrite needed
- ✅ Animations work right away

**Cons:**
- ❌ No real-time features
- ❌ Still high latency

### Option 2: Full Migration (Harder, Better)
Implement the WebSocket client according to `FRONTEND_MIGRATION_TASKS.md`:
1. Build WebSocket manager
2. Implement PCM audio recording/playback
3. Stream code updates
4. Handle interruptions

**Pros:**
- ✅ Real-time AI interviews
- ✅ < 500ms latency
- ✅ User can interrupt AI

**Cons:**
- ❌ 4-8 hours of complex audio work
- ❌ Requires AudioContext expertise

---

## Files Status

### On Main Branch (New)
```
backend/
├── server.js          ✅ WebSocket + Legacy endpoint
├── live.js            ✅ Gemini Live API integration
├── gemini.js          ✅ Text-based (legacy)
├── elevenlabs.js      ✅ TTS (legacy)
└── .env.example       ✅ Updated
```

### On Animations Branch (Old)
```
backend/
├── server.js          ❌ Legacy only (no WebSocket)
├── gemini.js          ✅ Text-based
├── elevenlabs.js      ✅ TTS
└── .env.example       ❌ Old comment
```

### Missing on Animations
- `live.js` (Gemini Live API)
- WebSocket server code in `server.js`

---

## Next Steps

1. **Review your animation work:**
   - Frontend changes (AIAvatar, thought bubbles, etc.) are independent of backend
   - They'll work with either backend architecture

2. **Decide on migration strategy:**
   - **Option 1:** Merge animations, keep using legacy endpoint *(fastest)*
   - **Option 2:** Implement WebSocket client first *(better long-term)*

3. **Coordinate with teammate:**
   - Ask: "Should we ship with legacy endpoint first, then migrate to WebSocket?"
   - Or: "Do you need WebSocket implemented before merge?"

4. **Read the full migration guide:**
   - Open `frontend/FRONTEND_MIGRATION_TASKS.md` on main branch
   - It has detailed implementation steps for audio processing

---

**Bottom Line:**
- Your animations work is frontend-only and compatible with both backends
- Main branch has **both** legacy POST and new WebSocket endpoints
- You can merge now and migrate to WebSocket later
- Or implement WebSocket first if you have time (4-8 hours of work)
