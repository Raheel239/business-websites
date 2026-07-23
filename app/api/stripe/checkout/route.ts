import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to book' }, { status: 401 })
  }

  const {
    businessSlug,
    businessName,
    serviceName,
    servicePrice,
    serviceDuration,
    date,
    startTime,
    endTime,
    staffName,
    notes,
  } = await req.json()

  const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: serviceName,
            description: `${businessName} — ${new Date(date).toLocaleDateString('en-GB')} at ${startTime}${staffName ? ` with ${staffName}` : ''}`,
          },
          unit_amount: Math.round(servicePrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/${businessSlug}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${businessSlug}/book`,
    customer_email: session.user.email!,
    metadata: {
      businessSlug,
      serviceName,
      servicePrice: String(servicePrice),
      serviceDuration: String(serviceDuration),
      date,
      startTime,
      endTime,
      staffName: staffName || '',
      notes: notes || '',
      userId: (session.user as any).id,
      userEmail: session.user.email!,
      userName: session.user.name || '',
    },
    payment_intent_data: {
      metadata: {
        businessSlug,
        serviceName,
        date,
        startTime,
      },
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
