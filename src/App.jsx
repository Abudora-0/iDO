import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Navbar from './components/Navbar'

// Priority config — rendered as rubber-stamp labels on the paper
const PRIORITY = {
  high:   { label: 'Urgent',   color: '#d9534f' },
  medium: { label: 'Soon',     color: '#b8860b' },
  low:    { label: 'Whenever', color: '#6b7f3f' },
}

const LS_KEY = 'ido-todos-v2'

// ── Helpers ──────────────────────────────────────────────────────────────────

function TodoItem({ todo, onToggle, onEdit, onDelete, isEditing }) {
  const p = PRIORITY[todo.priority || 'medium']

  return (
    <div
      className={`todo-enter flex items-center gap-3 pl-4 pr-3 group min-h-[36px] ${
        isEditing ? 'bg-[#1f2a44]/5' : ''
      }`}
    >
      {/* Checkbox — square ink box */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-[18px] h-[18px] border-2 rounded-[3px] flex-shrink-0 flex items-center justify-center transition-all duration-150 ${
          todo.isCompleted
            ? 'bg-[#1f2a44] border-[#1f2a44]'
            : 'border-[#98a3ba] hover:border-[#1f2a44] bg-transparent'
        }`}
      >
        {todo.isCompleted && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6.5l2.6 2.8L10 2.5" stroke="#faf5e8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span className={`flex-1 text-[15px] leading-9 truncate ${
        todo.isCompleted ? 'done-strike' : 'text-[#1f2a44]'
      }`}>
        {todo.todo}
      </span>

      {/* Priority stamp */}
      <span className="stamp hidden sm:inline-block" style={{ color: p.color }}>
        {p.label}
      </span>

      {/* Actions — visible on hover */}
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onEdit(todo.id)}
          title="Edit"
          className="p-1.5 text-[#98a3ba] hover:text-[#1f2a44] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          title="Delete"
          className="p-1.5 text-[#98a3ba] hover:text-[#d9534f] transition-colors"
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

function EmptyState({ filter }) {
  const map = {
    all:       { title: 'A blank page', sub: 'Write your first task above.' },
    active:    { title: 'All crossed off', sub: 'Nothing left on the list — enjoy it.' },
    completed: { title: 'Nothing done yet', sub: 'Crossed-off tasks land here.' },
  }
  const m = map[filter]
  return (
    <div className="text-center py-14 px-4">
      <p className="font-display italic text-2xl text-[#5d6b8a] mb-1">{m.title}</p>
      <p className="text-[#98a3ba] text-sm">{m.sub}</p>
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
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-2xl mx-auto px-5 py-8">

        {/* ── Add / Edit form ── */}
        <div className="mb-8">
          <p className="font-display italic text-[#5d6b8a] text-sm mb-2">
            {editId ? 'Rewrite this task —' : 'Add to the list —'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={todoText}
              onChange={e => setTodoText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="what needs doing?"
              className="ink-input flex-1"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={todoText.trim().length < 3}
                className="btn-ink"
              >
                {editId ? 'Rewrite' : 'Jot it down'}
              </button>
              {editId && (
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm font-semibold text-[#5d6b8a] hover:text-[#1f2a44] transition-colors"
                >
                  Never mind
                </button>
              )}
            </div>
          </div>

          {/* Priority picker */}
          <div className="flex items-center gap-3 flex-wrap mt-4">
            <span className="text-[11px] uppercase tracking-widest text-[#98a3ba] font-bold">Mark as</span>
            {Object.entries(PRIORITY).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setPriority(key)}
                className="stamp transition-all"
                style={{
                  color: val.color,
                  opacity: priority === key ? 1 : 0.35,
                  transform: priority === key ? 'rotate(-2deg) scale(1.08)' : 'rotate(-2deg)',
                  background: priority === key ? `${val.color}14` : 'transparent',
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filter tabs + progress ── */}
        <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
          <div className="flex gap-5">
            {([
              ['all',       'Everything', total],
              ['active',    'To do',      active],
              ['completed', 'Done',       completed],
            ]).map(([val, label, count]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`text-sm pb-1 border-b-2 transition-all ${
                  filter === val
                    ? 'font-bold text-[#1f2a44] border-[#d9534f]'
                    : 'text-[#98a3ba] border-transparent hover:text-[#5d6b8a]'
                }`}
              >
                {label} <sup className="text-[10px]">{count}</sup>
              </button>
            ))}
          </div>

          {completed > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs italic font-display text-[#d9534f] hover:underline underline-offset-2 transition-colors"
            >
              tear out the done ones
            </button>
          )}
        </div>

        {/* ── The list (a sheet of ruled paper) ── */}
        <div className="paper-sheet rounded-sm py-2">
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

        {/* Footer line */}
        {total > 0 && (
          <p className="text-center font-display italic text-[#5d6b8a] text-sm mt-6">
            {active === 0
              ? 'Everything crossed off. Well done.'
              : `${completed} of ${total} crossed off — ${active} to go.`}
          </p>
        )}

      </main>
    </div>
  )
}
