import OpenAI from 'openai';

export const client = new OpenAI({ 
  apiKey: process.env.AI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1" 
});

export const NURSE_PROMPT = `
You are a professional ER Triage Nurse. Your goal is to assess severity and collect data.
PROTOCOL:
1. Greet and ask for: Full Name, Age, Sex, and Healthcard Number.
2. Ask for the primary reason for the visit.
3. Ask about duration and a pain scale (1-10).
4. Check for Red Flags (Chest pain, breathing issues).
5. Once all info is collected, say: "Thank you. I have all the details. Please click 'Submit Intake' below to alert the medical team."
Ask ONLY ONE question at a time.
`;

export const SUMMARIZER_PROMPT = `Analyze the transcript and output JSON ONLY: 
{ 
  "urgency": "1-5", 
  "category": "Respiratory|Cardiac|Injury|Other", 
  "summary": "Clinical summary",
  "patient_name": "string",
  "patient_age": "string",
  "patient_sex": "string",
  "healthcard": "string"
}`;

export async function getAiResponse(history: any[]) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: 'system', content: NURSE_PROMPT }, ...history],
    temperature: 0.3, // Lower for more structured intake
  });
  return response.choices[0].message.content;
}