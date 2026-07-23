import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getBusinessConfig } from '@/lib/businesses'
import { Footer } from '@/components/Footer'
import { AccountView } from '@/components/AccountView'

export default async function AccountPage({ params }: { params: { business: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/${params.business}/auth/login`)

  const business = getBusinessConfig(params.business)
  if (!business) redirect('/')

  const rawBookings = await prisma.booking.findMany({
    where: {
      userId: (session.user as any).id,
      businessSlug: params.business,
    },
    orderBy: { createdAt: 'desc' },
  })

  const bookings = rawBookings.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }))

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: business.primaryHex }}>
              My Account
            </span>
            <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
              Welcome, {session.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-400 mt-2">{session.user?.email}</p>
          </div>
          <AccountView bookings={bookings} business={business} />
        </div>
      </main>
      <Footer business={business} />
    </>
  )
}
