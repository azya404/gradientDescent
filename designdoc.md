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

1.  **Input:**
    *   **Code:** The user pastes their solution (e.g., a brute-force $O(n^2)$ approach) into the React code editor.
    *   **Speech (Optional but Recommended):** The user holds a "Explain Solution" button and verbally explains their terrible logic (e.g., "I think this double for-loop is actually O(1) because n is small").
2.  **Trigger:** The user releases the button or clicks "Submit for Review".
3.  **Request:** The frontend sends a **multipart/form-data** POST request containing the code (text) and the explanation (audio blob).
4.  **Streaming Orchestration (Backend):**
    *   **Multimodal Analysis:** The backend sends *both* the code text and the audio file to **Gemini 1.5 Flash** (which is multimodal and can hear audio natively).
    *   Gemini generates the roast text based on the *bad code* AND the *delusional explanation*.
    *   **Text-to-Speech:** The generated roast text is piped into the **ElevenLabs API**.
5.  **Delivery & Playback:** The backend receives the audio stream from ElevenLabs and pipes it to the frontend.
6.  **Reaction:** The frontend auto-plays the audio alongside a visual "Speaking" animation on the UI avatar.

## 4. API Contract

**Endpoint:** `POST /api/roast`

**Expected Request Payload (Multipart/Form-Data):**
*   `language`: (Text) "python"
*   `code`: (Text) The user's code snippet.
*   `audio`: (File/Blob) The recorded audio of the user explaining their code.

**Expected Response:**
*   **Content-Type:** `audio/mpeg`
*   **Body:** A raw streaming audio buffer ready for immediate HTML5 audio routing.

## 5. Implementation Plan & Task Delegation

### Phase 1: Core Backend & API Orchestration
**Owner:** Krish

*   **Environment Setup:**
    *   Initialize Node/Express server.
    *   Set up `.env` for `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`.
    *   Configure CORS and `multer` (for file uploads).
*   **Prompt Engineering & Multimodal Logic:**
    *   Implement `Gemini 1.5 Flash` calls that accept both text (code) and audio (explanation).
    *   System Prompt: "You are a toxic 10x engineer interviewer. The candidate has submitted code and an audio explanation. Roast their specific code errors AND mock their tone of voice/explanation absurdity. Keep response short."
*   **Streaming Logic:**
    *   Chain Gemini output -> ElevenLabs input -> Client Audio Stream.

### Phase 2: Frontend Engineering & UX Design
**Owners:** Haasya & Dev

*   **UI Scaffolding:**
    *   Initialize React app (Vite).
    *   Build a two-column split-screen layout.
*   **State Management:**
    *   Implement Code Editor (Monaco).
    *   Implement **Audio Recorder**: Add a "Hold to Explain" button that records microphone input.
    *   Implement "Submit" handling to package code + audio into `FormData`.
*   **Audio Handling:**
    *   Play back the response audio blob.
    *   Visualize the "Interviewer" speaking.

### Phase 3: The "Movie Magic" Demo Production
**Owners:** All Team Members

*   **Screen Recording:** Record writing terrible code.
*   **Voice Recording:** Record yourself confidently explaining the terrible code.
*   **Asset Generation:** Run both through the app to generate the perfect specific roast.
*   **Video Editing:** Sync it all up for the final demo reel.