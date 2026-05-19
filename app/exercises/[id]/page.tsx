'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Exercise {
  id: string
  name: string
  description: string
  imageUrl: string | null
  fieldPlayers: number
  goalkeepers: number
  coreCompetency: string
  difficulty: string
  fieldSize: string
}

interface Training {
  id: string
  title: string
  date: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Anfänger: 'bg-green-100 text-green-700 border-green-200',
  Fortgeschritten: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Experte: 'bg-red-100 text-red-700 border-red-200',
}

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const router = useRouter()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [trainings, setTrainings] = useState<Training[]>([])
  const [selectedTraining, setSelectedTraining] = useState('')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/exercises/${id}`).then(r => r.json()).then(setExercise)
    if (session) {
      fetch('/api/trainings').then(r => r.json()).then(setTrainings)
    }
  }, [id, session])

  const addToTraining = async () => {
    if (!selectedTraining) return
    setAdding(true)
    await fetch(`/api/trainings/${selectedTraining}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: id }),
    })
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  if (!exercise) return <div className="text-center py-20 text-gray-400">Lade Übung...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/exercises" className="text-green-700 hover:underline text-sm mb-6 inline-flex items-center gap-1">
        ← Zurück zur Übersicht
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="bg-gradient-to-br from-green-600 to-green-800 h-64 flex items-center justify-center">
          {exercise.imageUrl ? (
            <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-9xl">⚽</span>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full font-medium border ${DIFFICULTY_COLORS[exercise.difficulty] || 'bg-gray-100 text-gray-600'}`}>
              {exercise.difficulty}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 font-medium">
              {exercise.coreCompetency}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
              {exercise.fieldSize}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">{exercise.name}</h1>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-3xl font-bold text-green-700">{exercise.fieldPlayers}</div>
              <div className="text-sm text-gray-500 mt-1">Feldspieler</div>
            </div>
            <div className="text-center bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-3xl font-bold text-green-700">{exercise.goalkeepers}</div>
              <div className="text-sm text-gray-500 mt-1">Torhüter</div>
            </div>
            <div className="text-center bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-2xl font-bold text-green-700">{exercise.fieldPlayers + exercise.goalkeepers}</div>
              <div className="text-sm text-gray-500 mt-1">Gesamt</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Beschreibung</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{exercise.description}</p>
          </div>

          {session ? (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Zum Training hinzufügen</h2>
              {trainings.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Noch keine Trainings geplant.{' '}
                  <Link href="/calendar" className="text-green-700 hover:underline">Training erstellen →</Link>
                </p>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={selectedTraining}
                    onChange={e => setSelectedTraining(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 flex-1 min-w-48"
                  >
                    <option value="">Training wählen...</option>
                    {trainings.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} – {new Date(t.date).toLocaleDateString('de-DE')}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addToTraining}
                    disabled={!selectedTraining || adding}
                    className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
                  >
                    {adding ? 'Wird hinzugefügt...' : added ? '✓ Hinzugefügt!' : 'Hinzufügen'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-6">
              <p className="text-gray-500 text-sm">
                <Link href="/login" className="text-green-700 hover:underline font-medium">Anmelden</Link> um Übungen zu deinen Trainings hinzuzufügen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
