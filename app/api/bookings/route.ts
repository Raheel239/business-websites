import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const business = searchParams.get('business')
  const date = searchParams.get('date')

  if (!business || !date) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const bookings = await prisma.booking.findMany({
    where: {
      businessSlug: business,
      date,
      status: { not: 'cancelled' },
    },
    select: { startTime: true },
  })

  return NextResponse.json({ bookedSlots: bookings.map((b) => b.startTime) })
}
