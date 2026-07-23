import { notFound } from 'next/navigation'
import { getBusinessConfig } from '@/lib/businesses'
import { Navbar } from '@/components/Navbar'

export default function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { business: string }
}) {
  const business = getBusinessConfig(params.business)
  if (!business) notFound()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar business={business} />
      {children}
    </div>
  )
}

export async function generateStaticParams() {
  return ['cleaning', 'carwash', 'barber', 'massage', 'nails'].map((b) => ({ business: b }))
}
