# Frontend Migration Guide: Moving to Live WebSocket API

This document outlines the specific changes required for the frontend team to switch from the legacy "Record & Submit" flow to the new real-time "Live Coding Interview" flow.

## 1. Overview
- **Old Flow:** Record audio -> POST FormData to `/api/roast` -> Wait -> Play MP3.
- **New Flow:** Open WebSocket -> Stream Audio/Code continuously -> Receive Real-time Audio/Text.
- **Goal:** Latency < 500ms. The AI interrupts you if you speak.

## 2. API Connection
- **Endpoint:** `ws://localhost:3001` (or use relative path if proxying WS)
- **Protocol:** JSON messages over WebSocket.

### Essential Message Types (Send)
| Type | Payload | Description |
| :--- | :--- | :--- |
| `start` | `{ type: "start", language: "python" }` | Initiates the session. |
| `audio` | `{ type: "audio", data: "base64..." }` | Sends microphone audio (16kHz PCM16 Mono). |
| `code` | `{ type: "code", content: "print('hello')", language: "python" }` | Sends code updates (debounce this!). |
| `stop` | `{ type: "stop" }` | Ends the session. |

### Essential Message Types (Receive)
| Type | Payload | Description |
| :--- | :--- | :--- |
| `audio` | `{ type: "audio", data: "base64..." }` | PCM16 audio chunk to play immediately. |
| `transcript` | `{ type: "transcript", text: "..." }` | Text of what the AI is saying (captions). |
| `input_transcript` | `{ type: "input_transcript", text: "..." }` | Text of what the user said (for verification). |
| `interrupted` | `{ type: "interrupted" }` | The user spoke while AI was speaking. **Stop playback immediately.** |

## 3. Frontend Tasks (Checklist)

### A. Remove Legacy Upload Logic
- [ ] Remove `fetch('/api/roast', ...)` call.
- [ ] Remove `FormData` construction.

### B. Implement WebSocket Client
- [ ] Create a `useLiveSession` hook or similar manager.
- [ ] Handle connection lifecycle (Open, Close, Error).
- [ ] Handle incoming messages (`audio`, `transcript`, `input_transcript`, `interrupted`).

### C. Audio Input (Microphone) - **HARDEST PART**
- [ ] **Crucial:** The backend expects **16kHz 16-bit Mono PCM**.
- [ ] *Cannot* use simple `MediaRecorder` (it gives WebM/Ogg).
- [ ] **Solution:** Use `AudioContext` + `AudioWorklet` (or `ScriptProcessorNode` if easier for hackathon).
- [ ] Downsample browser audio (usually 44.1kHz or 48kHz) to 16kHz.
- [ ] Convert Float32 to Int16.
- [ ] Base64 encode.
- [ ] Send chunks ~100ms apart.

### D. Audio Output (Speaker)
- [ ] **Crucial:** The backend sends **16kHz 16-bit Mono PCM** (not MP3).
- [ ] *Cannot* use `<audio src="...">`.
- [ ] **Solution:** Use `AudioContext`.
    - Decode base64 to Int16.
    - Convert Int16 to Float32.
    - Schedule on `AudioContext` timeline (`bufferSource.start(startTime)`).
    - Maintain a "nextStartTime" pointer to effect seamless streaming.

### E. Code Editor
- [ ] Hook into `Monaco`'s `onChange`.
- [ ] **Debounce** updates (e.g., send every 2 seconds or on pause). Sending every keystroke is mostly okay but wastes bandwidth.
- [ ] Send `{ type: "code", ... }` updates.

## 4. Key Challenges to Watch For
1.  **Audio Glitches:** If the playback buffer runs dry, audio sounds robotic. Implement a small jitter buffer if needed.
2.  **Echo Cancellation:** If not using headphones, the mic might pick up the AI's voice. Browsers have built-in AEC (`echoCancellation: true` in `getUserMedia`), ensure it's on.
3.  **Permissions:** User interaction (click "Start Interview") is required to initialize `AudioContext`.

---

**Summary for Teammates:**
"Stop using the POST endpoint. Build a WebSocket client that streams raw PCM audio and code updates. I have the backend ready at `ws://localhost:3001`."
