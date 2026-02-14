const { ElevenLabsClient } = require("elevenlabs");

const client = new ElevenLabsClient(); // auto-reads ELEVENLABS_API_KEY from env

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";

/**
 * Convert roast text to speech audio using ElevenLabs.
 * @param {string} text - The roast text from Gemini
 * @returns {Promise<Buffer>} MP3 audio buffer
 */
async function textToSpeech(text) {
    const audioStream = await client.textToSpeech.convert(VOICE_ID, {
        text,
        model_id: "eleven_flash_v2_5", // low-latency model
        output_format: "mp3_44100_128",
    });

    // Collect the readable stream into a Buffer
    const chunks = [];
    for await (const chunk of audioStream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

module.exports = { textToSpeech };
