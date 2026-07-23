import { BusinessConfig } from '@/lib/businesses'
import { Clock } from 'lucide-react'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getTodayName() {
  return DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
}

export function BusinessHours({ business }: { business: BusinessConfig }) {
  const today = getTodayName()

  return (
    <section id="hours" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: business.primaryHex }}>
            When We're Open
          </span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">Business Hours</h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
          {DAY_ORDER.map((day, i) => {
            const hours = business.hours[day]
            const isToday = day === today
            return (
              <div
                key={day}
                className={`flex items-center justify-between px-6 py-4 ${
                  i < DAY_ORDER.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                } ${isToday ? 'bg-opacity-5' : ''}`}
                style={isToday ? { backgroundColor: `${business.primaryHex}15` } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-semibold text-slate-900 dark:text-white ${isToday ? 'font-black' : ''}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: business.primaryHex }}
                    >
                      Today
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hours.closed ? (
                    <span className="text-red-500 font-medium">Closed</span>
                  ) : (
                    <>
                      <Clock size={14} className="text-slate-400" />
                      <span className={`text-slate-600 dark:text-slate-400 ${isToday ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                        {hours.open} – {hours.close}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Walk-ins subject to availability. Booking online guarantees your slot.
        </p>
      </div>
    </section>
  )
}
