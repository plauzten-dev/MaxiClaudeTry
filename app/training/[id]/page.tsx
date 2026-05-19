'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  description: string
  difficulty: string
  coreCompetency: string
  fieldPlayers: number
  goalkeepers: number
}

interface TrainingExercise {
  id: string
  exercise: Exercise
}

interface Training {
  id: string
  title: string
  date: string
  notes: string | null
  exercises: TrainingExercise[]
}

interface AllExercise {
  id: string
  name: string
  difficulty: string
  coreCompetency: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Anfänger: 'bg-green-100 text-green-700',
  Fortgeschritten: 'bg-yellow-100 text-yellow-700',
  Experte: 'bg-red-100 text-red-700',
}

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [training, setTraining] = useState<Training | null>(null)
  const [allExercises, setAllExercises] = useState<AllExercise[]>([])
  const [searchEx, setSearchEx] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const loadTraining = useCallback(async () => {
    const res = await fetch(`/api/trainings/${id}`)
    if (res.ok) {
      const data = await res.json()
      setTraining(data)
      setEditTitle(data.title)
      setEditDate(data.date.split('T')[0])
      setEditNotes(data.notes || '')
    } else {
      router.push('/calendar')
    }
  }, [id, router])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session) {
      loadTraining()
      fetch('/api/exercises').then(r => r.json()).then(setAllExercises)
    }
  }, [session, loadTraining])

  const deleteTraining = async () => {
    if (!confirm('Training wirklich löschen?')) return
    setDeleting(true)
    await fetch(`/api/trainings/${id}`, { method: 'DELETE' })
    router.push('/calendar')
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/trainings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, date: editDate, notes: editNotes }),
    })
    setSaving(false)
    setEditing(false)
    loadTraining()
  }

  const addExercise = async (exId: string) => {
    const already = training?.exercises.some(te => te.exercise.id === exId)
    if (already) return
    await fetch(`/api/trainings/${id}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: exId }),
    })
    loadTraining()
  }

  const removeExercise = async (exId: string) => {
    await fetch(`/api/trainings/${id}/exercises`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: exId }),
    })
    loadTraining()
  }

  const assignedIds = new Set(training?.exercises.map(te => te.exercise.id) || [])
  const filteredExercises = allExercises.filter(ex =>
    !assignedIds.has(ex.id) &&
    (searchEx === '' || ex.name.toLowerCase().includes(searchEx.toLowerCase()) || ex.coreCompetency.toLowerCase().includes(searchEx.toLowerCase()))
  )

  if (status === 'loading' || !training) return <div className="text-center py-20 text-gray-400">Lade Training...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/calendar" className="text-green-700 hover:underline text-sm mb-6 inline-flex items-center gap-1">
        ← Zurück zum Kalender
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-4 mb-8">
        {editing ? (
          <form onSubmit={saveEdit} className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
              className="w-full text-2xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-green-400"
            />
            <input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              required
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              rows={3}
              placeholder="Notizen..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50">
                {saving ? 'Speichern...' : 'Speichern'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="border border-gray-200 px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                Abbrechen
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{training.title}</h1>
              <p className="text-gray-500 mt-1">
                {new Date(training.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              {training.notes && <p className="text-gray-600 mt-3 bg-gray-50 rounded-lg px-4 py-3">{training.notes}</p>}
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => setEditing(true)} className="border border-gray-200 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                Bearbeiten
              </button>
              <button onClick={deleteTraining} disabled={deleting} className="border border-red-200 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium disabled:opacity-50">
                Löschen
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Exercises */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Übungen in diesem Training ({training.exercises.length})
          </h2>
          {training.exercises.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm">Noch keine Übungen hinzugefügt.<br />Wähle rechts Übungen aus.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {training.exercises.map((te, i) => (
                <div key={te.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800">{te.exercise.name}</div>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[te.exercise.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                        {te.exercise.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {te.exercise.coreCompetency}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/exercises/${te.exercise.id}`} className="text-xs text-green-700 hover:underline">Detail</Link>
                    <button onClick={() => removeExercise(te.exercise.id)} className="text-xs text-red-500 hover:text-red-700">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercise Search */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Übungen hinzufügen</h2>
          <input
            type="text"
            value={searchEx}
            onChange={e => setSearchEx(e.target.value)}
            placeholder="Übung suchen..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredExercises.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Keine weiteren Übungen gefunden.</p>
            ) : (
              filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex.id)}
                  className="w-full bg-white rounded-xl border border-gray-100 p-3 text-left flex items-center justify-between hover:border-green-300 hover:bg-green-50 transition-all group"
                >
                  <div>
                    <div className="font-medium text-gray-800 text-sm group-hover:text-green-700">{ex.name}</div>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[ex.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                        {ex.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">{ex.coreCompetency}</span>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold text-lg ml-2">+</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
