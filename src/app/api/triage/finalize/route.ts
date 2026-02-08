import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { client } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { sessionId, profile, isEmergency } = await req.json();

    const history = await sql`SELECT role, content FROM triage_transcripts WHERE session_id = ${sessionId} ORDER BY created_at ASC`;

    // THE SBAR ARCHITECT PROMPT
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: 'system', 
          content: `You are an Elite Medical Scribe. Transform raw intake data into a professional SBAR report.
          Use formal clinical terminology. 
          Structure:
          # TRIAGEFLOW | CLINICAL SUMMARY
          ---
          **[S] SITUATION**: Primary complaint and acute symptoms.
          ---
          **[B] BACKGROUND**: Relevant medical history from profile or transcript.
          ---
          **[A] ASSESSMENT**: Clinical impression of severity.
          ---
          **[R] RECOMMENDATION**: Suggested action and Triage Urgency (Low, Medium, High, or Emergent).
          
          Output valid JSON with the key "summary" containing this Markdown text.` 
        },
        ...history.map(m => ({ role: m.role, content: m.content }))
      ],
      response_format: { type: "json_object" }
    });

    const ai = JSON.parse(response.choices[0].message.content || '{}');

    await sql`
      UPDATE triage_sessions 
      SET status = 'SUBMITTED',
          urgency_score = ${isEmergency ? '1' : (ai.urgency || '3')},
          summary = ${ai.summary}, -- This now holds the formatted SBAR
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}