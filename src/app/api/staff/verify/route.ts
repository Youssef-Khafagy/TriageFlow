import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const {
      sessionId,
      status,
      roomNumber,
      urgency,
      notes
    } = await req.json();

    // 🛡️ Preserve old behavior:
    // - Default status to READY if not provided
    const finalStatus = status || 'READY';

    await sql`
      UPDATE triage_sessions
      SET
        status = ${finalStatus},
        room_number = ${roomNumber ?? null},
        urgency_score = ${urgency},
        summary = ${notes}
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
