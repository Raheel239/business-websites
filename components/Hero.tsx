import Link from 'next/link'
import { BusinessConfig } from '@/lib/businesses'
import { Star, Phone, MapPin } from 'lucide-react'

export function Hero({ business }: { business: BusinessConfig }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${business.heroImage})` }}
      />
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${business.heroGradient} opacity-90`} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-medium">{business.type}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
          {business.name}
        </h1>
        <p className="text-2xl md:text-3xl font-light text-white/90 mb-4 italic">
          "{business.tagline}"
        </p>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {business.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href={`/${business.slug}/book`}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: business.primaryHex }}
          >
            Book Appointment
          </Link>
          <Link
            href={`/${business.slug}#services`}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
          >
            View Services
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm">
          <a href={`tel:${business.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={16} />
            {business.phone}
          </a>
          <span className="hidden sm:block text-white/30">•</span>
          <span className="flex items-center gap-2">
            <MapPin size={16} />
            {business.address}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-white/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
      </div>
    </section>
  )
}
