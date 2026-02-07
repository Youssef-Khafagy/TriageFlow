import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const { sessionId, urgency, notes, status } = await req.json();

    // Use the status provided (READY or COMPLETED), defaulting to READY if not specified
    const finalStatus = status || 'READY';

    await sql`
      UPDATE triage_sessions 
      SET status = ${finalStatus}, 
          urgency_score = ${urgency}, 
          summary = ${notes}
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}