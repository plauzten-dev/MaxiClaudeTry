import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const trainings = await prisma.training.findMany({
    where: { userId: session.user.id },
    include: { exercises: { include: { exercise: true } } },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(trainings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { title, date, notes } = await req.json()
  const training = await prisma.training.create({
    data: { title, date: new Date(date), notes, userId: session.user.id },
  })
  return NextResponse.json(training, { status: 201 })
}
