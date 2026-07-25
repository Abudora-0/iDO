import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Navbar from './components/Navbar'

// Priority config: rendered as rubber-stamp labels on the paper
const PRIORITY = {
  high:   { label: 'Urgent',   color: '#d9534f' },
  medium: { label: 'Soon',     color: '#b8860b' },
  low:    { label: 'Whenever', color: '#6b7f3f' },
}

const LS_KEY = 'ido-todos-v2'
const UNDO_MS = 5000

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseISODate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isOverdue(dueDate, isCompleted) {
  if (!dueDate || isCompleted) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parseISODate(dueDate) < today
}

function formatDue(dueDate) {
  return parseISODate(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function TodoItem({ todo, onToggle, onEdit, onDelete, isEditing, dragHandlers, isDragging, isDropTarget }) {
  const p = PRIORITY[todo.priority || 'medium']
  const overdue = isOverdue(todo.dueDate, todo.isCompleted)

  return (
    <div
      {...dragHandlers}
      className={`todo-enter flex items-center gap-2 pl-2 pr-3 group min-h-[36px] ${
        isEditing ? 'bg-[#1f2a44]/5' : ''
      } ${isDragging ? 'opacity-40' : ''} ${isDropTarget ? 'drop-target' : ''}`}
    >
      {/* Drag handle */}
      <span className="drag-handle cursor-grab opacity-0 group-hover:opacity-40 hover:!opacity-80 transition-opacity flex-shrink-0" title="Drag to reorder">
        <svg width="10" height="14" viewBox="0 0 10 16" fill="currentColor">
          <circle cx="2" cy="2" r="1.4" /><circle cx="8" cy="2" r="1.4" />
          <circle cx="2" cy="8" r="1.4" /><circle cx="8" cy="8" r="1.4" />
          <circle cx="2" cy="14" r="1.4" /><circle cx="8" cy="14" r="1.4" />
        </svg>
      </span>

      {/* Checkbox: square ink box */}
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

      {/* Due date */}
      {todo.dueDate && (
        <span className={`text-[11px] font-semibold whitespace-nowrap ${
          overdue ? 'text-[#d9534f]' : 'text-[#98a3ba]'
        }`}>
          {overdue ? 'overdue · ' : ''}{formatDue(todo.dueDate)}
        </span>
      )}

      {/* Priority stamp */}
      <span className="stamp hidden sm:inline-block" style={{ color: p.color }}>
        {p.label}
      </span>

      {/* Actions: visible on hover */}
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

function EmptyState({ filter, hasSearch }) {
  if (hasSearch) {
    return (
      <div className="text-center py-14 px-4">
        <p className="font-display italic text-2xl text-[#5d6b8a] mb-1">No matches</p>
        <p className="text-[#98a3ba] text-sm">Nothing on the page matches that search.</p>
      </div>
    )
  }
  const map = {
    all:       { title: 'A blank page', sub: 'Write your first task above.' },
    active:    { title: 'All crossed off', sub: 'Nothing left on the list, enjoy it.' },
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

function Toast({ toast, onUndo }) {
  if (!toast) return null
  return (
    <div className="toast">
      <span className="truncate max-w-[220px]">Deleted &ldquo;{toast.todo.todo}&rdquo;</span>
      <button onClick={onUndo} className="toast-undo">Undo</button>
    </div>
  )
}

function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => parseISODate(value) || new Date())
  const boxRef = useRef(null)

  const selected = parseISODate(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    if (!open) return
    setViewDate(selected || new Date())

    const onClickAway = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClickAway)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickAway)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const year  = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()

  const cells = Array.from({ length: 42 }, (_, i) => new Date(year, month, i - startWeekday + 1))

  const pick = (date) => { onChange(toISODate(date)); setOpen(false) }

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="ink-input sm:w-40 text-sm flex items-center justify-between gap-2"
      >
        <span className={value ? '' : 'text-[#98a3ba] italic'}>
          {value ? formatDue(value) : 'due date'}
        </span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#98a3ba] flex-shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="date-popover">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="date-nav-btn">‹</button>
            <span className="font-display italic text-sm text-[#1f2a44]">{MONTHS[month]} {year}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="date-nav-btn">›</button>
          </div>

          <div className="grid grid-cols-7">
            {WEEKDAYS.map(w => <span key={w} className="date-weekday">{w}</span>)}
            {cells.map(date => {
              const inMonth    = date.getMonth() === month
              const isToday    = isSameDay(date, today)
              const isSelected = selected && isSameDay(date, selected)
              return (
                <button
                  key={toISODate(date)}
                  type="button"
                  onClick={() => pick(date)}
                  className={`date-cell ${!inMonth ? 'date-cell-faint' : ''} ${isToday ? 'date-cell-today' : ''} ${isSelected ? 'date-cell-selected' : ''}`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#dcd2ba]">
            <button type="button" onClick={() => { onChange(''); setOpen(false) }} className="text-xs italic font-display text-[#d9534f] hover:underline underline-offset-2">
              Clear
            </button>
            <button type="button" onClick={() => pick(new Date())} className="text-xs font-semibold text-[#1f2a44] hover:underline underline-offset-2">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [todoText, setTodoText]   = useState('')
  const [dueDate, setDueDate]     = useState('')
  const [todos, setTodos]         = useState([])
  const [editId, setEditId]       = useState(null)
  const [filter, setFilter]       = useState('all')      // all | active | completed
  const [priority, setPriority]   = useState('medium')
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState(null)        // { todo, index }
  const [dragId, setDragId]       = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)

  const inputRef  = useRef(null)
  const fileRef   = useRef(null)
  const undoTimer = useRef(null)

  // Load from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) setTodos(JSON.parse(stored))
  }, [])

  // Keyboard shortcuts: "/" focuses the input, Escape cancels editing/search
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'

      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape') {
        if (editId) cancelEdit()
        else if (typing) document.activeElement.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editId])

  const persist = (updated) => {
    setTodos(updated)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
  }

  const handleAdd = () => {
    if (todoText.trim().length < 3) return

    if (editId) {
      persist(todos.map(t =>
        t.id === editId ? { ...t, todo: todoText.trim(), priority, dueDate: dueDate || null } : t
      ))
      setEditId(null)
    } else {
      persist([
        ...todos,
        { id: uuidv4(), todo: todoText.trim(), isCompleted: false, priority, dueDate: dueDate || null, createdAt: Date.now() },
      ])
    }
    setTodoText('')
    setDueDate('')
    setPriority('medium')
  }

  const handleEdit = (id) => {
    const t = todos.find(t => t.id === id)
    setTodoText(t.todo)
    setPriority(t.priority || 'medium')
    setDueDate(t.dueDate || '')
    setEditId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    inputRef.current?.focus()
  }

  const handleDelete = (id) => {
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return
    const removed = todos[index]

    persist(todos.filter(t => t.id !== id))

    clearTimeout(undoTimer.current)
    setToast({ todo: removed, index })
    undoTimer.current = setTimeout(() => setToast(null), UNDO_MS)
  }

  const handleUndo = () => {
    if (!toast) return
    clearTimeout(undoTimer.current)
    const restored = [...todos]
    restored.splice(toast.index, 0, toast.todo)
    persist(restored)
    setToast(null)
  }

  const handleToggle = (id) =>
    persist(todos.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))

  const clearCompleted = () => persist(todos.filter(t => !t.isCompleted))

  const cancelEdit = () => {
    setEditId(null)
    setTodoText('')
    setDueDate('')
    setPriority('medium')
  }

  // Drag-to-reorder
  const handleDragStart = (id) => setDragId(id)
  const handleDragOver = (e, id) => {
    e.preventDefault()
    if (id !== dropTargetId) setDropTargetId(id)
  }
  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDropTargetId(null); return }
    const list = [...todos]
    const from = list.findIndex(t => t.id === dragId)
    const to   = list.findIndex(t => t.id === targetId)
    if (from === -1 || to === -1) return
    const [moved] = list.splice(from, 1)
    list.splice(to, 0, moved)
    persist(list)
    setDragId(null)
    setDropTargetId(null)
  }
  const handleDragEnd = () => { setDragId(null); setDropTargetId(null) }

  // Export / import
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ido-todos-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => fileRef.current?.click()

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!Array.isArray(parsed)) throw new Error('not an array')
        const valid = parsed
          .filter(t => t && typeof t.todo === 'string')
          .map(t => ({
            id: t.id || uuidv4(),
            todo: t.todo,
            isCompleted: !!t.isCompleted,
            priority: PRIORITY[t.priority] ? t.priority : 'medium',
            dueDate: t.dueDate || null,
            createdAt: t.createdAt || Date.now(),
          }))
        persist(valid)
      } catch {
        alert('That file doesn\'t look like a valid iDO export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Filtered list
  const filtered = todos
    .filter(t => {
      if (filter === 'active')    return !t.isCompleted
      if (filter === 'completed') return t.isCompleted
      return true
    })
    .filter(t => t.todo.toLowerCase().includes(search.trim().toLowerCase()))

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
            {editId ? 'Rewrite this task:' : 'Add to the list:'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="text"
              value={todoText}
              onChange={e => setTodoText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="what needs doing? (press / to focus)"
              className="ink-input flex-1"
            />
            <DatePicker value={dueDate} onChange={setDueDate} />
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

        {/* ── Search ── */}
        {total > 0 && (
          <div className="mb-5">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search the page..."
              className="ink-input text-sm"
            />
          </div>
        )}

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

          <div className="flex items-center gap-3">
            {total > 0 && (
              <>
                <button onClick={handleExport} className="text-xs font-semibold text-[#5d6b8a] hover:text-[#1f2a44] transition-colors">
                  export
                </button>
                <span className="text-[#dcd2ba]">·</span>
              </>
            )}
            <button onClick={handleImportClick} className="text-xs font-semibold text-[#5d6b8a] hover:text-[#1f2a44] transition-colors">
              import
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
            {completed > 0 && (
              <>
                <span className="text-[#dcd2ba]">·</span>
                <button
                  onClick={clearCompleted}
                  className="text-xs italic font-display text-[#d9534f] hover:underline underline-offset-2 transition-colors"
                >
                  tear out the done ones
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── The list (a sheet of ruled paper) ── */}
        <div className="paper-sheet rounded-sm py-2">
          {filtered.length === 0
            ? <EmptyState filter={filter} hasSearch={search.trim().length > 0} />
            : filtered.map(t => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isEditing={editId === t.id}
                  isDragging={dragId === t.id}
                  isDropTarget={dropTargetId === t.id && dragId !== t.id}
                  dragHandlers={{
                    draggable: true,
                    onDragStart: () => handleDragStart(t.id),
                    onDragOver: (e) => handleDragOver(e, t.id),
                    onDrop: () => handleDrop(t.id),
                    onDragEnd: handleDragEnd,
                  }}
                />
              ))
          }
        </div>

        {/* Footer line */}
        {total > 0 && (
          <p className="text-center font-display italic text-[#5d6b8a] text-sm mt-6">
            {active === 0
              ? 'Everything crossed off. Well done.'
              : `${completed} of ${total} crossed off, ${active} to go.`}
          </p>
        )}

      </main>

      <Toast toast={toast} onUndo={handleUndo} />
    </div>
  )
}
