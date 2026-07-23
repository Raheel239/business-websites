import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const business = searchParams.get('business')
  if (!business) return NextResponse.json({ reviews: [] })

  const reviews = await prisma.review.findMany({
    where: { businessSlug: business },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({ reviews })
}

const schema = z.object({
  businessSlug: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(500),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Sign in to leave a review' }, { status: 401 })

  try {
    const body = await req.json()
    const { businessSlug, rating, comment } = schema.parse(body)

    const review = await prisma.review.create({
      data: {
        businessSlug,
        rating,
        comment,
        userId: (session.user as any).id,
      },
      include: { user: { select: { name: true } } },
    })

    return NextResponse.json({ review })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
