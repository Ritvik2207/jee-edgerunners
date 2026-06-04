# JEE Edgerunner

This project is a JEE Main study web app. It is being rebuilt from a single-file dashboard into a Next.js + Supabase browser app.

- `app/` - Next.js routes.
- `components/` - dashboard and app UI.
- `lib/` - study data, planner logic, storage, and Supabase client.
- `supabase/schema.sql` - database tables and row-level security.
- `legacy/index.html` - preserved old single-file dashboard.

## How to Open It

Install dependencies and run the local app:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Without Supabase keys, the app runs in local demo mode. To enable real accounts and cross-device saving:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Enable email/password and Google sign-in in Supabase Auth.

## GitHub Workflow

This folder is connected to GitHub:

`https://github.com/Ritvik2207/jee-edgerunners`

Use GitHub as the main saved copy of the project. After changes are made, commit and push them so Codex, Claude, Gemini, Copilot, or another coding tool can read the latest project from GitHub.

You should not need to copy and paste the full website code into chats. Give the AI tool the GitHub repository link and ask it to inspect the project.

Helpful files for AI tools:

- `AGENTS.md` - instructions for Codex and coding agents.
- `CLAUDE.md` - instructions for Claude.
- `.github/copilot-instructions.md` - instructions for GitHub Copilot.

## What You Are Building

The first useful version should help a drop-year PCM student answer three daily questions:

1. What should I study today?
2. What have I finished?
3. What should I revise next?

If the site solves those well for you, it can solve them for other students too.

## Vibe Coding Workflow

Use this loop:

1. Say the feature in normal student language.
2. Let Codex make the code change.
3. Open the page and test it like a real student.
4. Tell Codex what feels confusing, missing, or useful.
5. Repeat.

Good prompts:

- "Add a daily study planner for my drop year schedule."
- "Make a chapter detail view with formulas, common mistakes, and PYQs."
- "Add a revision calendar based on when I mark chapters complete."
- "Make this look better on mobile."
- "Explain the code you changed like I am new to coding."

## Best First Features

Build these before thinking too much about money:

1. Daily plan generator for PCM.
2. Chapter progress with difficulty and confidence.
3. Revision reminders.
4. Mock-test score tracker.
5. Weak-topic repair list.

## Money Path

Start free and useful. Later, possible paid upgrades:

- Premium study packs.
- Downloadable revision sheets.
- Mock-test analytics.
- Personal drop-year planner.
- Affiliate links for trusted books or courses.

Avoid copying copyrighted questions or promising ranks. Trust matters more than shortcuts.

## Where Gemini Pro Helps

Use Gemini for:

- Fast research summaries.
- Turning notes into clean explanations.
- Making study content drafts.
- Comparing learning resources.
- Getting a second opinion on ideas.

Use Codex for:

- Editing the project files.
- Testing the website.
- Debugging broken behavior.
- Turning ideas into working features.
- Explaining the code while we build.
