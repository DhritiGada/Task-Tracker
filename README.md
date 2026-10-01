# Smart Priority Planner

A modern task-management dashboard that helps users decide what to work on next by scoring tasks using urgency, impact, effort, due dates, and overdue risk.

## Live Demo

[Open the Smart Priority Planner](https://task-tracker-liart-pi.vercel.app/)

## Overview

The original project was a basic React task tracker backed by a local JSON Server. It has been redesigned into a portfolio-ready productivity product focused on prioritization and decision support.

Instead of only storing tasks, the planner evaluates each open item and surfaces the work that deserves attention first.

## Features

- Dynamic priority scoring
- Recommended next task
- Today, Upcoming, Backlog, Completed, and All views
- Overdue and at-risk indicators
- Impact and effort scoring
- Due-date awareness
- Categories and filtering
- Search across tasks
- Task completion tracking
- Completion-rate metrics
- Local browser persistence
- Responsive dashboard UI
- Clean Vite-based production build

## Prioritization Logic

Each task receives a priority score based on:

- **Impact**: how important the task is
- **Urgency**: how close the due date is
- **Effort**: how much work the task requires
- **Overdue risk**: an additional boost for tasks already past due

The resulting score is translated into a priority level:

- Critical
- High
- Medium
- Low

Open tasks are sorted by score so the highest-value work stays visible.

## Task Health

The planner also labels tasks based on deadline risk:

- **On track**
- **At risk**
- **Overdue**
- **Completed**

This makes it easier to separate important work from work that is simply recent.

## Tech Stack

- React
- Vite
- React Icons
- CSS
- Local Storage
- Vercel

## Run Locally

```bash
git clone https://github.com/DhritiGada/Task-Tracker.git
cd Task-Tracker
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Production Build

```bash
npm run build
```

The production output is generated in:

```text
dist/
```

## Deployment

The project is deployed on Vercel.

[View the live application](https://task-tracker-liart-pi.vercel.app/)

## Repository Evolution

This project was modernized from an older Create React App + JSON Server implementation into a standalone Vite application with local persistence and production-ready deployment.

The redesign focused on turning a simple CRUD task tracker into a decision-support product with prioritization, risk visibility, and clearer workflow organization.
