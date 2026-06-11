import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Navbar from './components/Navbar'

// Priority config — full class strings so Tailwind JIT picks them up
const PRIORITY = {
  high: {
    label: 'High',
    badge: 'bg-red-100 text-red-600 border-red-200',
    bar:   'border-l-red-500',
    dot:   'bg-red-500',
  },
  medium: {
    label: 'Medium',
    badge: 'bg-orange-100 text-orange-600 border-orange-200',
    bar:   'border-l-orange-500',
    dot:   'bg-orange-500',
  },
  low: {
    label: 'Low',
    badge: 'bg-green-100 text-green-600 border-green-200',
    bar:   'border-l-green-500',
    dot:   'bg-green-500',
  },
}

const LS_KEY = 'ido-todos-v2'

// ── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ value, label, textColor }) {
  return (
    <div className="bg-white rounded-xl border border-orange-100 p-4 text-center shadow-sm">
      <div className={`text-3xl font-black ${textColor}`}>{value}</div>
      <div className="text-xs text-slate-400 font-medium mt-1">{label}</div>
    </div>
  )
}

function TodoItem({ todo, onToggle, onEdit, onDelete, isEditing }) {
  const p = PRIORITY[todo.priority || 'medium']

  return (
    <div
      className={`todo-enter bg-white rounded-xl border border-orange-100 border-l-4 ${p.bar} px-4 py-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 group ${
        isEditing ? 'ring-2 ring-orange-400 ring-offset-1' : ''
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          todo.isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 hover:border-orange-400'
        }`}
      >
        {todo.isCompleted && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span className={`flex-1 text-sm font-medium leading-snug ${
        todo.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'
      }`}>
        {todo.todo}
      </span>

      {/* Priority badge */}
      <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.badge}`}>
        {p.label}
      </span>

      {/* Action buttons — visible on hover */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onEdit(todo.id)}
          title="Edit"
          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          title="Delete"
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const EmptyIcons = {
  all: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="13" y2="15"/>
    </svg>
  ),
  active: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  completed: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
}

function EmptyState({ filter }) {
  const map = {
    all:       { title: 'No tasks yet!',    sub: 'Add your first task above to get started.' },
    active:    { title: 'All caught up!',   sub: "No active tasks — you're crushing it!" },
    completed: { title: 'Nothing done yet', sub: 'Complete some tasks to see them here.' },
  }
  const m = map[filter]
  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-4">{EmptyIcons[filter]}</div>
      <p className="font-bold text-slate-700 text-lg mb-1">{m.title}</p>
      <p className="text-slate-400 text-sm">{m.sub}</p>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [todoText, setTodoText]   = useState('')
  const [todos, setTodos]         = useState([])
  const [editId, setEditId]       = useState(null)
  const [filter, setFilter]       = useState('all')      // all | active | completed
  const [priority, setPriority]   = useState('medium')

  // Load from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) setTodos(JSON.parse(stored))
  }, [])

  const persist = (updated) => {
    setTodos(updated)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
  }

  const handleAdd = () => {
    if (todoText.trim().length < 3) return

    if (editId) {
      persist(todos.map(t =>
        t.id === editId ? { ...t, todo: todoText.trim(), priority } : t
      ))
      setEditId(null)
    } else {
      persist([
        ...todos,
        { id: uuidv4(), todo: todoText.trim(), isCompleted: false, priority, createdAt: Date.now() },
      ])
    }
    setTodoText('')
    setPriority('medium')
  }

  const handleEdit = (id) => {
    const t = todos.find(t => t.id === id)
    setTodoText(t.todo)
    setPriority(t.priority || 'medium')
    setEditId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id) => persist(todos.filter(t => t.id !== id))

  const handleToggle = (id) =>
    persist(todos.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))

  const clearCompleted = () => persist(todos.filter(t => !t.isCompleted))

  const cancelEdit = () => {
    setEditId(null)
    setTodoText('')
    setPriority('medium')
  }

  // Filtered list
  const filtered = todos.filter(t => {
    if (filter === 'active')    return !t.isCompleted
    if (filter === 'completed') return t.isCompleted
    return true
  })

  const total     = todos.length
  const completed = todos.filter(t => t.isCompleted).length
  const active    = total - completed

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Stats ── */}
        {total > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard value={total}     label="Total"     textColor="text-orange-500" />
            <StatCard value={active}    label="Remaining" textColor="text-amber-500"  />
            <StatCard value={completed} label="Done"      textColor="text-green-500"  />
          </div>
        )}

        {/* ── Add / Edit form ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-6">

          <h2 className="flex items-center gap-2 font-bold text-slate-600 text-xs uppercase tracking-wider mb-3">
            {editId ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Task
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add New Task
              </>
            )}
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={todoText}
              onChange={e => setTodoText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50/40 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
            <button
              onClick={handleAdd}
              disabled={todoText.trim().length < 3}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold text-sm hover:from-orange-400 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-200 hover:-translate-y-0.5 duration-150"
            >
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button
                onClick={cancelEdit}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Priority picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold">Priority:</span>
            {Object.entries(PRIORITY).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setPriority(key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  priority === key
                    ? val.badge + ' shadow-sm scale-105'
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priority === key ? val.dot : 'bg-slate-300'}`} />
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-white rounded-xl border border-orange-100 p-1 gap-1 shadow-sm">
            {([
              ['all',       `All (${total})`],
              ['active',    `Active (${active})`],
              ['completed', `Done (${completed})`],
            ]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === val
                    ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {completed > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
            >
              Clear done
            </button>
          )}
        </div>

        {/* ── Todo list ── */}
        <div className="space-y-3">
          {filtered.length === 0
            ? <EmptyState filter={filter} />
            : filtered.map(t => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditing={editId === t.id}
                />
              ))
          }
        </div>

        {/* Footer hint */}
        {total > 0 && (
          <p className="text-center text-slate-400 text-xs mt-8">
            <span className="inline-flex items-center gap-1.5">
            {active === 0 ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                All tasks complete!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
                </svg>
                {active} task{active !== 1 ? 's' : ''} remaining
              </>
            )}
          </span>
          </p>
        )}

      </main>
    </div>
  )
}
