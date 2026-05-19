'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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

const COMPETENCIES = ['Passspiel', 'Torschuss', 'Pressing', 'Ballbesitz', 'Zweikampf', 'Standardsituationen']
const DIFFICULTIES = ['Anfänger', 'Fortgeschritten', 'Experte']
const FIELD_SIZES = ['Klein', 'Mittel', 'Groß']

const DIFFICULTY_COLORS: Record<string, string> = {
  Anfänger: 'bg-green-100 text-green-700',
  Fortgeschritten: 'bg-yellow-100 text-yellow-700',
  Experte: 'bg-red-100 text-red-700',
}

function ExercisesContent() {
  const searchParams = useSearchParams()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    fieldPlayers: '',
    goalkeepers: '',
    coreCompetency: searchParams.get('coreCompetency') || '',
    difficulty: '',
    fieldSize: '',
  })

  const fetchExercises = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    const res = await fetch(`/api/exercises?${params}`)
    const data = await res.json()
    setExercises(data)
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchExercises() }, [fetchExercises])

  const resetFilters = () => setFilters({ fieldPlayers: '', goalkeepers: '', coreCompetency: '', difficulty: '', fieldSize: '' })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Übungsdatenbank</h1>
      <p className="text-gray-500 mb-8">Entdecke und filtere Übungen für dein Training</p>

      {/* Filter Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Feldspieler</label>
            <input
              type="number"
              min={0}
              max={22}
              value={filters.fieldPlayers}
              onChange={e => setFilters(f => ({ ...f, fieldPlayers: e.target.value }))}
              placeholder="Beliebig"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Torhüter</label>
            <input
              type="number"
              min={0}
              max={2}
              value={filters.goalkeepers}
              onChange={e => setFilters(f => ({ ...f, goalkeepers: e.target.value }))}
              placeholder="Beliebig"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kernkompetenz</label>
            <select
              value={filters.coreCompetency}
              onChange={e => setFilters(f => ({ ...f, coreCompetency: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Alle</option>
              {COMPETENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Schwierigkeit</label>
            <select
              value={filters.difficulty}
              onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Alle</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Spielfeldgröße</label>
            <select
              value={filters.fieldSize}
              onChange={e => setFilters(f => ({ ...f, fieldSize: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Alle</option>
              {FIELD_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">{exercises.length} Übung{exercises.length !== 1 ? 'en' : ''} gefunden</span>
          <button onClick={resetFilters} className="text-sm text-green-700 hover:underline">Filter zurücksetzen</button>
        </div>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Lade Übungen...</div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p>Keine Übungen gefunden. Versuche andere Filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <Link key={ex.id} href={`/exercises/${ex.id}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-green-200 transition-all group">
                <div className="bg-gradient-to-br from-green-600 to-green-800 h-40 flex items-center justify-center">
                  {ex.imageUrl ? (
                    <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">⚽</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-green-700 transition-colors">{ex.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{ex.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[ex.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                      {ex.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {ex.coreCompetency}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      👤 {ex.fieldPlayers} + 🧤 {ex.goalkeepers}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ExercisesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Lade...</div>}>
      <ExercisesContent />
    </Suspense>
  )
}
