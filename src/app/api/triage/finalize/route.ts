import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { client } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { sessionId, profile, isEmergency } = await req.json();

    const history = await sql`
      SELECT role, content FROM triage_transcripts 
      WHERE session_id = ${sessionId} 
      ORDER BY created_at ASC
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: 'system', content: "Analyze transcript and output JSON clinical summary." },
        ...history.map(m => ({ role: m.role, content: m.content }))
      ],
      response_format: { type: "json_object" }
    });

    const ai = JSON.parse(response.choices[0].message.content || '{}');

    // FORCE MAPPING: Prioritize frontend profile data to ensure staff sees it
    await sql`
      UPDATE triage_sessions 
      SET status = 'SUBMITTED',
          urgency_score = ${isEmergency ? '1' : (ai.urgency || '3')},
          category = ${ai.category || 'Other'},
          summary = ${ai.summary || 'Emergency intake initiated.'},
          patient_name = ${profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (ai.patient_name || 'Unknown')},
          patient_age = ${profile?.age || ai.patient_age || 'Unknown'},
          patient_sex = ${profile?.sex || ai.patient_sex || 'Unknown'},
          healthcard = ${profile?.healthCard || ai.healthcard || 'N/A'},
          phone = ${profile?.phone || null},
          address = ${profile?.address || null},
          allergies = ${profile?.allergies || 'None'},
          disabilities = ${profile?.disabilities || 'None'}
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Finalize Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}