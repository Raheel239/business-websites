import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { sendBookingConfirmation } from '@/lib/email'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata!

    try {
      const booking = await prisma.booking.create({
        data: {
          businessSlug: meta.businessSlug,
          userId: meta.userId,
          serviceName: meta.serviceName,
          servicePrice: parseFloat(meta.servicePrice),
          serviceDuration: parseInt(meta.serviceDuration),
          date: meta.date,
          startTime: meta.startTime,
          endTime: meta.endTime,
          staffName: meta.staffName || null,
          notes: meta.notes || null,
          status: 'confirmed',
          paymentIntentId: session.payment_intent as string,
        },
      })

      await sendBookingConfirmation({
        to: meta.userEmail,
        customerName: meta.userName,
        businessName: meta.businessSlug,
        serviceName: meta.serviceName,
        date: meta.date,
        startTime: meta.startTime,
        endTime: meta.endTime,
        price: parseFloat(meta.servicePrice),
        bookingId: booking.id,
        staffName: meta.staffName || undefined,
      })
    } catch (err) {
      console.error('Webhook processing error:', err)
    }
  }

  return NextResponse.json({ received: true })
}
