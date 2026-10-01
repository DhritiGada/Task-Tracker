# Smart Priority Planner

A modern task-planning dashboard that helps users decide what to work on next by combining urgency, impact, effort, due dates, and overdue risk into a dynamic priority score.

## Live Demo

[Open the Smart Priority Planner](https://task-tracker-liart-pi.vercel.app/)

## What it does

Smart Priority Planner turns a basic task list into a decision-support tool. Instead of treating every task equally, it continuously ranks open work and surfaces the task that deserves attention first.

Users can add tasks, assign due dates, estimate effort and impact, organize work by category, track completion, and move between Today, Upcoming, Backlog, Completed, and All views.

## Key Features

- Dynamic priority scoring based on impact, urgency, effort, and overdue risk
- Recommended next task that updates as priorities change
- Today, Upcoming, Backlog, Completed, and All task views
- Overdue and at-risk task indicators
- Impact and effort scoring from 1 to 5
- Search and category filtering
- Completion-rate and workload metrics
- Local browser persistence
- Responsive dashboard experience
- No backend or account required for the live demo

## Priority Model

Each open task receives a calculated priority score. The planner increases the score when a task has:

- higher impact
- a closer deadline
- an overdue deadline
- lower relative effort

Tasks with higher scores rise to the top of the list and influence the Recommended Next section.

The goal is to make prioritization transparent and useful without forcing users to manually rank every task.

## Product Flow

1. Add a task with a title, category, due date, impact, and effort.
2. The planner calculates its priority score automatically.
3. Open tasks are ranked by score.
4. The highest-priority open task appears in Recommended Next.
5. Status indicators highlight work that is overdue, at risk, or on track.
6. Completing or editing the workload changes the recommendation dynamically.

## Tech Stack

- React 18
- Vite
- React Icons
- JavaScript
- CSS
- Local Storage
- Vercel

## Architecture

The application is fully client-side for a lightweight portfolio demo.

```text
User input
   ↓
Task state
   ↓
Priority scoring logic
   ↓
Filtering + ranking
   ↓
Dashboard / Recommended Next
   ↓
Local Storage persistence
```

No external database is required. Tasks remain available in the same browser through Local Storage.

## Run Locally

```bash
git clone https://github.com/DhritiGada/Task-Tracker.git
cd Task-Tracker
npm install
npm run dev
```

Open the local URL provided by Vite.

## Production Build

```bash
npm run build
```

The production output is generated in the `dist` directory.

## Deployment

The project is deployed on Vercel.

[Launch the live application](https://task-tracker-liart-pi.vercel.app/)

## Project Evolution

This repository originally started as a basic React task tracker backed by JSON Server. It has since been redesigned into a standalone Smart Priority Planner with a modern Vite build, client-side persistence, prioritization logic, analytics, and a production-ready dashboard UI.
