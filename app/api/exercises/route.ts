import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fieldPlayers = searchParams.get('fieldPlayers')
  const goalkeepers = searchParams.get('goalkeepers')
  const coreCompetency = searchParams.get('coreCompetency')
  const difficulty = searchParams.get('difficulty')
  const fieldSize = searchParams.get('fieldSize')

  const where: any = {}
  if (fieldPlayers) where.fieldPlayers = parseInt(fieldPlayers)
  if (goalkeepers) where.goalkeepers = parseInt(goalkeepers)
  if (coreCompetency) where.coreCompetency = coreCompetency
  if (difficulty) where.difficulty = difficulty
  if (fieldSize) where.fieldSize = fieldSize

  const exercises = await prisma.exercise.findMany({ where, orderBy: { name: 'asc' } })
  return NextResponse.json(exercises)
}
