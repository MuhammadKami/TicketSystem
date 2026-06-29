# TriageAI — AI Support Ticket Triage System

A premium support-desk that **automatically sorts, auto-replies to, and escalates** support
tickets using AI — wrapped in a glassmorphism, dark-mode dashboard with micro-animations.

The focus is **auto-resolution + escalation logic**: every ticket is analysed for category,
priority, sentiment and a *resolution-confidence* score, then either resolved with an AI reply or
routed to a human based on configurable rules.

> Runs **instantly with zero config** (in-memory store + transparent heuristic engine). Add a
> Gemini key for real LLM triage and Supabase keys for a persistent database.

## ✨ Features

- **AI auto-resolution** — Gemini classifies tickets and drafts warm, ready-to-send replies.
- **Smart escalation** — low confidence, frustrated sentiment, or urgent priority → human agent.
- **Tunable rules** — confidence threshold, auto-resolvable categories, escalation triggers, SLA.
- **Sentiment & priority scoring** on every ticket.
- **Kanban pipeline** — New → Auto-Resolved → Escalated → Resolved, plus a list view.
- **Graceful fallbacks** — no API keys? It still works end-to-end for demos.

## 🧱 Tech Stack

| Layer      | Tech                                   |
| ---------- | -------------------------------------- |
| Framework  | Next.js 14 (App Router, JSX)           |
| Styling    | Tailwind CSS (dark, glassmorphism)     |
| Backend    | Next.js API Routes                     |
| Database   | Supabase (PostgreSQL) — optional       |
| AI / LLM   | Google Gemini (`gemini-1.5-flash`)     |
| Deploy     | Vercel                                 |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Open the dashboard**.
The app is pre-seeded with sample tickets so you can explore immediately.

### Enable real AI + database (optional)

1. Copy the env template:

```bash
cp .env.local.example .env.local
```

2. Fill in your keys:
   - `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
     from your Supabase project settings.
3. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor.
4. Restart `npm run dev`. The sidebar shows the active engine + store.

## 📁 Project Structure

```text
src/
├── app/
│   ├── (auth)/login/        # Stubbed login page
│   ├── dashboard/           # Overview, Tickets (Kanban), AI Rules
│   ├── api/                 # tickets CRUD, triage, rules, status
│   ├── layout.jsx           # Root layout + fonts
│   └── page.jsx             # Landing page
├── components/
│   ├── ui/                  # Button, GlassCard, Badge, Modal, Field
│   ├── layout/              # Sidebar
│   └── tickets/             # TicketCard, TicketDetail, NewTicketModal, Provider
├── lib/
│   ├── ai.js                # Gemini integration
│   ├── triage.js            # Triage engine + escalation rules
│   ├── data.js              # Supabase ↔ in-memory data layer
│   ├── store.js             # In-memory fallback + seed data
│   └── supabase.js          # Supabase clients
└── styles/                  # globals.css (Tailwind directives + design tokens)
```

The design system (colors, gradients, radii, shadows, keyframes) lives in
[`tailwind.config.js`](tailwind.config.js); a few composite utilities (`.glass`, `.input-base`,
range slider, scrollbar) live in `src/styles/globals.css`.

## 🧠 How triage works

1. `POST /api/tickets` persists the ticket, then runs `triageTicket()`.
2. `triageTicket` calls Gemini (`lib/ai.js`); if unavailable it uses the heuristic engine.
3. The configurable rules (`/dashboard/settings`) decide **auto-resolve** vs **escalate**.
4. Auto-resolved tickets receive an AI reply; escalated tickets store a human-readable reason.

## ☁️ Deploy to Vercel

The app is configured for zero-config Vercel deployment ([`vercel.json`](vercel.json)).

### Option A — Git import (recommended)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and **import** the repository.
3. Vercel auto-detects Next.js — no build settings to change.
4. (Optional) Under **Environment Variables**, add any of:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

   Leave them blank to deploy the instant in-memory + heuristic demo.
5. Click **Deploy**. Done — you get a live `*.vercel.app` URL.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel            # preview deploy
vercel --prod     # production deploy
```

Add env vars with `vercel env add GEMINI_API_KEY` (repeat per variable), or in the dashboard.

> Note: the in-memory store resets on each serverless cold start. For persistent tickets in
> production, configure Supabase and run [`supabase/schema.sql`](supabase/schema.sql).
