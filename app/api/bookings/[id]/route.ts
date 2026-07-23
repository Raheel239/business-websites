import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendCancellationEmail } from '@/lib/email'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { user: true },
  })

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (booking.userId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.booking.update({
    where: { id: params.id },
    data: { status: 'cancelled' },
  })

  try {
    await sendCancellationEmail({
      to: booking.user.email,
      customerName: booking.user.name,
      businessName: booking.businessSlug,
      serviceName: booking.serviceName,
      date: booking.date,
      startTime: booking.startTime,
    })
  } catch {}

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session || user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await req.json()
  if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: { status },
  })

  return NextResponse.json(booking)
}
