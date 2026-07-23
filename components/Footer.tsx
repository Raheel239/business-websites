import Link from 'next/link'
import { BusinessConfig } from '@/lib/businesses'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer({ business }: { business: BusinessConfig }) {
  return (
    <footer className="bg-slate-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-black mb-3">{business.name}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">{business.description}</p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Icon size={16} className="text-slate-300" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Services', 'Hours', 'Reviews'].map((item) => (
              <li key={item}>
                <Link href={`/${business.slug}#${item.toLowerCase()}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {item}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/${business.slug}/book`} className="text-sm font-bold" style={{ color: business.primaryHex }}>
                Book Now →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-4">Contact</h4>
          <ul className="space-y-3">
            <li>
              <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                <Phone size={14} /> {business.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                <Mail size={14} /> {business.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-slate-400 text-sm">
              <MapPin size={14} className="mt-0.5 shrink-0" /> {business.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
        <div className="flex gap-4 text-slate-500 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
