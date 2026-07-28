# iDO: Priority-Based Todo App

[![Live Demo](https://img.shields.io/badge/Live-iDO-d9534f?style=flat-square)](https://ido-it.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-6b7f3f?style=flat-square)](LICENSE)

**Live Demo:** https://ido-it.vercel.app/

A focused, distraction-free task manager with priorities, due dates, and real-time stats. Built to help you stay on top of what matters most.

`todo-app` `react` `vite` `tailwindcss` `productivity` `localstorage` `frontend`

---

## About

iDO is a lightweight todo app that goes beyond a simple checklist. Each task can be assigned a priority level (High, Medium, or Low) and an optional due date, so you always know what to tackle first. A live stats bar tracks your total, active, and completed tasks at a glance. All data is persisted locally in the browser, so your list is always there when you come back.

---

## Features

- **Add & manage tasks**: create tasks with a title, priority, and optional due date in seconds
- **Priority levels**: tag each task as High, Medium, or Low with color-coded stamps
- **Due dates**: set a due date per task, with overdue tasks flagged automatically
- **Search**: instantly filter the list by typing, on top of the All / Active / Done tabs
- **Drag-to-reorder**: reorder tasks by dragging them into place
- **Undo delete**: just-deleted tasks can be restored from a brief undo toast
- **Export / import**: back up your list to a `.json` file and restore it later
- **Keyboard shortcuts**: press `/` to jump to the input, `Esc` to cancel an edit
- **Complete tasks**: check off tasks with a satisfying toggle
- **Edit & delete**: update task text, priority, or due date, or remove entries entirely
- **Filter view**: switch between All, Active, and Completed tabs instantly
- **Live stats**: see total, remaining, and done counts update in real time
- **Clear completed**: bulk-remove all finished tasks with one click
- **Persistent storage**: tasks survive page refreshes via `localStorage`

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| uuid | Unique ID generation per task |

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
- No backend or authentication: fully client-side
- Clearing browser storage will erase all saved tasks (use Export to back up first)

## License

[MIT](LICENSE)
