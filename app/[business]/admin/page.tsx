import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getBusinessConfig } from '@/lib/businesses'
import { AdminDashboard } from '@/components/AdminDashboard'

export default async function AdminPage({ params }: { params: { business: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any

  if (!session || user?.role !== 'admin' || user?.businessSlug !== params.business) {
    redirect(`/${params.business}`)
  }

  const business = getBusinessConfig(params.business)
  if (!business) redirect('/')

  const bookings = await prisma.booking.findMany({
    where: { businessSlug: params.business },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { date: 'asc' },
  })

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    revenue: bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.servicePrice, 0),
    today: bookings.filter((b) => b.date === new Date().toISOString().split('T')[0]).length,
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: business.primaryHex }}>
            Business Admin
          </span>
          <h1 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">Dashboard</h1>
        </div>
        <AdminDashboard bookings={bookings as any} business={business} stats={stats} />
      </div>
    </main>
  )
}
