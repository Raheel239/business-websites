export type Service = {
  id: string
  name: string
  description: string
  duration: number
  price: number
  popular?: boolean
}

export type TimeSlot = string

export type BusinessHours = {
  [day: string]: { open: string; close: string; closed?: boolean }
}

export type SpecialOffer = {
  id: string
  text: string
  badge?: string
}

export type BusinessConfig = {
  slug: string
  name: string
  tagline: string
  description: string
  type: string
  heroImage: string
  primaryColor: string
  primaryHex: string
  accentColor: string
  accentHex: string
  phone: string
  email: string
  address: string
  services: Service[]
  hours: BusinessHours
  specialOffers: SpecialOffer[]
  staff: string[]
  heroGradient: string
  navbarBg: string
}

export const businesses: Record<string, BusinessConfig> = {
  cleaning: {
    slug: 'cleaning',
    name: 'CleanPro Services',
    tagline: 'Sparkling Clean, Every Time.',
    description:
      'Professional cleaning services for homes and offices. We bring the shine to your space using eco-friendly products and experienced staff.',
    type: 'Cleaning Services',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    primaryColor: 'blue',
    primaryHex: '#2563eb',
    accentColor: 'cyan',
    accentHex: '#06b6d4',
    phone: '+1 (555) 010-2030',
    email: 'hello@cleanproservices.com',
    address: '123 Pristine Ave, Cleanville, CV 10001',
    heroGradient: 'from-blue-900 via-blue-800 to-cyan-900',
    navbarBg: 'bg-blue-950',
    staff: ['Sarah M.', 'James K.', 'Lisa T.', 'Mike R.'],
    services: [
      {
        id: 'standard-clean',
        name: 'Standard Home Clean',
        description: 'Full clean of all rooms, dusting, vacuuming, mopping, and surface wipe-down.',
        duration: 120,
        price: 89,
        popular: true,
      },
      {
        id: 'deep-clean',
        name: 'Deep Clean',
        description: 'Intensive clean including inside appliances, behind furniture, and full bathroom scrub.',
        duration: 240,
        price: 189,
      },
      {
        id: 'move-in-out',
        name: 'Move In / Move Out Clean',
        description: 'Thorough top-to-bottom clean for property handover. Includes all cupboards and fixtures.',
        duration: 300,
        price: 249,
      },
      {
        id: 'office-clean',
        name: 'Office Cleaning',
        description: 'Professional office clean including desks, floors, bathrooms, and kitchen areas.',
        duration: 180,
        price: 149,
        popular: true,
      },
      {
        id: 'carpet-clean',
        name: 'Carpet Steam Cleaning',
        description: 'Hot water extraction carpet cleaning for up to 3 rooms.',
        duration: 120,
        price: 120,
      },
      {
        id: 'window-clean',
        name: 'Window Cleaning',
        description: 'Interior and exterior window cleaning, up to 10 windows.',
        duration: 90,
        price: 75,
      },
    ],
    hours: {
      Monday: { open: '07:00', close: '18:00' },
      Tuesday: { open: '07:00', close: '18:00' },
      Wednesday: { open: '07:00', close: '18:00' },
      Thursday: { open: '07:00', close: '18:00' },
      Friday: { open: '07:00', close: '18:00' },
      Saturday: { open: '08:00', close: '16:00' },
      Sunday: { open: '09:00', close: '14:00' },
    },
    specialOffers: [
      { id: '1', text: '🎉 20% OFF your first booking — Use code CLEAN20', badge: 'New Customer' },
      { id: '2', text: '✨ Book Deep Clean + Carpet Clean & save £50', badge: 'Bundle Deal' },
      { id: '3', text: '🌿 Eco-friendly products available on request at no extra cost', badge: 'Green' },
      { id: '4', text: '📅 Book 4 sessions upfront and get the 5th FREE', badge: 'Loyalty' },
      { id: '5', text: '⚡ Same-day availability — call us before 10am', badge: 'Urgent' },
    ],
  },

  carwash: {
    slug: 'carwash',
    name: 'AutoShine Car Wash',
    tagline: 'Drive In Dirty. Drive Out Dazzling.',
    description:
      'Premium hand car wash and detailing services. We treat every vehicle with care, from quick washes to full interior and exterior detailing.',
    type: 'Car Washing & Detailing',
    heroImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=80',
    primaryColor: 'orange',
    primaryHex: '#ea580c',
    accentColor: 'amber',
    accentHex: '#f59e0b',
    phone: '+1 (555) 020-4050',
    email: 'bookings@autoshinecarwash.com',
    address: '45 Motor Way, Driveton, DT 20202',
    heroGradient: 'from-orange-900 via-orange-800 to-amber-900',
    navbarBg: 'bg-orange-950',
    staff: ['Carlos V.', 'Tony B.', 'Damien W.', 'Priya S.'],
    services: [
      {
        id: 'express-wash',
        name: 'Express Wash',
        description: 'Quick exterior hand wash, rinse, and dry. Perfect for a fast refresh.',
        duration: 20,
        price: 15,
      },
      {
        id: 'full-wash',
        name: 'Full Hand Wash',
        description: 'Full exterior wash, wheel clean, tire dressing, and interior vacuum.',
        duration: 45,
        price: 35,
        popular: true,
      },
      {
        id: 'valet-basic',
        name: 'Mini Valet',
        description: 'Full hand wash plus interior wipe-down, glass clean, and air freshener.',
        duration: 75,
        price: 65,
      },
      {
        id: 'full-valet',
        name: 'Full Valet',
        description: 'Complete interior and exterior detail. Shampoo seats, polish paint, full wax.',
        duration: 180,
        price: 149,
        popular: true,
      },
      {
        id: 'paint-correction',
        name: 'Paint Correction',
        description: 'Machine polish to remove swirl marks, light scratches and restore shine.',
        duration: 240,
        price: 249,
      },
      {
        id: 'ceramic-coat',
        name: 'Ceramic Coating',
        description: 'Professional-grade ceramic coating for long-lasting paint protection.',
        duration: 480,
        price: 499,
      },
    ],
    hours: {
      Monday: { open: '08:00', close: '18:00' },
      Tuesday: { open: '08:00', close: '18:00' },
      Wednesday: { open: '08:00', close: '18:00' },
      Thursday: { open: '08:00', close: '18:00' },
      Friday: { open: '08:00', close: '18:00' },
      Saturday: { open: '07:30', close: '17:00' },
      Sunday: { open: '09:00', close: '15:00' },
    },
    specialOffers: [
      { id: '1', text: '🚗 First-time customers get a FREE interior vacuum with any wash', badge: 'Welcome' },
      { id: '2', text: '💎 Full Valet + Ceramic Coating — save $100 this month only!', badge: 'Limited' },
      { id: '3', text: '🎟️ Buy 5 Full Washes, get the 6th FREE — loyalty stamp card', badge: 'Loyalty' },
      { id: '4', text: '⭐ Refer a friend and both get 15% off your next visit', badge: 'Referral' },
      { id: '5', text: '🌟 Premium wax upgrade FREE on all Full Valeting until end of month', badge: 'Flash Sale' },
    ],
  },

  barber: {
    slug: 'barber',
    name: 'Elite Cuts Barbershop',
    tagline: 'Sharp Fades. Clean Lines. Elite Style.',
    description:
      'Award-winning barbershop delivering precision haircuts, beard grooming, and traditional wet shaves. Walk-ins welcome, appointments preferred.',
    type: 'Hairdressing & Barbering',
    heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80',
    primaryColor: 'yellow',
    primaryHex: '#d97706',
    accentColor: 'stone',
    accentHex: '#78716c',
    phone: '+1 (555) 030-6070',
    email: 'book@elitecutsbarber.com',
    address: '7 High Street, Trimville, TR 30303',
    heroGradient: 'from-stone-900 via-zinc-900 to-yellow-950',
    navbarBg: 'bg-zinc-950',
    staff: ['Marcus J.', 'Devon A.', 'Ricky O.', 'Kai H.'],
    services: [
      {
        id: 'haircut',
        name: 'Haircut',
        description: 'Scissor or clipper cut with wash, style, and finish.',
        duration: 30,
        price: 28,
        popular: true,
      },
      {
        id: 'fade',
        name: 'Skin Fade',
        description: 'Precision skin-to-grade fade, bespoke to your desired look.',
        duration: 45,
        price: 35,
        popular: true,
      },
      {
        id: 'cut-beard',
        name: 'Cut + Beard Trim',
        description: 'Full haircut combined with beard shaping and line-up.',
        duration: 60,
        price: 50,
      },
      {
        id: 'beard-trim',
        name: 'Beard Trim & Shape',
        description: 'Scissor and clipper beard shaping with hot towel finish.',
        duration: 30,
        price: 22,
      },
      {
        id: 'wet-shave',
        name: 'Traditional Wet Shave',
        description: 'Classic straight-razor shave with hot towels, pre-shave oil, and aftershave balm.',
        duration: 45,
        price: 40,
      },
      {
        id: 'kids-cut',
        name: "Kids Cut (Under 12)",
        description: 'Gentle, friendly haircut for children. Includes wash and style.',
        duration: 25,
        price: 18,
      },
    ],
    hours: {
      Monday: { open: '09:00', close: '19:00' },
      Tuesday: { open: '09:00', close: '19:00' },
      Wednesday: { open: '09:00', close: '19:00' },
      Thursday: { open: '09:00', close: '20:00' },
      Friday: { open: '09:00', close: '20:00' },
      Saturday: { open: '08:00', close: '18:00' },
      Sunday: { closed: true, open: '', close: '' },
    },
    specialOffers: [
      { id: '1', text: '💈 Students get 20% OFF with valid ID — every day!', badge: 'Student' },
      { id: '2', text: '👨‍👦 Kids cut FREE with any adult service on Saturdays', badge: 'Family' },
      { id: '3', text: '⚡ Book online and get a complimentary beard trim with your cut', badge: 'Online Bonus' },
      { id: '4', text: '🏆 Loyalty Card — 10th visit is FREE', badge: 'Loyalty' },
      { id: '5', text: '🎁 Gift vouchers available — the perfect present for him', badge: 'Gifts' },
    ],
  },

  massage: {
    slug: 'massage',
    name: 'Serenity Massage Studio',
    tagline: 'Restore. Relax. Renew.',
    description:
      'A tranquil haven offering professional therapeutic massage, deep tissue treatments, and holistic wellness therapies. Your stress ends here.',
    type: 'Massage & Wellness',
    heroImage: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=80',
    primaryColor: 'purple',
    primaryHex: '#7c3aed',
    accentColor: 'fuchsia',
    accentHex: '#a855f7',
    phone: '+1 (555) 040-8090',
    email: 'relax@serenitymassage.com',
    address: '22 Wellness Lane, Tranquilton, TQ 40404',
    heroGradient: 'from-purple-950 via-indigo-900 to-fuchsia-950',
    navbarBg: 'bg-purple-950',
    staff: ['Yuki T.', 'Amara N.', 'Sophie L.', 'Rafael M.'],
    services: [
      {
        id: 'swedish-60',
        name: 'Swedish Massage (60 min)',
        description: 'Classic relaxation massage using long gliding strokes to ease tension and improve circulation.',
        duration: 60,
        price: 75,
        popular: true,
      },
      {
        id: 'swedish-90',
        name: 'Swedish Massage (90 min)',
        description: 'Extended full-body Swedish massage for a deeper state of relaxation.',
        duration: 90,
        price: 105,
      },
      {
        id: 'deep-tissue',
        name: 'Deep Tissue Massage (60 min)',
        description: 'Targets deep muscle layers to release chronic tension and knots.',
        duration: 60,
        price: 90,
        popular: true,
      },
      {
        id: 'hot-stone',
        name: 'Hot Stone Massage',
        description: 'Warm basalt stones melt away tension while improving energy flow.',
        duration: 90,
        price: 120,
      },
      {
        id: 'couples',
        name: 'Couples Massage',
        description: 'Side-by-side 60-minute Swedish massage for two people in our couples suite.',
        duration: 60,
        price: 160,
      },
      {
        id: 'prenatal',
        name: 'Prenatal Massage',
        description: 'Safe, specialist massage designed for expectant mothers to relieve pregnancy discomfort.',
        duration: 60,
        price: 85,
      },
    ],
    hours: {
      Monday: { open: '10:00', close: '20:00' },
      Tuesday: { open: '10:00', close: '20:00' },
      Wednesday: { open: '10:00', close: '20:00' },
      Thursday: { open: '10:00', close: '21:00' },
      Friday: { open: '10:00', close: '21:00' },
      Saturday: { open: '09:00', close: '19:00' },
      Sunday: { open: '10:00', close: '17:00' },
    },
    specialOffers: [
      { id: '1', text: '💜 First visit special — 20% OFF any 60 or 90 minute massage', badge: 'Welcome' },
      { id: '2', text: '💑 Couples Package — 2x Swedish + Champagne for $280 (save $50)', badge: 'Romance' },
      { id: '3', text: '🌸 Monthly Membership — unlimited relaxation from $199/month', badge: 'Membership' },
      { id: '4', text: '🎁 Gift vouchers available — treat someone special', badge: 'Gift' },
      { id: '5', text: '⭐ Book 3 sessions and receive a complimentary aromatherapy upgrade', badge: 'Bundle' },
    ],
  },

  nails: {
    slug: 'nails',
    name: 'Luxe Nails & Beauty',
    tagline: 'Flawless Nails. Timeless Beauty.',
    description:
      'A premium nail salon offering gel, acrylic, nail art, and full beauty treatments. We use only top-quality products for stunning, long-lasting results.',
    type: 'Nail Salon & Beauty',
    heroImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80',
    primaryColor: 'pink',
    primaryHex: '#ec4899',
    accentColor: 'rose',
    accentHex: '#f43f5e',
    phone: '+1 (555) 050-1020',
    email: 'book@luxenailsbeauty.com',
    address: '88 Beauty Boulevard, Glamourton, GL 50505',
    heroGradient: 'from-pink-950 via-rose-900 to-fuchsia-950',
    navbarBg: 'bg-pink-950',
    staff: ['Jade L.', 'Mia C.', 'Tiffany H.', 'Destiny W.'],
    services: [
      {
        id: 'gel-manicure',
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish application with cuticle care and hand massage.',
        duration: 45,
        price: 42,
        popular: true,
      },
      {
        id: 'acrylic-full',
        name: 'Acrylic Full Set',
        description: 'Full acrylic nail extension set, shaped and polished to your preference.',
        duration: 90,
        price: 65,
        popular: true,
      },
      {
        id: 'nail-art',
        name: 'Nail Art Design',
        description: 'Custom hand-painted nail art, press-ons, gems, or foils. Per nail or full set.',
        duration: 60,
        price: 55,
      },
      {
        id: 'gel-pedicure',
        name: 'Gel Pedicure',
        description: 'Soak, exfoliate, cuticle work, massage, and long-lasting gel polish on toes.',
        duration: 60,
        price: 50,
      },
      {
        id: 'mani-pedi',
        name: 'Gel Mani & Pedi Combo',
        description: 'Full gel manicure and pedicure — our most popular treatment.',
        duration: 105,
        price: 85,
      },
      {
        id: 'infill',
        name: 'Acrylic Infill',
        description: 'Maintenance infill for existing acrylic set, rebalance and repaint.',
        duration: 60,
        price: 45,
      },
    ],
    hours: {
      Monday: { open: '09:30', close: '19:00' },
      Tuesday: { open: '09:30', close: '19:00' },
      Wednesday: { open: '09:30', close: '19:00' },
      Thursday: { open: '09:30', close: '20:00' },
      Friday: { open: '09:30', close: '20:00' },
      Saturday: { open: '09:00', close: '18:00' },
      Sunday: { open: '10:00', close: '16:00' },
    },
    specialOffers: [
      { id: '1', text: '💅 New clients — FREE nail art on any full set booking!', badge: 'Welcome' },
      { id: '2', text: '🌸 Mani & Pedi Combo — save $7 vs individual bookings', badge: 'Bundle' },
      { id: '3', text: '👯 Bring a friend and both receive 10% OFF', badge: 'Friends' },
      { id: '4', text: '🎂 Birthday month? Enjoy 20% OFF your entire visit', badge: 'Birthday' },
      { id: '5', text: '💎 Loyalty Card — every 5th gel manicure FREE', badge: 'Loyalty' },
    ],
  },
}

export function getBusinessConfig(slug: string): BusinessConfig | null {
  return businesses[slug] || null
}

export function generateTimeSlots(openTime: string, closeTime: string, durationMinutes: number): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)
  const openTotal = openH * 60 + openM
  const closeTotal = closeH * 60 + closeM

  for (let t = openTotal; t + durationMinutes <= closeTotal; t += 30) {
    const h = Math.floor(t / 60)
    const m = t % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return slots
}

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
