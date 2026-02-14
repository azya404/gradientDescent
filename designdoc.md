System Design Document: The "Brainrot" SWE Interviewer
1. Project Overview & Objectives
The Concept:
An AI-powered mock technical interviewer that aggressively roasts candidates' code using toxic, "brain-rotted" tech-bro vocabulary. Instead of providing helpful feedback, the AI exists solely to gatekeep, insult the user's "aura," and generate comedic reactions.

Hackathon Objectives (UAIS SillyCon Valley):

Maximize Creativity: Build something unapologetically absurd and "cursed" that directly mocks the computer science student experience.

AI Integration: Chain a Large Language Model (LLM) for generative text with a Text-to-Speech (TTS) model for real-time voice synthesis.

The Demo Video: Create a highly visual, 3-minute split-screen skit demonstrating a candidate failing a live interview against the AI.

2. System Architecture & Tech Stack
Frontend UI: React.js (or simple HTML/JS/CSS). The interface will parody a sterile, intimidating corporate assessment portal, acting as the visual shell for the "interview."

Backend Server: Node.js with Express. Acts as the orchestration layer to securely hold API keys and manage the asynchronous flow of data between the frontend and the two separate AI models.

Text Generation (LLM): Gemini API (or OpenAI API). Processes the user's submitted code against a heavy system prompt to generate the text-based insult.

Voice Generation (TTS): ElevenLabs API (using the flash/low-latency model). Converts the LLM text output into a highly realistic, aggressive MP3 audio stream.

3. Data Flow
Input: The user pastes their code into the Frontend editor and clicks the "Submit for Review" button.

Request: The Frontend sends a simple HTTP POST request containing the code string to the Backend.

LLM Processing: The Backend injects the user's code into a pre-defined System Prompt and calls the text-generation API.

TTS Processing: Once the LLM returns the roasted text response, the Backend immediately passes that exact text string to the text-to-speech API.

Delivery: The Backend receives the generated audio buffer from the TTS service and pipes it back to the Frontend.

Playback: The Frontend automatically plays the audio file out loud and triggers a visual "Speaking" animation on the AI avatar.

4. API Contract (Backend to Frontend)
To keep development parallel and clean, the backend will expose a single endpoint for the frontend to hit.

Endpoint: POST /api/roast

Expected Request Payload: A standard JSON object containing two key-value pairs. First, a string identifying the programming language used. Second, a string containing the raw code submitted by the user.

Expected Response Payload:
A raw MP3 audio buffer/stream (Content-Type: audio/mpeg) ready for immediate playback in the browser via standard HTML5 audio routing.

5. Task Delegation & Execution Plan
To finish this within the 24-hour timeframe, work must be strictly parallelized across the team.

⚙️ Core Backend & API Orchestration (Lead: Krish)
Environment Setup: Spin up the server framework and the frontend shell. Secure all environment variables for the required API keys.

LLM Integration: Write the controller logic that binds the system prompt to the user's code and successfully returns a text string from the LLM.

Voice Integration: Implement the TTS SDK to accept the LLM text and return an audio file, optimizing for the lowest latency possible.

Endpoint Creation: Finalize the routing and ensure Cross-Origin Resource Sharing (CORS) is configured so the frontend team can hit the endpoint locally without blockers.

🎨 Frontend Engineering & UX Design
UI Layout: Build a fake video-conferencing UI. It should feature a large code-input block on the left and an imposing, pulsing "AI Interviewer" avatar on the right.

State Management: Handle the text input area, loading spinners (crucial for UX while waiting for the AI response to generate), and the audio player logic.

Styling: Use aggressive, corporate styling to make the portal look overly serious, contrasting heavily with the absurdity of the AI.

🎭 AI Persona & Demo Production (Creative Direction)
Prompt Engineering: Iterate on the LLM system prompt in a web playground before it goes into the source code. The prompt must force the AI to use specific vocabulary ("aura," "cooked," "raw binary") and restrict it to short, punchy responses (under 3 sentences) so the audio generates quickly.

Voice Selection: Navigate the TTS provider's Voice Library and select the perfect voice model (e.g., a hyper-energetic tech influencer or a deep, robotic corporate voice), then pass the specific Voice ID to the backend lead.

The 3-Minute Demo Skit: Write the script for the final video submission. Plan out the "split-screen" video showing a user typing perfectly good code, only to be verbally destroyed by the AI.

# New addition
But here is the brutal reality of trying to build that in under 24 hours: The Latency Trap.

If you try to build a true live screen-reading AI, your app has to continuously take screenshots, send them via WebSockets to a Vision API, wait for the LLM to parse the code, generate a text response, and then pipe that through a Text-to-Speech API. Even with the fastest models available, that round-trip takes about 3 to 6 seconds.

If you do that live, you will type something, and there will be 5 seconds of awkward dead silence before the AI finally insults you. It completely ruins the comedic timing of the roast. Plus, managing WebRTC or continuous WebSocket streams will eat up all of your development time, leaving your beginner teammates with nothing to integrate.

Here is how you solve this while still delivering a killer presentation:

🎬 The "Movie Magic" Demo Video
Hackathon demo videos are about selling the experience of the product. You do not need the app to read your screen live to make the 3-minute video look incredible.

Record the Code: You just screen-record yourself typing out a Python solution in VS Code or LeetCode, making mistakes or writing unoptimized code on purpose.

Record the AI: You take that same code, paste it into your app's frontend, and record the AI generating its audio roasts.

Stitch It Together: Your teammates take those two separate videos, put them side-by-side in CapCut or Premiere, and manually sync the audio so the AI interrupts you right as you make a mistake.

To the judges, it looks exactly like a live, real-time interview call. It guarantees perfect comedic timing, zero latency hiccups, and a polished pitch.

⚙️ How the Actual App Works (The "Checkpoint" Method)
When the judges walk up to your table on Saturday and ask to see it working live, you still want it to feel interactive. Instead of a continuous live video stream, you use an Event-Driven architecture.

You build a giant "Run Code" or "Submit" button on your frontend.

You type a few lines of code into the browser.

You hit the button.

That is the exact moment your Node backend fires off the API calls.

The AI immediately responds with the audio roast based on what you just submitted.

It still feels incredibly interactive and live to the user, but you save yourself the nightmare of building a continuous screen-capture loop, allowing you to actually finish the core logic before the deadline.

Do you want to stick with this Event-Driven approach to ensure you finish on time, or do you want me to outline the WebSocket architecture required if you absolutely want to attempt the live screen-reading?

GPT-4o Low Latency Screen to Voice Tutorial
This video demonstrates the architecture required to build a low-latency screen-reading AI, showing exactly what goes into handling continuous OCR and voice streams if you decide to explore that route.