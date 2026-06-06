# Claude Project Notes

This is the same guidance as `AGENTS.md`, written for Claude or any GitHub-connected AI tool.

## What This Is

JEE Edgerunners is a Next.js JEE Main study dashboard:

- Main routes: `app/`
- Main UI: `components/study-app.tsx`
- Data/schema: `lib/`, `supabase/schema.sql`
- Legacy static file: `legacy/index.html`
- Supporting docs: `README.md`, `PROJECT_PLAN.md`
- Install with `npm install`.
- Run locally with `npm run dev`.

## How To Work On It

When making changes:

1. Read `README.md` and `AGENTS.md`.
2. Edit the Next.js app unless the user explicitly asks to change the legacy static file.
3. Keep code simple and explain changes in beginner-friendly language.
4. Commit changes to GitHub so the user does not need to copy and paste code.

## Safety Rules

- Never ask the user to paste the whole HTML file into chat.
- Never commit secret files or API keys.
- Do not use copyrighted question banks or paid course material directly.
- Do not remove existing dashboard features without a clear reason.

## Good Next Features

- Chapter detail panels with formulas, traps, and short repair drills.
- Stronger mock analytics across multiple tests.
- Exportable daily plan and revision queue.
- Supabase/Vercel setup so users can open the app from a public URL.
