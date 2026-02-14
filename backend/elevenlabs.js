const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

/**
 * Convert roast text to speech audio using ElevenLabs REST API directly.
 * @param {string} text - The roast text from Gemini
 * @returns {Promise<Buffer>} MP3 audio buffer
 */
async function textToSpeech(text) {
    if (!ELEVENLABS_API_KEY) {
        throw new Error("ELEVENLABS_API_KEY is not set in .env");
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            model_id: "eleven_flash_v2_5",
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`ElevenLabs API error (${response.status}): ${errorBody}`);
    }

    // Convert response to Buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

module.exports = { textToSpeech };
