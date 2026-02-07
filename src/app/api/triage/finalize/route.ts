import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { client } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    // 1. Fetch transcript history
    const history = await sql`
      SELECT role, content FROM triage_transcripts 
      WHERE session_id = ${sessionId} 
      ORDER BY created_at ASC
    `;

    // 2. Instruct the AI to extract structured data from the conversation
    const prompt = `Analyze this medical transcript and output ONLY a JSON object:
    {
      "urgency": "1-5 (1 is highest)",
      "category": "Cardiac|Respiratory|Injury|Other",
      "summary": "Short clinical summary for a doctor",
      "patient_name": "extracted name",
      "patient_age": "extracted age",
      "patient_sex": "extracted sex",
      "healthcard": "extracted healthcard number"
    }`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: 'system', content: prompt },
        ...history.map(m => ({ role: m.role, content: m.content }))
      ],
      response_format: { type: "json_object" }
    });

    const aiResult = JSON.parse(response.choices[0].message.content || '{}');

    // 3. Update the session with the structured information
    await sql`
      UPDATE triage_sessions 
      SET status = 'SUBMITTED',
          urgency_score = ${aiResult.urgency},
          category = ${aiResult.category},
          summary = ${aiResult.summary},
          patient_name = ${aiResult.patient_name},
          patient_age = ${aiResult.patient_age},
          patient_sex = ${aiResult.patient_sex},
          healthcard = ${aiResult.healthcard}
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Finalize Error:", error);
    return NextResponse.json({ error: "Failed to finalize" }, { status: 500 });
  }
}