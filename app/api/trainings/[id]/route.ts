import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { id } = await params
  const training = await prisma.training.findFirst({
    where: { id, userId: session.user.id },
    include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } } },
  })
  if (!training) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  return NextResponse.json(training)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { id } = await params
  const { title, date, notes } = await req.json()
  const training = await prisma.training.updateMany({
    where: { id, userId: session.user.id },
    data: { title, date: new Date(date), notes },
  })
  return NextResponse.json(training)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { id } = await params
  await prisma.training.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ success: true })
}
