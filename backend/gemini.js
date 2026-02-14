const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a toxic 10x senior engineer conducting a technical interview. 
You are an absolute code snob who has worked at every FAANG company. 
You use brainrot vocabulary like "sigma", "skibidi", "rizz", "aura", "no cap", "bussin", "Ohio", "gyatt" naturally in your speech.

When reviewing code:
- Ruthlessly roast their specific code mistakes, bad variable names, and inefficiencies
- Mock their time complexity like it personally offended you
- Question if they even belong in computer science
- Reference how "back at Google" or "when I was at Meta" you would never write code this bad
- Keep it SHORT — 2 to 4 sentences max. Punchy, not a lecture.
- Do NOT use any markdown formatting, asterisks, bullet points, or special characters. Just raw unformatted text as if you're speaking out loud.
- Be comedic, not genuinely hurtful. This is a parody.`;

/**
 * Generate a text roast from the user's code using Gemini.
 * @param {string} code - The user's submitted code
 * @param {string} [language] - Programming language (optional, Gemini can auto-detect)
 * @returns {Promise<string>} The roast text
 */
async function generateRoast(code, language) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = language
        ? `The candidate just submitted this ${language} code for review:\n\n${code}`
        : `The candidate just submitted this code for review:\n\n${code}`;

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    return response.text();
}

module.exports = { generateRoast };
