import { notFound } from 'next/navigation'
import { getBusinessConfig } from '@/lib/businesses'
import { Hero } from '@/components/Hero'
import { SpecialOffers } from '@/components/SpecialOffers'
import { Services } from '@/components/Services'
import { BusinessHours } from '@/components/BusinessHours'
import { Reviews } from '@/components/Reviews'
import { Footer } from '@/components/Footer'

export default function BusinessPage({ params }: { params: { business: string } }) {
  const business = getBusinessConfig(params.business)
  if (!business) notFound()

  return (
    <>
      <Hero business={business} />
      <SpecialOffers business={business} />
      <Services business={business} />
      <BusinessHours business={business} />
      <Reviews business={business} />
      <Footer business={business} />
    </>
  )
}

export function generateMetadata({ params }: { params: { business: string } }) {
  const business = getBusinessConfig(params.business)
  if (!business) return {}
  return {
    title: `${business.name} — Book Online`,
    description: business.description,
  }
}
