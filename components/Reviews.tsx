'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BusinessConfig } from '@/lib/businesses'
import { Star, User } from 'lucide-react'
import toast from 'react-hot-toast'

type Review = {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string }
}

const SEED_REVIEWS: Record<string, Review[]> = {
  cleaning: [
    { id: '1', rating: 5, comment: 'Absolutely amazing service! My house has never been this clean. Sarah was professional and thorough.', createdAt: '2024-02-10', user: { name: 'Emma R.' } },
    { id: '2', rating: 5, comment: 'Used CleanPro for a move-out clean and got our full deposit back. Highly recommend!', createdAt: '2024-01-28', user: { name: 'David H.' } },
    { id: '3', rating: 4, comment: 'Very thorough deep clean, really happy with the results. Will be booking again monthly.', createdAt: '2024-01-15', user: { name: 'Sophie M.' } },
  ],
  carwash: [
    { id: '1', rating: 5, comment: 'My car looks brand new! The full valet was worth every penny. Carlos did an incredible job.', createdAt: '2024-02-12', user: { name: 'James T.' } },
    { id: '2', rating: 5, comment: 'Paint correction completely removed years of swirl marks. Genuinely impressed.', createdAt: '2024-02-01', user: { name: 'Lisa K.' } },
    { id: '3', rating: 5, comment: 'Quick, professional and great value. The express wash is perfect for a weekly refresh.', createdAt: '2024-01-20', user: { name: 'Mark B.' } },
  ],
  barber: [
    { id: '1', rating: 5, comment: 'Best fade in the city. Marcus knows exactly what he\'s doing. Won\'t go anywhere else.', createdAt: '2024-02-14', user: { name: 'Jordan W.' } },
    { id: '2', rating: 5, comment: 'Came in for the traditional wet shave — incredible experience. Felt like royalty.', createdAt: '2024-02-03', user: { name: 'Chris N.' } },
    { id: '3', rating: 4, comment: 'Clean shop, friendly staff and a great cut every time. Student discount is a bonus!', createdAt: '2024-01-22', user: { name: 'Tyler A.' } },
  ],
  massage: [
    { id: '1', rating: 5, comment: 'The deep tissue massage completely sorted out my back pain. Yuki is truly gifted. I feel amazing!', createdAt: '2024-02-11', user: { name: 'Anna P.' } },
    { id: '2', rating: 5, comment: 'Brought my partner for the couples massage — absolutely perfect. The studio is so relaxing.', createdAt: '2024-02-05', user: { name: 'Michael L.' } },
    { id: '3', rating: 5, comment: 'Monthly member and it is the best investment I make. Stress just melts away every visit.', createdAt: '2024-01-18', user: { name: 'Rachel G.' } },
  ],
  nails: [
    { id: '1', rating: 5, comment: 'Jade is an absolute artist! My nail art got so many compliments. Obsessed with the results!', createdAt: '2024-02-13', user: { name: 'Kayla D.' } },
    { id: '2', rating: 5, comment: 'My gel manicure lasted 4 weeks without chipping. The salon is gorgeous and so clean.', createdAt: '2024-02-04', user: { name: 'Stephanie O.' } },
    { id: '3', rating: 5, comment: 'First time doing acrylics and Mia made me feel so comfortable. They look stunning!', createdAt: '2024-01-25', user: { name: 'Brittany F.' } },
  ],
}

export function Reviews({ business }: { business: BusinessConfig }) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS[business.slug] || [])
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/reviews?business=${business.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews?.length) setReviews([...SEED_REVIEWS[business.slug], ...data.reviews])
      })
      .catch(() => {})
  }, [business.slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessSlug: business.slug, rating, comment }),
    })
    if (res.ok) {
      const { review } = await res.json()
      setReviews((prev) => [review, ...prev])
      setComment('')
      setRating(5)
      setShowForm(false)
      toast.success('Review submitted!')
    } else {
      toast.error('Failed to submit review')
    }
    setSubmitting(false)
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0'

  return (
    <section id="reviews" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: business.primaryHex }}>
            Client Love
          </span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">Reviews</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-bold text-xl">{avg}</span>
            <span className="text-slate-400">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 6).map((review) => (
            <div key={review.id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <User size={18} className="text-slate-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{review.user.name}</div>
                  <div className="text-slate-400 text-xs">{new Date(review.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>

        {session ? (
          showForm ? (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Leave a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setRating(s)}>
                      <Star size={28} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ ['--tw-ring-color' as any]: business.primaryHex }}
                  placeholder="Tell others about your experience..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                  style={{ backgroundColor: business.primaryHex }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: business.primaryHex }}
              >
                Write a Review
              </button>
            </div>
          )
        ) : (
          <p className="text-center text-slate-400 text-sm">
            <a href={`/${business.slug}/auth/login`} className="underline" style={{ color: business.primaryHex }}>Sign in</a> to leave a review
          </p>
        )}
      </div>
    </section>
  )
}
