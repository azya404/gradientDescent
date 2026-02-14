// CLI test for the Live WebSocket pipeline
// Usage: Start the server (node server.js), then run: node test-live.js
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const WS_URL = "ws://localhost:3001";

// Bad code to get roasted for
const BAD_CODE = `def sort(arr):
  for i in range(len(arr)):
    for j in range(len(arr)):
      if arr[i] < arr[j]:
        arr[i], arr[j] = arr[j], arr[i]
  return arr`;

async function testLive() {
    console.log("=== Live WebSocket Test ===\n");
    console.log(`Connecting to ${WS_URL}...`);

    const ws = new WebSocket(WS_URL);
    const audioChunks = [];
    let transcriptParts = [];

    ws.on("open", () => {
        console.log("✅ WebSocket connected\n");

        // Step 1: Start a live session
        console.log("→ Sending 'start' message...");
        ws.send(JSON.stringify({ type: "start", language: "python" }));
    });

    ws.on("message", (raw) => {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
            case "started":
                console.log("✅ Live session started\n");

                // Step 2: Send the bad code
                console.log("→ Sending code for review...");
                ws.send(JSON.stringify({
                    type: "code",
                    content: BAD_CODE,
                    language: "python",
                }));
                console.log("   (Waiting for Gemini to respond with audio...)\n");
                break;

            case "audio":
                // Collect audio chunks
                audioChunks.push(Buffer.from(msg.data, "base64"));
                process.stdout.write("🔊");
                break;

            case "transcript":
                transcriptParts.push(msg.text);
                break;

            case "input_transcript":
                console.log(`\n📝 Input transcript: ${msg.text}`);
                break;

            case "interrupted":
                console.log("\n⚡ Model was interrupted");
                break;

            case "error":
                console.error(`\n❌ Error: ${msg.message}`);
                break;

            case "stopped":
                console.log("\n\n✅ Session stopped");
                finishTest();
                break;
        }
    });

    ws.on("error", (err) => {
        console.error("WebSocket error:", err.message);
        process.exit(1);
    });

    ws.on("close", () => {
        console.log("WebSocket closed");
    });

    // After some time, stop the session and save results
    // Give Gemini up to 15 seconds to respond
    const timeout = setTimeout(() => {
        console.log("\n\n⏰ Timeout reached — stopping session...");
        ws.send(JSON.stringify({ type: "stop" }));
    }, 15000);

    function finishTest() {
        clearTimeout(timeout);

        // Save audio
        if (audioChunks.length > 0) {
            const fullAudio = Buffer.concat(audioChunks);
            const outputPath = path.join(__dirname, "output-live-roast.pcm");
            fs.writeFileSync(outputPath, fullAudio);
            console.log(`\n🎵 Audio saved: ${outputPath} (${fullAudio.length} bytes, raw PCM 24kHz 16-bit mono)`);
            console.log("   To play: ffplay -f s16le -ar 24000 -ac 1 output-live-roast.pcm");
        } else {
            console.log("\n⚠️  No audio chunks received");
        }

        // Print transcript
        if (transcriptParts.length > 0) {
            console.log(`\n📜 Transcript: ${transcriptParts.join("")}`);
        } else {
            console.log("\n⚠️  No transcript received");
        }

        ws.close();
        process.exit(0);
    }
}

testLive().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});
