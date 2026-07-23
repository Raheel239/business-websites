import { Suspense } from 'react'
import { LoginContent } from './LoginContent'

export default function LoginPage({ params }: { params: { business: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950" />}>
      <LoginContent businessSlug={params.business} />
    </Suspense>
  )
}
