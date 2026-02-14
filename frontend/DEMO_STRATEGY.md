# Demo Strategy & Webcam Integration

## 1. Should you add a video feature?
**Recommendation: YES.**

For a hackathon demo, "showing" is better than telling. Adding a live video feed of yourself (the candidate) while you code serves two critical purposes:
1.  **Proof of Life:** It proves the interaction is real-time and not a pre-recorded video.
2.  **Emotional Connection:** The audience sees *your* reaction to the AI's insults, which is where the comedy lives. The AI roasting you is funny, but your face twitching in annoyance is funnier.

## 2. Implementation Strategy

### A. The "Video Mirror" Component
You do **not** need to send the video stream to the backend. That adds unnecessary complexity and bandwidth usage (WebRTC/RTSP).
Instead, just mirror the local webcam stream to a `<video>` element on the frontend. The backend only needs the audio.

**Frontend Changes:**
- Replace the simple "Audio Recorder" button with a **"Candidate Profile"** card.
- This card contains:
    - **Webcam Feed:** A small (e.g., 240p or 360p) video element.
    - **Audio Visualizer:** Overlay the audio waveform on the video to show mic activity.
    - **Controls:** Mute/Unmute, Start/Stop Interview.

### B. UI Placement
To avoid crowding the code editor:
- **Option 1: Corner PIP (Picture-in-Picture):** Floating semi-transparent video in the bottom-right corner of the code editor.
    - *Pros:* Maximizes screen real estate for code.
    - *Cons:* Covers code; might be distracting.
- **Option 2: Sidebar (Recommended):** Place the video in the left sidebar, above or below the file tree (if any) or in the "Controls" area.
    - Given your current 2-column layout (Left: Editor, Right: Avatar), I recommend putting the **Webcam in the Bottom Left** or **Top Left** of the Editor column.
    - Or, split the Right Column: Top = AI Avatar, Bottom = Your Webcam. This creates a "Face-to-Face" dynamic.

## 3. Demo Recording Guide

Since this is a "Live API" demo, you should record it in **One Take** to show off the latency.

**The Script:**
1.  **Intro (0:00-0:15):** "Hi, I'm Krish. This is the Brainrot Interviewer. It's a live, multimodal AI that roasts my code in real-time."
2.  **The Mistake (0:15-0:45):**
    - Start the session.
    - Write obviously bad code (e.g., `O(n!)` recursive solution for Two Sum).
    - Speak: "So I think I'll just check every possible number..."
3.  **The Roast (0:45-1:15):** The AI interrupts you. "Bro, are you trying to heat your room with that CPU usage?" (Simulated example).
    - *Reaction:* Look visibly hurt/confused in the webcam feed.
4.  **The Fix (1:15-1:45):** "Okay, okay, I'll use a hash map."
    - Refactor code.
    - AI: "Finally. A hash map. Look at you using 1% of your brain."
5.  **Outro (1:45-2:00):** "Check it out on GitHub. Sub 500ms latency. Thanks."

**Tools:**
- Use **OBS Studio** to record your screen + system audio.
- Ensure "Desktop Audio" is capturing the browser output (AI voice).
- Ensure "Mic/Aux" is capturing your voice (for the video, even though the browser is also capturing it for the AI).
