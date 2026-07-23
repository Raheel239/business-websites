import { notFound } from 'next/navigation'
import { getBusinessConfig } from '@/lib/businesses'
import { BookingForm } from '@/components/BookingForm'
import { Footer } from '@/components/Footer'

export default function BookPage({
  params,
  searchParams,
}: {
  params: { business: string }
  searchParams: { service?: string }
}) {
  const business = getBusinessConfig(params.business)
  if (!business) notFound()

  return (
    <>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: business.primaryHex }}>
              Online Booking
            </span>
            <h1 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">Book Your Appointment</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Choose your service, pick a time, and pay securely online. You'll receive a confirmation email immediately.
            </p>
          </div>
          <BookingForm business={business} preselectedService={searchParams.service} />
        </div>
      </main>
      <Footer business={business} />
    </>
  )
}
