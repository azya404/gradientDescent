# Technical Design Document: The "Brainrot" SWE Interviewer

## 1. Project Overview & Objectives

**Project:** The "Brainrot" SWE Interviewer  
**Event:** UAIS SillyCon Valley Hackathon  
**Lead Engineer:** Krish  
**Team:** Krish (Backend), Haasya (Frontend), Dev (Frontend)

**The Concept:**
An event-driven, AI-powered mock technical interviewer that aggressively roasts candidates' code using toxic tech-bro vocabulary. The application parodies the intense, high-stakes technical interview rounds candidates face at companies like Wealthsimple, 1Password, or Ada CX. Instead of providing constructive feedback, the AI exists solely to gatekeep, insult the user's "aura," and deliver comedic reactions to unoptimized code.

**Key Hackathon Objectives:**

*   **Maximize Comedy over Complexity:** Build something unapologetically absurd that directly mocks the computer science student experience.
*   **Zero-Latency Illusion:** Utilize an Event-Driven "Checkpoint" architecture rather than continuous WebSockets to avoid latency traps and ensure reliable demo performance.
*   **Agentic Execution:** Provide a clear API contract so AI coding tools can autonomously build the frontend and backend in parallel.

## 2. System Architecture & Tech Stack

The stack leans on a lightweight JavaScript ecosystem to ensure rapid development and easy asynchronous handling.

### Frontend (Client-Side)
*   **Framework:** React.js (Vite)
*   **Styling:** CSS Modules or Tailwind CSS (for rapid corporate-style UI)
*   **Role:** Single-page application parodying a sterile corporate assessment portal. Contains the code editor, "Submit" button, and the AI avatar.

### Backend (Server-Side)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Role:** Orchestration layer. Securely manages API keys, processes incoming code payloads, and handles the text and audio streaming pipeline.

### AI Services
*   **Text Generation:** **Gemini API** (Google)
    *   *Usage:* Processes the user's code against a heavily restricted system prompt to generate short, punchy, unformatted text insults.
*   **Voice Generation:** **ElevenLabs API**
    *   *Usage:* Uses a low-latency model to convert the Gemini text output into an aggressive MP3 audio stream.

## 3. Data Flow & The "Checkpoint" Method

To guarantee flawless comedic timing for the hackathon presentation, the system operates on explicit user triggers rather than continuous screen reading.

1.  **Input:** The user pastes their solution (e.g., a brute-force $O(n^2)$ approach) into the React code editor.
2.  **Trigger:** The user clicks the "Submit for Review" button, instantly initializing the browser's audio context.
3.  **Request:** The frontend sends an HTTP POST request to the backend containing the language and the raw code string.
4.  **Streaming Orchestration (Backend):**
    *   The backend injects the code into the System Prompt.
    *   It calls the Gemini API to generate the roast.
    *   **Crucial Step:** The text generation API streams its output directly into the ElevenLabs API, bypassing the need to wait for the entire text block to generate (if possible) or chaining them tightly.
5.  **Delivery & Playback:** The backend receives the audio stream and pipes it to the frontend.
6.  **Reaction:** The frontend auto-plays the audio alongside a visual "Speaking" animation on the UI avatar.

## 4. API Contract

**Endpoint:** `POST /api/roast`

**Expected Request Payload (JSON):**
```json
{
  "language": "python",
  "code": "for i in range(len(nums)):\n  for j in range(i+1, len(nums)):\n    if nums[i] == nums[j]:\n      return True"
}
```

**Expected Response:**
*   **Content-Type:** `audio/mpeg`
*   **Body:** A raw streaming audio buffer ready for immediate HTML5 audio routing.

## 5. Implementation Plan & Task Delegation

### Phase 1: Core Backend & API Orchestration
**Owner:** Krish

*   **Environment Setup:**
    *   Initialize Node/Express server.
    *   Set up `.env` for `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`.
    *   Configure CORS to allow requests from the local React frontend.
*   **Prompt Engineering:**
    *   Write a strict system prompt instructing Gemini to output ONLY plain spoken text (no Markdown, no backticks, no emojis).
    *   Inject the "Brainrot" personality: use words like "aura", "cooked", "O(n^2) garbage", "skill issue".
*   **Streaming Logic:**
    *   Implement the controller logic for `POST /api/roast`.
    *   Chain the Gemini text response into the ElevenLabs TTS SDK.
    *   Ensure the response is piped back to the client as an audio stream.

### Phase 2: Frontend Engineering & UX Design
**Owners:** Haasya & Dev

*   **UI Scaffolding:**
    *   Initialize React app (Vite).
    *   Build a two-column split-screen layout mimicking a video call (User video vs. AI Interviewer).
*   **State Management:**
    *   Implement the code input block (Monaco Editor or simple textarea).
    *   Implement the "Submit" button.
    *   Add a loading spinner/state for visual feedback while waiting for the roast.
*   **Audio Handling:**
    *   Write logic to accept the incoming `audio/mpeg` blob from the backend.
    *   Play it immediately upon receipt.
    *   Ensure compliance with browser auto-play policies (trigger must be user interaction).
*   **Visuals:**
    *   Create the "AI Avatar" - a static image or CSS animation that pulses when audio is playing.

### Phase 3: The "Movie Magic" Demo Production
**Owners:** All Team Members

*   **Screen Recording:** Record writing terrible code in a real IDE, acting highly stressed on a webcam.
*   **Asset Generation:** Run the terrible code through the finished local app and save the resulting ElevenLabs audio files.
*   **Video Editing:** Stitch the screen recording, webcam footage, and AI audio together in a video editor, perfectly syncing the AI's verbal interruptions to the exact moment a coding mistake is made on screen.