import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({ 
  // VERIFIED MODEL: Using the specific version identified by your curl command
  model: "gemini-2.5-flash", 
  systemInstruction: {
    role: "system",
    parts: [{ text: `
      You are the official TriageFlow Assistant. 
      ORIGIN: TriageFlow was built by 4 software engineering students during a 24-hour hackathon.
      MISSION: To solve the ER bottleneck by automating patient intake and clinical summaries.
      TEAM: Subhan (AI & Backend), Adib (Lead Full-Stack), and two other dedicated engineering students.
      TONE: Professional, energetic, and highly innovative.
    `}]
  },
});