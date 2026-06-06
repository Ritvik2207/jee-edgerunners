# Copilot Instructions

This repository is a beginner-friendly Next.js web app for JEE Main PCM preparation.

- Main routes: `app/`
- Main dashboard UI: `components/study-app.tsx`
- Study data and planner logic: `lib/`
- Database schema: `supabase/schema.sql`
- Legacy static page: `legacy/index.html`

Use the Next.js app as the source of truth. Do not edit the legacy static file unless the user explicitly asks.

Prioritize:

- smart daily planning from mistakes, mocks, and syllabus gaps,
- revision scheduling,
- error-book repair loops,
- mock analytics,
- mobile usability,
- simple beginner-readable code.

Protect user privacy: do not commit API keys, secrets, `.env` files, or private study notes.

Validate changes with TypeScript/build checks and a desktop plus mobile preview when UI changes.
