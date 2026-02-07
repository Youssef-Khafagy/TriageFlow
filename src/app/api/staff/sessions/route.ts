import { NextResponse } from 'next/server';
import sql, { ensureTables } from '@/lib/db';

export async function GET() {
  await ensureTables(); // Add this line
  
  try {
    const sessions = await sql`
      SELECT * FROM triage_sessions 
      WHERE status != 'FINALIZED' 
      ORDER BY urgency_score ASC, created_at ASC
    `;
    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}