'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import { BusinessConfig } from '@/lib/businesses'
import { useState } from 'react'
import { Menu, X, User, Calendar, LogOut, Settings } from 'lucide-react'

export function Navbar({ business }: { business: BusinessConfig }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const isAdmin =
    (session?.user as any)?.role === 'admin' &&
    (session?.user as any)?.businessSlug === business.slug

  return (
    <nav className={`${business.navbarBg} sticky top-0 z-50 border-b border-white/10 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${business.slug}`} className="flex items-center gap-2">
            <span className="text-white font-black text-xl tracking-tight">{business.name}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href={`/${business.slug}#services`} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Services
            </Link>
            <Link href={`/${business.slug}#hours`} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Hours
            </Link>
            <Link href={`/${business.slug}#reviews`} className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              Reviews
            </Link>
            <Link
              href={`/${business.slug}/book`}
              className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all"
            >
              Book Now
            </Link>
            {session ? (
              <div className="flex items-center gap-3">
                <Link href={`/${business.slug}/account`} className="text-white/80 hover:text-white flex items-center gap-1 text-sm">
                  <User size={16} /> Account
                </Link>
                {isAdmin && (
                  <Link href={`/${business.slug}/admin`} className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm">
                    <Settings size={16} /> Admin
                  </Link>
                )}
                <button onClick={() => signOut()} className="text-white/60 hover:text-white flex items-center gap-1 text-sm">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <Link href={`/${business.slug}/auth/login`} className="text-white/80 hover:text-white flex items-center gap-1 text-sm">
                <User size={16} /> Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)} className="text-white p-2">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/40 backdrop-blur border-t border-white/10 px-4 py-4 space-y-3">
          <Link href={`/${business.slug}#services`} onClick={() => setOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
            Services
          </Link>
          <Link href={`/${business.slug}#hours`} onClick={() => setOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
            Hours
          </Link>
          <Link href={`/${business.slug}#reviews`} onClick={() => setOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
            Reviews
          </Link>
          <Link href={`/${business.slug}/book`} onClick={() => setOpen(false)} className="block bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold text-center">
            Book Now
          </Link>
          {session ? (
            <>
              <Link href={`/${business.slug}/account`} onClick={() => setOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
                My Account
              </Link>
              {isAdmin && (
                <Link href={`/${business.slug}/admin`} onClick={() => setOpen(false)} className="block text-yellow-400 text-sm py-2">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { signOut(); setOpen(false) }} className="block text-white/60 text-sm py-2 w-full text-left">
                Sign Out
              </button>
            </>
          ) : (
            <Link href={`/${business.slug}/auth/login`} onClick={() => setOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
