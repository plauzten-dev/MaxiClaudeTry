'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Training {
  id: string
  title: string
  date: string
  notes: string | null
}

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [trainings, setTrainings] = useState<Training[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/trainings').then(r => r.json()).then(setTrainings)
    }
  }, [session])

  const trainingsByDate = trainings.reduce<Record<string, Training[]>>((acc, t) => {
    const d = new Date(t.date).toISOString().split('T')[0]
    if (!acc[d]) acc[d] = []
    acc[d].push(t)
    return acc
  }, {})

  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/trainings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate, notes: newNotes }),
    })
    const created = await res.json()
    setTrainings(prev => [...prev, created])
    setNewTitle(''); setNewDate(''); setNewNotes('')
    setShowForm(false)
    setSaving(false)
    router.push(`/training/${created.id}`)
  }

  if (status === 'loading') return <div className="text-center py-20 text-gray-400">Lade...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mein Trainingskalender</h1>
          <p className="text-gray-500 mt-1">Plane und verwalte deine Trainingseinheiten</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition-colors"
        >
          + Training erstellen
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Neues Training erstellen</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="z.B. Dienstags-Training"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen (optional)</label>
                <textarea
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  placeholder="Ziele für dieses Training..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-green-700 text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50">
                  {saving ? 'Erstelle...' : 'Training erstellen'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold hover:bg-gray-50">
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 font-bold">←</button>
          <h2 className="text-xl font-bold text-gray-800">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 font-bold">→</button>
        </div>
        <div className="grid grid-cols-7">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 uppercase py-3 border-b border-gray-50">{d}</div>
          ))}
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="min-h-[90px] border-b border-r border-gray-50" />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayTrainings = trainingsByDate[dateStr] || []
            const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
            return (
              <div key={day} className={`min-h-[90px] border-b border-r border-gray-50 p-2 ${isToday ? 'bg-green-50' : ''}`}>
                <div className={`text-sm font-semibold mb-1 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-green-600 text-white' : 'text-gray-700'}`}>
                  {day}
                </div>
                {dayTrainings.map(t => (
                  <Link key={t.id} href={`/training/${t.id}`}>
                    <div className="text-xs bg-green-600 text-white rounded px-1.5 py-0.5 mb-1 truncate hover:bg-green-700 transition-colors cursor-pointer">
                      {t.title}
                    </div>
                  </Link>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Trainings List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Alle Trainings</h2>
        {trainings.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">📅</div>
            <p>Noch keine Trainings geplant.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...trainings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
              <Link key={t.id} href={`/training/${t.id}`}>
                <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between hover:border-green-200 hover:shadow-sm transition-all">
                  <div>
                    <div className="font-semibold text-gray-800">{t.title}</div>
                    {t.notes && <div className="text-sm text-gray-400 mt-0.5 truncate max-w-md">{t.notes}</div>}
                  </div>
                  <div className="text-sm text-gray-500 ml-4 shrink-0">
                    {new Date(t.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
