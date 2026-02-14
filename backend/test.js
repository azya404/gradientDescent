// Quick test script — run with: node test.js (while server is running)

async function testHealth() {
    console.log("=== Testing /api/health ===");
    const res = await fetch("http://localhost:3001/api/health");
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
}

async function testRoast() {
    console.log("\n=== Testing /api/roast ===");
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
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
}

(async () => {
    await testHealth();
    await testRoast();
})();
