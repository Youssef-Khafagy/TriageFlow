import OpenAI from 'openai';

export const client = new OpenAI({ 
  apiKey: process.env.AI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1" 
});

export const NURSE_PROMPT = `
You are a professional ER Triage Nurse at TriageFlow. Your goal is to collect clinical data for a physician review.

DYNAMIC PROTOCOL:
1. GREETING & HANDOFF:
   - If the patient has already provided a reason for their visit in the first message (e.g., "I broke my leg"), DO NOT greet them again or ask why they are there.
   - IMMEDIATELY move to follow-up questions: "I'm sorry to hear about your leg. How did this happen, and how long ago?"

2. RED FLAG INTERCEPT (CRITICAL):
   - If the patient mentions "dying," "chest pain," "cannot breathe," "severe bleeding," or "10/10 pain," IMMEDIATELY state: "I am alerting the trauma team now. Please click 'Submit Intake' below immediately." Do not ask further questions.

3. ASSESSMENT: Ask only ONE question at a time about symptoms, duration, and pain.
4. CLOSING: Once done, say: "Thank you. I have all the details. Please click the 'Submit Intake' button below to alert our medical team."
`;

export async function getAiResponse(history: any[], profile?: any) {
  const profileContext = profile && profile.firstName ?
    `\nPATIENT PROFILE PROVIDED: Name: ${profile.firstName} ${profile.lastName}, Age: ${profile.age}, Sex: ${profile.sex}, Healthcard: ${profile.healthCard}, Phone: ${profile.phone}, Address: ${profile.address}, Allergies: ${profile.allergies}, Disabilities: ${profile.disabilities}.` :
    "\nNO PROFILE DATA: You MUST ask for demographics first.";

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: 'system', content: NURSE_PROMPT + profileContext }, ...history],
    temperature: 0.3,
  });
  return response.choices[0].message.content;
}