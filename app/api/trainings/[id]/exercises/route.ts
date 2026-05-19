import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { id: trainingId } = await params
  const training = await prisma.training.findFirst({ where: { id: trainingId, userId: session.user.id } })
  if (!training) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { exerciseId } = await req.json()
  const count = await prisma.trainingExercise.count({ where: { trainingId } })
  const te = await prisma.trainingExercise.create({
    data: { trainingId, exerciseId, order: count },
    include: { exercise: true },
  })
  return NextResponse.json(te, { status: 201 })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { id: trainingId } = await params
  const training = await prisma.training.findFirst({ where: { id: trainingId, userId: session.user.id } })
  if (!training) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { exerciseId } = await req.json()
  await prisma.trainingExercise.deleteMany({ where: { trainingId, exerciseId } })
  return NextResponse.json({ success: true })
}
