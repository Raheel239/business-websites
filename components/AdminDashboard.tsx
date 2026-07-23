'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { BusinessConfig } from '@/lib/businesses'
import { Users, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminCalendar = dynamic(() => import('./AdminCalendar').then((m) => m.AdminCalendar), { ssr: false })

type Booking = {
  id: string
  serviceName: string
  servicePrice: number
  date: string
  startTime: string
  endTime: string
  status: string
  staffName: string | null
  notes: string | null
  user: { name: string; email: string }
}

export function AdminDashboard({
  bookings: initialBookings,
  business,
  stats,
}: {
  bookings: Booking[]
  business: BusinessConfig
  stats: { total: number; confirmed: number; revenue: number; today: number }
}) {
  const [bookings, setBookings] = useState(initialBookings)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  const calendarEvents = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({
      id: b.id,
      title: `${b.serviceName} — ${b.user.name}`,
      start: `${b.date}T${b.startTime}`,
      end: `${b.date}T${b.endTime}`,
      backgroundColor: b.status === 'completed' ? '#64748b' : business.primaryHex,
      borderColor: 'transparent',
      extendedProps: b,
    }))

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev))
      toast.success(`Booking marked as ${status}`)
    } else {
      toast.error('Failed to update booking')
    }
  }

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'text-blue-500' },
    { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
    { label: "Today's Bookings", value: stats.today, icon: Clock, color: 'text-amber-500' },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{s.label}</span>
                <Icon size={18} className={s.color} />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
            </div>
          )
        })}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit">
        {(['calendar', 'list'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              view === v ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {view === 'calendar' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden p-4">
              <AdminCalendar
                events={calendarEvents}
                onEventClick={(props) => setSelected(props as unknown as Booking)}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.length === 0 && (
                <div className="text-center py-16 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  No bookings yet
                </div>
              )}
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => setSelected(booking)}
                  className="w-full bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-left hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{booking.user.name}</div>
                      <div className="text-sm text-slate-500">{booking.serviceName}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {booking.startTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">${booking.servicePrice}</div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Booking detail panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Booking Details</h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selected.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-900 dark:text-white text-xs">{selected.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selected.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(selected.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selected.startTime} – {selected.endTime}</span>
                  </div>
                  {selected.staffName && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Staff</span>
                      <span className="font-medium text-slate-900 dark:text-white">{selected.staffName}</span>
                    </div>
                  )}
                  {selected.notes && (
                    <div>
                      <span className="text-slate-500">Notes</span>
                      <p className="mt-1 text-slate-700 dark:text-slate-300 text-xs">{selected.notes}</p>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="font-black" style={{ color: business.primaryHex }}>${selected.servicePrice}</span>
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 mb-2 font-medium">Update Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['confirmed', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selected.id, status)}
                        disabled={selected.status === status}
                        className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all disabled:opacity-40 ${
                          status === 'confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400' :
                          status === 'completed' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-center text-slate-400 h-48">
              <div className="text-center">
                <Calendar size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Click a booking to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
