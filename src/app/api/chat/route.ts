import { NextResponse } from 'next/server';
import sql, { ensureTables } from '@/lib/db';
import { getAiResponse } from '@/lib/ai';
import { v4 as uuidv4 } from 'uuid';

const RED_FLAGS = ["dying", "chest pain", "cannot breathe", "severe bleeding", "10/10", "bleeding a lot"];

export async function POST(req: Request) {
  await ensureTables();
  try {
    const { sessionId, message, hospitalId, patientEmail, profile } = await req.json();
    let id = sessionId;

    if (!id) {
      id = uuidv4();
      await sql`
        INSERT INTO triage_sessions (id, hospital_id, patient_email, status) 
        VALUES (${id}, ${hospitalId}, ${patientEmail || null}, 'COLLECTING_INFO')
      `;
    }

    await sql`INSERT INTO triage_transcripts (id, session_id, role, content) VALUES (${uuidv4()}, ${id}, 'user', ${message})`;
    
    // Check for emergencies IMMEDIATELY
    const isEmergency = RED_FLAGS.some(flag => message.toLowerCase().includes(flag));
    
    const history = await sql`SELECT role, content FROM triage_transcripts WHERE session_id = ${id} ORDER BY created_at ASC`;
    const reply = await getAiResponse(history, profile);
    
    await sql`INSERT INTO triage_transcripts (id, session_id, role, content) VALUES (${uuidv4()}, ${id}, 'assistant', ${reply})`;

    return NextResponse.json({ 
      reply: isEmergency ? "I am alerting the trauma team now. Please click 'Submit Intake' below immediately." : reply, 
      sessionId: id, 
      isEmergency 
    });
  } catch (error: any) {
    console.error("❌ Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}