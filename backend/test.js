// Quick test script — run with: node test.js (while server is running)
const fs = require("fs");
const path = require("path");

async function testHealth() {
  console.log("=== Testing /api/health ===");
  const res = await fetch("http://localhost:3001/api/health");
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", data);
}

async function testRoastWithAudio() {
  console.log("\n=== Testing /api/roast (with audio) ===");

  // Check for common audio formats
  const extensions = [
    { ext: ".mp3", type: "audio/mpeg" },
    { ext: ".wav", type: "audio/wav" },
    { ext: ".webm", type: "audio/webm" }
  ];

  let audioPath = null;
  let mimeType = null;

  for (const { ext, type } of extensions) {
    const p = path.join(__dirname, `test-audio${ext}`);
    if (fs.existsSync(p)) {
      audioPath = p;
      mimeType = type;
      console.log(`✅ Found audio file: test-audio${ext}`);
      break;
    }
  }

  if (!audioPath) {
    console.log("⚠️  No test-audio.{mp3,wav,webm} found — skipping audio test.");
    return;
  }

  const audioBlob = new Blob([fs.readFileSync(audioPath)], { type: mimeType });

  const formData = new FormData();
  formData.append("language", "python");
  formData.append("code", `def fibonacci(n):
  if n <= 1:
    return n
  return fibonacci(n-1) + fibonacci(n-2)`);
  formData.append("audio", audioBlob, "explanation" + path.extname(audioPath));

  console.time("⏱️  Roast Latency");
  const res = await fetch("http://localhost:3001/api/roast", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  console.timeEnd("⏱️  Roast Latency");

  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data, null, 2));
}

(async () => {
  // await testHealth(); // Optional, skipping to focus on latency
  await testRoastWithAudio();
})();
