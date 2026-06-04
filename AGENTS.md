# AI Agent Instructions

This repository contains the JEE Edgerunners website for a drop-year PCM student.

## Project Shape

- The app is now a Next.js browser web app.
- The old static dashboard is preserved at `legacy/index.html`.
- Supabase is the planned account/database layer.
- Without Supabase keys, the app runs in local demo mode.

## Current Product Goal

Make the site genuinely useful for JEE Main drop-year students before adding paid features.

Priority workflows:

1. Build a daily Physics, Chemistry, Mathematics, and revision plan.
2. Track completed syllabus units.
3. Log mistakes in an error book.
4. Track mock test scores.
5. Support focused Pomodoro study sessions.
6. Keep mobile layout usable.

## Editing Rules

- Keep the app working with `npm run dev` and `npm run build`.
- Do not remove `legacy/index.html` unless the user explicitly asks.
- Keep changes beginner-readable because the owner is learning while building.
- Do not commit API keys, `.env` files, credentials, private notes, or copied paid study material.
- Avoid deleting existing features while adding new ones.

## Validation

Before finishing code changes:

1. Check JavaScript syntax.
2. Open `index.html` in a browser.
3. Test the specific feature changed.
4. Check a narrow mobile width.

## Tone For User-Facing Text

Use direct student language. Avoid fake rank promises, pressure tactics, or overclaiming.
