import Link from 'next/link'
import { businesses } from '@/lib/businesses'

const icons: Record<string, string> = {
  cleaning: '🧹',
  carwash: '🚗',
  barber: '💈',
  massage: '💆',
  nails: '💅',
}

const gradients: Record<string, string> = {
  cleaning: 'from-blue-500 to-cyan-500',
  carwash: 'from-orange-500 to-amber-500',
  barber: 'from-zinc-700 to-yellow-700',
  massage: 'from-purple-600 to-fuchsia-600',
  nails: 'from-pink-500 to-rose-500',
}

export default function HomePage() {
  const allBusinesses = Object.values(businesses)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white mb-4">Business Demo Sites</h1>
        <p className="text-slate-400 text-xl">Select a business to view its website</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {allBusinesses.map((biz) => (
          <Link
            key={biz.slug}
            href={`/${biz.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[biz.slug]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="p-8">
              <div className="text-5xl mb-4">{icons[biz.slug]}</div>
              <h2 className="text-xl font-bold text-white mb-1">{biz.name}</h2>
              <p className="text-slate-400 text-sm mb-3">{biz.type}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{biz.tagline}</p>
              <div className="mt-6 flex items-center text-slate-300 group-hover:text-white text-sm font-medium transition-colors">
                View Site
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
