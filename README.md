# iDO — Priority-Based Todo App

**Live Demo:** https://i-do-rouge.vercel.app

A focused, distraction-free task manager with priority levels and real-time stats. Built to help you stay on top of what matters most.

---

## About

iDO is a lightweight todo app that goes beyond a simple checklist. Each task can be assigned a priority level — High, Medium, or Low — so you always know what to tackle first. A live stats bar tracks your total, active, and completed tasks at a glance. All data is persisted locally in the browser, so your list is always there when you come back.

---

## Features

- **Add & manage tasks** — create tasks with a title and priority in seconds
- **Priority levels** — tag each task as High, Medium, or Low with color-coded badges
- **Complete tasks** — check off tasks with a satisfying toggle
- **Edit & delete** — update task text or priority, or remove entries entirely
- **Filter view** — switch between All, Active, and Completed tabs instantly
- **Live stats** — see total, remaining, and done counts update in real time
- **Clear completed** — bulk-remove all finished tasks with one click
- **Persistent storage** — tasks survive page refreshes via `localStorage`

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| uuidv4 | Unique ID generation per task |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Notes

- Data is stored in `localStorage` under the key `ido-todos-v2`
- No backend or authentication — fully client-side
- Clearing browser storage will erase all saved tasks
