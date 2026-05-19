'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === href
        ? 'bg-green-700 text-white'
        : 'text-green-100 hover:bg-green-700 hover:text-white'
    }`

  return (
    <nav className="bg-green-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <Link href="/" className="text-white font-bold text-lg">
              Training Manager
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/exercises" className={linkClass('/exercises')}>
              Übungen
            </Link>
            {session ? (
              <>
                <Link href="/calendar" className={linkClass('/calendar')}>
                  Kalender
                </Link>
                <span className="text-green-200 text-sm px-2">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-2 rounded-md text-sm font-medium text-green-100 hover:bg-green-700 hover:text-white transition-colors"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={linkClass('/login')}>
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-white text-green-800 hover:bg-green-100 transition-colors"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
