import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

export async function ensureTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS triage_sessions (
        id UUID PRIMARY KEY,
        hospital_id TEXT NOT NULL,
        status TEXT DEFAULT 'COLLECTING_INFO',
        patient_email TEXT,
        urgency_score TEXT,
        category TEXT,
        summary TEXT,
        patient_name TEXT,
        patient_age TEXT,
        patient_sex TEXT,
        healthcard TEXT,
        phone TEXT,        -- NEW Persistent Field
        address TEXT,      -- NEW Persistent Field
        allergies TEXT,    -- NEW Persistent Field
        disabilities TEXT, -- NEW Persistent Field
        room_number TEXT, -- NEW: Dynamic assignment
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