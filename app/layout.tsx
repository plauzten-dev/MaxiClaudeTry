import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/Navbar'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FußballTraining - Trainingsmanagement',
  description: 'Professionelles Fußball-Trainingsmanagement für Trainer und Spieler',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans antialiased">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-green-800 text-green-200 text-center py-4 text-sm mt-auto">
            © 2024 FußballTraining — Trainingsmanagement
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
