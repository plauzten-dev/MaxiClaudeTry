import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Fußball-Trainingsmanagement
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Verwalte deine Trainingseinheiten, entdecke Übungen und plane deinen Trainingskalender – alles an einem Ort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/exercises"
              className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3 rounded-xl transition-colors text-lg"
            >
              Übungen entdecken
            </Link>
            <Link
              href="/register"
              className="bg-green-900 hover:bg-green-950 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-lg border border-green-500"
            >
              Kostenlos registrieren
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Alles was du brauchst
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Übungsdatenbank</h3>
              <p className="text-gray-600">
                Durchsuche und filtere Übungen nach Spieleranzahl, Schwierigkeitsgrad, Kernkompetenz und Spielfeldgröße.
              </p>
              <Link
                href="/exercises"
                className="inline-block mt-4 text-green-700 hover:text-green-800 font-medium"
              >
                Zur Übungsdatenbank →
              </Link>
            </div>

            <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trainingskalender</h3>
              <p className="text-gray-600">
                Plane deine Trainingseinheiten im Monatskalender und ordne jedem Training beliebige Übungen zu.
              </p>
              <Link
                href="/calendar"
                className="inline-block mt-4 text-green-700 hover:text-green-800 font-medium"
              >
                Zum Kalender →
              </Link>
            </div>

            <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Persönliches Konto</h3>
              <p className="text-gray-600">
                Erstelle ein kostenloses Konto und behalte deine Trainingspläne sicher und privat.
              </p>
              <Link
                href="/register"
                className="inline-block mt-4 text-green-700 hover:text-green-800 font-medium"
              >
                Jetzt registrieren →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Competencies Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Kernkompetenzen
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Übungen aus allen wichtigen Bereichen des modernen Fußballs
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Passspiel', icon: '🎯', color: 'bg-blue-100 text-blue-700' },
              { label: 'Torschuss', icon: '⚡', color: 'bg-red-100 text-red-700' },
              { label: 'Pressing', icon: '🔥', color: 'bg-orange-100 text-orange-700' },
              { label: 'Ballbesitz', icon: '🔄', color: 'bg-purple-100 text-purple-700' },
              { label: 'Zweikampf', icon: '💪', color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Standardsituationen', icon: '📐', color: 'bg-green-100 text-green-700' },
            ].map((comp) => (
              <Link
                key={comp.label}
                href={`/exercises?coreCompetency=${encodeURIComponent(comp.label)}`}
                className={`flex items-center gap-3 p-4 rounded-xl ${comp.color} font-medium hover:opacity-80 transition-opacity`}
              >
                <span className="text-2xl">{comp.icon}</span>
                <span>{comp.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
