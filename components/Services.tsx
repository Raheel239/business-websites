import Link from 'next/link'
import { BusinessConfig } from '@/lib/businesses'
import { Clock, Star, ArrowRight } from 'lucide-react'

export function Services({ business }: { business: BusinessConfig }) {
  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: business.primaryHex }}
          >
            What We Offer
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Our Services
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Professional services tailored to your needs. All prices include any materials and finishing touches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {business.services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-opacity-60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ ['--accent' as any]: business.primaryHex }}
            >
              {service.popular && (
                <div
                  className="absolute -top-3 right-4 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: business.primaryHex }}
                >
                  <Star size={10} className="fill-white" />
                  Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-opacity-90">
                  {service.name}
                </h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <Clock size={14} />
                  <span>{service.duration < 60 ? `${service.duration} min` : `${Math.floor(service.duration / 60)}h${service.duration % 60 ? ` ${service.duration % 60}m` : ''}`}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ${service.price}
                </span>
                <Link
                  href={`/${business.slug}/book?service=${service.id}`}
                  className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full text-white transition-all hover:opacity-90 hover:gap-3"
                  style={{ backgroundColor: business.primaryHex }}
                >
                  Book
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
