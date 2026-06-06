# Project Plan

## North Star

Build a useful JEE Main drop-year dashboard for PCM students who need one clear study plan every day.

The app should help students:

- choose today's work from real weak areas,
- complete syllabus topics with confidence tracking,
- revise topics on a 1-day, 7-day, and 21-day rhythm,
- convert mock-test weakness into repair work,
- close repeated mistakes instead of only logging them.

## Current Stage

The project is now a Next.js + Supabase browser web app, not a single `index.html` page.

Current working areas:

- daily planner,
- syllabus tracker,
- revision queue,
- error book,
- mock test analytics,
- scratchpad,
- account/profile flow prepared for Supabase.

The preserved old static file lives in `legacy/index.html`.

## Current Priorities

1. Keep the planner useful.
   - Use unresolved mistakes, weak mock subjects, low accuracy, and incomplete high-priority syllabus topics.
   - Keep one revision block every day.

2. Keep revision visible.
   - Completing a topic creates 1-day, 7-day, and 21-day revision items.
   - The dashboard revision queue should replace static upcoming events.

3. Improve repair loops.
   - Error book entries should include mistake type, weak chapter, repeat count, repair task, and resolved state.
   - Mock tests should include subject scores, accuracy, and weak chapter fields.

4. Expand syllabus gradually.
   - Use public syllabus chapter names only.
   - Do not copy paid coaching material or proprietary questions.

5. Build trust before monetization.
   - Keep the core free until it genuinely helps students.
   - Future paid angles can include advanced mock analytics, revision calendars, downloadable sheets, personal planner templates, and trusted affiliate resources.
   - Avoid rank-promise language.

## Gemini Pro Role

Use Gemini for content and study thinking:

- summarizing public syllabus topics,
- drafting formula explanations,
- comparing resources,
- brainstorming study routines,
- checking if explanations are student-friendly.

Do not use Gemini as the source of truth for project files. The repository stays on GitHub.

## Codex Role

Use Codex for project building:

- edit files,
- test the website,
- debug broken behavior,
- organize the app,
- prepare deployment,
- explain changed code in beginner-friendly language.
