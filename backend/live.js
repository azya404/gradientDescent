const { GoogleGenAI, Modality } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { apiVersion: "v1alpha" },
});

// --- Config ---
const LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-12-2025";
const VOICE_NAME = "Orus";

const SYSTEM_PROMPT = `You are a toxic 10x senior engineer conducting a live technical interview. 
You are an absolute code snob who has worked at every FAANG company. 
You use brainrot vocabulary like "sigma", "skibidi", "rizz", "aura", "no cap", "bussin", "Ohio", "gyatt" naturally in your speech.

When the candidate writes code or explains their solution:
- Ruthlessly roast their specific code mistakes, bad variable names, and inefficiencies
- Mock their time complexity like it personally offended you
- Question if they even belong in computer science
- Reference how "back at Google" or "when I was at Meta" you would never write code this bad
- Keep it SHORT — 2 to 4 sentences max. Punchy, not a lecture.
- Be comedic, not genuinely hurtful. This is a parody.
- If the candidate explains their code verbally, also mock their tone of voice and explanation style.`;

/**
 * Create a new Gemini Live API session with audio in/out.
 *
 * @param {object} callbacks
 * @param {function(string)} callbacks.onAudioChunk  - base64-encoded PCM audio chunk from Gemini
 * @param {function(string)} callbacks.onTranscript  - text transcript of the model's audio response
 * @param {function(string)} callbacks.onInputTranscript - text transcript of the user's audio input
 * @param {function()}       callbacks.onInterrupted - model was interrupted by user speech
 * @param {function(Error)}  callbacks.onError       - error occurred
 * @param {function()}       callbacks.onClose       - session closed
 * @returns {Promise<object>} The live session object
 */
async function createLiveSession(callbacks) {
    const config = {
        responseModalities: [Modality.AUDIO],
        systemInstruction: SYSTEM_PROMPT,
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: VOICE_NAME },
            },
        },
        enableAffectiveDialog: true,
        // Enable transcriptions so the frontend can display text
        outputAudioTranscription: {},
        inputAudioTranscription: {},
    };

    const session = await ai.live.connect({
        model: LIVE_MODEL,
        config,
        callbacks: {
            onopen: () => {
                console.log("[Live] Connected to Gemini Live API");
            },
            onmessage: (message) => {
                // --- Audio response chunks ---
                if (
                    message.serverContent?.modelTurn?.parts
                ) {
                    for (const part of message.serverContent.modelTurn.parts) {
                        if (part.inlineData?.data) {
                            callbacks.onAudioChunk(part.inlineData.data);
                        }
                    }
                }

                // --- Output audio transcript ---
                if (message.serverContent?.outputTranscription?.text) {
                    callbacks.onTranscript(message.serverContent.outputTranscription.text);
                }

                // --- Input audio transcript ---
                if (message.serverContent?.inputTranscription?.text) {
                    callbacks.onInputTranscript?.(message.serverContent.inputTranscription.text);
                }

                // --- Interruption ---
                if (message.serverContent?.interrupted) {
                    callbacks.onInterrupted?.();
                }
            },
            onerror: (err) => {
                console.error("[Live] Error:", err.message || err);
                callbacks.onError?.(err);
            },
            onclose: (event) => {
                console.log("[Live] Session closed:", event?.reason || "normal");
                callbacks.onClose?.();
            },
        },
    });

    return session;
}

/**
 * Send a chunk of mic audio to the live session.
 * @param {object} session - The live session from createLiveSession
 * @param {string} base64Pcm - Base64-encoded 16-bit PCM audio at 16kHz mono
 */
function sendAudio(session, base64Pcm) {
    session.sendRealtimeInput({
        audio: {
            data: base64Pcm,
            mimeType: "audio/pcm;rate=16000",
        },
    });
}

/**
 * Send code content to the live session as a text turn.
 * @param {object} session - The live session from createLiveSession
 * @param {string} code - The user's code
 * @param {string} [language] - Programming language
 */
function sendCode(session, code, language) {
    const text = language
        ? `[The candidate just updated their ${language} code]:\n\n${code}`
        : `[The candidate just updated their code]:\n\n${code}`;

    session.sendClientContent({
        turns: [
            {
                role: "user",
                parts: [{ text }],
            },
        ],
        turnComplete: true,
    });
}

module.exports = { createLiveSession, sendAudio, sendCode };
