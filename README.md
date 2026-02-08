# 🏥 TriageFlow  
AI-assisted patient intake + staff-controlled triage + live waiting queue

TriageFlow collects patient intake before staff interaction and uses AI to convert it into a clean, structured summary that clinicians can review fast.

🛑 **AI never makes the final decision.** Every urgency level and triage outcome is confirmed by staff.

--- 

# Getting started (Website)

https://triage-flow-nine.vercel.app/


---

# ⚙️ Getting started (local)

## 1) Install dependencies
```bash
npm install
```

## 2) Start Postgres (Docker)
```bash
docker-compose up -d
```

## (Optional) Check the container is running
```bash
docker ps
```

## 3) Run the app
```bash
npm run dev
```
## Open: http://localhost:3000

---

## 🚀 Why TriageFlow

Triage desks lose time re-asking the same intake questions, especially during busy hours. TriageFlow speeds up the process by:
- capturing the story once
- turning it into a consistent format
- letting staff review, override, and finalize in seconds
- keeping patients informed with live queue status and wait estimates

---

## ✅ What it does

### 🧑‍🦱 Patient experience
- 🖥️ Open the site on any device
- 📝 Complete a short guided intake (designed for **under 2 minutes**)
- ⏳ Enter a single waiting queue
- 📍 See:
  - current status (Submitted -> In Review -> Finalized -> Ready)
  - estimated wait time
- ✅ Get marked **Ready** when staff is ready to see them

### 👩‍⚕️ Staff experience
- 📥 Live intake feed of incoming submissions
- 🚦 Automatically sorted by:
  1) urgency  
  2) arrival time  
- 🔎 Review:
  - full intake transcript
  - AI-generated structured JSON
  - suggested urgency and red flags
- ✍️ Staff can:
  - override urgency
  - add short notes
  - finalize triage
  - mark a patient as **Ready**
- 🔄 Queue updates immediately (Polling or SSE)

---

## 🧠 AI output (strict JSON, validated server-side)

Every intake produces a **validated structured JSON** response including:

- 🚨 `suggestedUrgency`: **Low | Medium | High | Emergent**
- 🤕 `symptoms`: extracted symptom list
- 🕒 `duration`: onset + duration (when available)
- 📈 `pain`: pain score or description (when relevant)
- 🧯 `redFlags`: key risk indicators
- 🩺 `staffSummary`: concise clinical summary
- 🙂 `patientSummary`: simple plain-language summary

✅ The AI output is treated as a suggestion and is always shown alongside staff controls.

---

## 🧾 Waiting queue + estimated wait time

TriageFlow uses **one queue** to keep the demo clear and easy to understand.

### Ordering rules
Patients are ordered by:
1. ✅ Final urgency (confirmed by staff)
2. 🕒 Arrival time

### Wait time estimate
Estimated wait is calculated as:
- **patients ahead × average service time**

Service time is based on a simple service category estimate (preset averages).  
When the queue changes, estimates update automatically.

---

## 🔁 Realtime updates

TriageFlow supports realtime via:
- ✅ polling (simple and reliable)
- ✅ SSE (fast, low overhead)

Either is acceptable for demo. The goal is that judges can see updates happen live.

---

## 🧱 Tech stack

- 🖼️ Frontend: **Next.js (App Router)** + **TypeScript** + **Tailwind CSS**
- 🧩 Backend: **Next.js API Routes**
- 🗄️ Database: **PostgreSQL**
- 🔁 Realtime: **Polling or Server-Sent Events (SSE)**
- 🤖 AI: LLM API with **strict JSON output** + validation
- 🚀 Deploy: **Vercel** + managed Postgres

---

## 📸 Screens to look at (judge-friendly)

- **Patient Intake**: guided intake form + confirmation
- **Patient Status**: queue position + estimated wait
- **Staff Dashboard**: live feed + review panel + actions

---

## 🛡️ Safety and scope

TriageFlow is an intake and workflow tool. It does not:
- diagnose
- recommend treatment
- replace clinical judgment

It supports clinicians by organizing information and making review faster.
