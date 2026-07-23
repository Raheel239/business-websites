'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { BusinessConfig, Service, generateTimeSlots, addMinutes } from '@/lib/businesses'
import { Calendar, Clock, User, CreditCard, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const STEPS = ['Service', 'Date & Time', 'Details', 'Payment']

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getDayName(dateStr: string) {
  const d = new Date(dateStr)
  return DAY_ORDER[d.getDay() === 0 ? 6 : d.getDay() - 1]
}

function getNext14Days() {
  const days = []
  for (let i = 0; i < 14; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export function BookingForm({
  business,
  preselectedService,
}: {
  business: BusinessConfig
  preselectedService?: string
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState<Service | null>(
    preselectedService ? business.services.find((s) => s.id === preselectedService) || null : null
  )
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedStaff, setSelectedStaff] = useState(business.staff[0])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])

  useEffect(() => {
    if (preselectedService) setStep(1)
  }, [preselectedService])

  useEffect(() => {
    if (selectedDate) {
      fetch(`/api/bookings?business=${business.slug}&date=${selectedDate}`)
        .then((r) => r.json())
        .then((data) => setBookedSlots(data.bookedSlots || []))
        .catch(() => {})
    }
  }, [selectedDate, business.slug])

  const availableSlots = () => {
    if (!selectedService || !selectedDate) return []
    const dayName = getDayName(selectedDate)
    const hours = business.hours[dayName]
    if (!hours || hours.closed) return []
    return generateTimeSlots(hours.open, hours.close, selectedService.duration).filter(
      (slot) => !bookedSlots.includes(slot)
    )
  }

  async function handlePayment() {
    if (!session) {
      router.push(`/${business.slug}/auth/login?redirect=/book`)
      return
    }
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please complete all fields')
      return
    }
    setLoading(true)
    try {
      const endTime = addMinutes(selectedTime, selectedService.duration)
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessSlug: business.slug,
          businessName: business.name,
          serviceName: selectedService.name,
          servicePrice: selectedService.price,
          serviceDuration: selectedService.duration,
          date: selectedDate,
          startTime: selectedTime,
          endTime,
          staffName: selectedStaff,
          notes,
        }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
      else toast.error('Failed to start checkout')
    } catch {
      toast.error('Something went wrong')
    }
    setLoading(false)
  }

  const stepContent = [
    // Step 0 — Service selection
    <div key="service" className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Choose a Service</h2>
      <div className="grid grid-cols-1 gap-3">
        {business.services.map((service) => (
          <button
            key={service.id}
            onClick={() => { setSelectedService(service); setStep(1) }}
            className={`flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all ${
              selectedService?.id === service.id
                ? 'border-opacity-100 bg-opacity-5'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            style={selectedService?.id === service.id ? { borderColor: business.primaryHex, backgroundColor: `${business.primaryHex}10` } : {}}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white">{service.name}</span>
                {service.popular && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: business.primaryHex }}>
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{service.description}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} />{service.duration < 60 ? `${service.duration}m` : `${Math.floor(service.duration / 60)}h${service.duration % 60 ? `${service.duration % 60}m` : ''}`}</span>
              </div>
            </div>
            <div className="text-2xl font-black ml-4" style={{ color: business.primaryHex }}>${service.price}</div>
          </button>
        ))}
      </div>
    </div>,

    // Step 1 — Date & Time
    <div key="datetime" className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Pick a Date & Time</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Calendar size={16} /> Select Date
        </label>
        <div className="grid grid-cols-7 gap-2">
          {getNext14Days().map((date) => {
            const dayName = getDayName(date)
            const hours = business.hours[dayName]
            const closed = !hours || hours.closed
            const isSelected = date === selectedDate
            const d = new Date(date)
            return (
              <button
                key={date}
                onClick={() => { if (!closed) { setSelectedDate(date); setSelectedTime('') } }}
                disabled={closed}
                className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${
                  isSelected ? 'text-white shadow-lg scale-105' : closed ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                style={isSelected ? { backgroundColor: business.primaryHex } : {}}
              >
                <span className="font-medium">{d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)}</span>
                <span className="font-bold text-sm mt-0.5">{d.getDate()}</span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="animate-slide-up">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Clock size={16} /> Available Times
          </label>
          {availableSlots().length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No available slots for this date. Please pick another day.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableSlots().map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === slot ? 'text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  style={selectedTime === slot ? { backgroundColor: business.primaryHex } : {}}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium">
          Back
        </button>
        <button
          onClick={() => selectedDate && selectedTime && setStep(2)}
          disabled={!selectedDate || !selectedTime}
          className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: business.primaryHex }}
        >
          Continue
        </button>
      </div>
    </div>,

    // Step 2 — Details
    <div key="details" className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Details</h2>

      {!session && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6">
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            <a href={`/${business.slug}/auth/login?redirect=/${business.slug}/book`} className="font-bold underline">Sign in</a> or{' '}
            <a href={`/${business.slug}/auth/signup`} className="font-bold underline">create an account</a> to track your bookings.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Staff Member</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2"
          >
            {business.staff.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="No preference">No preference</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Special Requests / Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 resize-none"
            placeholder="Any allergies, special requirements, or notes..."
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-medium text-slate-900 dark:text-white">{selectedService?.name}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium text-slate-900 dark:text-white">{selectedDate && new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-medium text-slate-900 dark:text-white">{selectedTime} – {selectedService && addMinutes(selectedTime, selectedService.duration)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Staff</span><span className="font-medium text-slate-900 dark:text-white">{selectedStaff}</span></div>
          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white">Total</span>
            <span className="font-black text-lg" style={{ color: business.primaryHex }}>${selectedService?.price}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium">
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
          style={{ backgroundColor: business.primaryHex }}
        >
          Proceed to Payment
        </button>
      </div>
    </div>,

    // Step 3 — Payment
    <div key="payment" className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Secure Payment</h2>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-slate-900 dark:text-white">{selectedService?.name}</span>
          <span className="font-black text-xl" style={{ color: business.primaryHex }}>${selectedService?.price}</span>
        </div>
        <div className="text-sm text-slate-500 space-y-1">
          <div>{selectedDate && new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div>{selectedTime} – {selectedService && addMinutes(selectedTime, selectedService.duration)} with {selectedStaff}</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-2xl">💳</span>
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">Credit / Debit Card</p>
            <p className="text-slate-400 text-xs">Visa, Mastercard, Amex</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-2xl">🍎</span>
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">Apple Pay</p>
            <p className="text-slate-400 text-xs">Available on supported devices</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-2xl">🔵</span>
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">Google Pay</p>
            <p className="text-slate-400 text-xs">Quick and secure checkout</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mb-6 flex items-center justify-center gap-1">
        🔒 Payments processed securely by Stripe. Your card details are never stored.
      </p>

      <div className="flex gap-3">
        <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium">
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ backgroundColor: business.primaryHex }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard size={16} />
              Pay ${selectedService?.price}
            </>
          )}
        </button>
      </div>
    </div>,
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Step indicator */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        {STEPS.map((name, i) => (
          <div
            key={name}
            className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${
              i === step ? 'border-current' : i < step ? 'border-green-500 text-green-600' : 'border-transparent text-slate-400'
            }`}
            style={i === step ? { borderColor: business.primaryHex, color: business.primaryHex } : {}}
          >
            {i < step ? '✓ ' : `${i + 1}. `}{name}
          </div>
        ))}
      </div>

      <div className="p-8">{stepContent[step]}</div>
    </div>
  )
}
