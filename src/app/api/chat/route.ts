import { NextResponse } from 'next/server';
import sql, { ensureTables } from '@/lib/db'; // Import ensureTables
import { getAiResponse } from '@/lib/ai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  await ensureTables(); // Add this line
  
  try {
    const { sessionId, message, hospitalId } = await req.json();
    let id = sessionId;

    if (!id) {
      id = uuidv4();
      await sql`INSERT INTO triage_sessions (id, hospital_id) VALUES (${id}, ${hospitalId})`;
    }

    await sql`INSERT INTO triage_transcripts (id, session_id, role, content) VALUES (${uuidv4()}, ${id}, 'user', ${message})`;
    
    const history = await sql`SELECT role, content FROM triage_transcripts WHERE session_id = ${id} ORDER BY created_at ASC`;
    const reply = await getAiResponse(history);
    
    await sql`INSERT INTO triage_transcripts (id, session_id, role, content) VALUES (${uuidv4()}, ${id}, 'assistant', ${reply})`;

    return NextResponse.json({ reply, sessionId: id });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}