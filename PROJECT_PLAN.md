# Project Plan

## North Star

Build a useful JEE drop-year dashboard for PCM students who need clarity every day.

The site should help students:

- choose today's study work,
- track chapter progress,
- revise at the right time,
- find weak topics after mocks,
- stay consistent without feeling lost.

## Current Stage

The project is a single-page website in `index.html`.

It already has:

- a polished visual design,
- syllabus cards,
- subject filters,
- search,
- checkbox progress tracking saved in the browser,
- a simple study strategy section.

## Next 5 Features

Build in this order:

1. Daily PCM planner
   - Student enters available hours.
   - Site suggests Physics, Chemistry, and Math blocks for the day.

2. Chapter confidence tracker
   - Each chapter gets Not Started, Learning, Practicing, Revising, Strong.

3. Revision calendar
   - When a chapter is marked complete, the site schedules revision after 1 day, 7 days, and 21 days.

4. Mock test tracker
   - Student enters marks, accuracy, mistakes, and weak chapters.

5. Weak-topic repair list
   - Site turns mistakes into a short repair queue.

## What Not To Build Yet

Avoid these until the basic tool is useful:

- paid subscriptions,
- user accounts,
- complicated AI chat,
- mobile app,
- huge question bank,
- copied coaching material.

## Gemini Pro Role

Use Gemini for content and thinking:

- summarize NCERT or public syllabus topics,
- draft formula explanations,
- compare study resources,
- create sample study routines,
- brainstorm feature names,
- review whether explanations are student-friendly.

Do not let Gemini become the place where the project files live. Keep the actual website work in this folder with Codex.

## Codex Role

Use Codex for project building:

- edit the website,
- explain changed code simply,
- test features,
- organize files,
- prepare deployment,
- track what changed.

## Best First Prompt To Send Codex

"Add a daily PCM planner to this JEE dashboard. I am a drop-year student. Let me enter how many hours I have today, then show a balanced Physics, Chemistry, and Math plan with one revision block."

## Learning Rule

After each feature, ask:

"Explain what changed in simple words and tell me the 3 coding ideas I should understand from this."
