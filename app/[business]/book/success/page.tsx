import Link from 'next/link'
import { getBusinessConfig } from '@/lib/businesses'
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react'

export default function SuccessPage({
  params,
  searchParams,
}: {
  params: { business: string }
  searchParams: { session_id?: string }
}) {
  const business = getBusinessConfig(params.business)
  if (!business) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          style={{ backgroundColor: business.primaryHex }}
        >
          <CheckCircle size={48} className="text-white" />
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
          You're Booked!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
          Your appointment has been confirmed. Check your email for full details.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-8 text-left space-y-3">
          <p className="text-sm text-slate-500">A confirmation email has been sent with:</p>
          <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <li>✅ Your booking reference number</li>
            <li>✅ Service details and time</li>
            <li>✅ Address and contact info</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${business.slug}/account`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white text-sm"
            style={{ backgroundColor: business.primaryHex }}
          >
            <Calendar size={16} />
            View My Bookings
          </Link>
          <Link
            href={`/${business.slug}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 text-sm"
          >
            Back to Home
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
