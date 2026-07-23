'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BusinessConfig } from '@/lib/businesses'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

type Booking = {
  id: string
  serviceName: string
  servicePrice: number
  date: string
  startTime: string
  endTime: string
  status: string
  staffName: string | null
  createdAt: string
}

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
}

export function AccountView({ bookings, business }: { bookings: Booking[]; business: BusinessConfig }) {
  const [bookingList, setBookingList] = useState(bookings)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  const now = new Date().toISOString().split('T')[0]
  const upcoming = bookingList.filter((b) => b.date >= now && b.status !== 'cancelled')
  const past = bookingList.filter((b) => b.date < now || b.status === 'cancelled')

  async function cancelBooking(id: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancelling(id)
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBookingList((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))
      toast.success('Booking cancelled')
    } else {
      toast.error('Failed to cancel booking')
    }
    setCancelling(null)
  }

  const displayList = tab === 'upcoming' ? upcoming : past

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-3xl font-black" style={{ color: business.primaryHex }}>{bookingList.length}</div>
          <div className="text-sm text-slate-400 mt-1">Total Bookings</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-3xl font-black text-green-500">{upcoming.length}</div>
          <div className="text-sm text-slate-400 mt-1">Upcoming</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-3xl font-black text-blue-500">{past.filter((b) => b.status === 'completed').length}</div>
          <div className="text-sm text-slate-400 mt-1">Completed</div>
        </div>
      </div>

      {/* Quick Book */}
      <Link
        href={`/${business.slug}/book`}
        className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed mb-8 hover:bg-opacity-5 transition-colors"
        style={{ borderColor: business.primaryHex }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${business.primaryHex}20` }}>
            <Plus size={20} style={{ color: business.primaryHex }} />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">Book New Appointment</div>
            <div className="text-slate-400 text-xs">Choose from {business.services.length} services</div>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-400" />
      </Link>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
        {(['upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {displayList.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Calendar size={40} className="mx-auto mb-4 opacity-40" />
          <p>{tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}</p>
          {tab === 'upcoming' && (
            <Link href={`/${business.slug}/book`} className="mt-4 inline-block text-sm font-bold underline" style={{ color: business.primaryHex }}>
              Book your first appointment
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((booking) => {
            const statusCfg = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.confirmed
            const StatusIcon = statusCfg.icon
            return (
              <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white">{booking.serviceName}</h3>
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${statusCfg.color} ${statusCfg.bg}`}>
                        <StatusIcon size={10} />
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-1 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={13} />
                        {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={13} />
                        {booking.startTime} – {booking.endTime}
                      </div>
                      {booking.staffName && (
                        <div className="text-slate-400 text-xs col-span-2">with {booking.staffName}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black" style={{ color: business.primaryHex }}>${booking.servicePrice}</div>
                    <div className="text-xs text-slate-400 mt-1">#{booking.id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>

                {booking.status === 'confirmed' && booking.date >= now && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      disabled={cancelling === booking.id}
                      className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
