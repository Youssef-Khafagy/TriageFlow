import { NextResponse } from 'next/server';
import sql, { ensureTables } from '@/lib/db';

// These lines force Vercel to check the database every time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  await ensureTables(); // Ensures your cloud database has the right tables
  
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