import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

export async function ensureTables() {
  try {
    // Added patient_email to track report history per user
    await sql`
      CREATE TABLE IF NOT EXISTS triage_sessions (
        id UUID PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        status TEXT DEFAULT 'COLLECTING_INFO',
        patient_email TEXT,    -- NEW: Associates report with a user account
        urgency_score TEXT,
        category TEXT,
        summary TEXT,
        patient_name TEXT,
        patient_age TEXT,
        patient_sex TEXT,
        healthcard TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS triage_transcripts (
        id UUID PRIMARY KEY,
        session_id UUID REFERENCES triage_sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✅ Database tables verified/created.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  }
}

export default sql;