import { BusinessConfig } from '@/lib/businesses'

export function SpecialOffers({ business }: { business: BusinessConfig }) {
  const items = [...business.specialOffers, ...business.specialOffers, ...business.specialOffers]

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-y border-white/10 py-3 overflow-hidden">
      <div className="relative flex overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-0 shrink-0">
          {items.map((offer, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 shrink-0">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: business.primaryHex }}
              >
                {offer.badge}
              </span>
              <span className="text-white/90 text-sm font-medium">{offer.text}</span>
              <span className="text-white/20 ml-4">✦</span>
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee gap-0 shrink-0 absolute top-0" aria-hidden>
          {items.map((offer, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 shrink-0">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: business.primaryHex }}
              >
                {offer.badge}
              </span>
              <span className="text-white/90 text-sm font-medium">{offer.text}</span>
              <span className="text-white/20 ml-4">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
