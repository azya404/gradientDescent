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

async function testRoastTextOnly() {
  console.log("\n=== Testing /api/roast (text only, no audio input) ===");
  const formData = new FormData();
  formData.append("language", "python");
  formData.append("code", `def sort(arr):
  for i in range(len(arr)):
    for j in range(len(arr)):
      if arr[i] < arr[j]:
        arr[i], arr[j] = arr[j], arr[i]
  return arr`);

  const res = await fetch("http://localhost:3001/api/roast", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    console.log("❌ Error:", err);
    return;
  }

  // Response is now audio/mpeg
  const roastText = decodeURIComponent(res.headers.get("X-Roast-Text") || "");
  console.log("Roast text:", roastText);

  const arrayBuffer = await res.arrayBuffer();
  const outputPath = path.join(__dirname, "output-roast-text-only.mp3");
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
  console.log(`✅ Audio saved to ${outputPath} (${arrayBuffer.byteLength} bytes)`);
  console.log("   Open the MP3 file to hear the roast!");
}

async function testRoastWithAudio() {
  console.log("\n=== Testing /api/roast (with audio input) ===");

  // Check for common audio formats
  const extensions = [
    { ext: ".mp3", type: "audio/mpeg" },
    { ext: ".wav", type: "audio/wav" },
    { ext: ".webm", type: "audio/webm" },
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

  const res = await fetch("http://localhost:3001/api/roast", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    console.log("❌ Error:", err);
    return;
  }

  const roastText = decodeURIComponent(res.headers.get("X-Roast-Text") || "");
  console.log("Roast text:", roastText);

  const arrayBuffer = await res.arrayBuffer();
  const outputPath = path.join(__dirname, "output-roast-with-audio.mp3");
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
  console.log(`✅ Audio saved to ${outputPath} (${arrayBuffer.byteLength} bytes)`);
  console.log("   Open the MP3 file to hear the roast!");
}

(async () => {
  await testHealth();
  await testRoastTextOnly();
  await testRoastWithAudio();
})();
