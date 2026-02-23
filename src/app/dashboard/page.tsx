import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/app/bottom-nav'
import ThresholdCard from './_components/threshold-card'
import SummaryGrid from './_components/summary-grid'
import ChartSection from './_components/chart-section'
import RecentTransactions from './_components/recent-transactions'

interface PageProps {
  searchParams: Promise<{ chartYear?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('onboarding_completed, display_name')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  const params = await searchParams
  const now = new Date()
  const year = now.getFullYear()

  const chartYear = (() => {
    const y = parseInt(params.chartYear ?? '', 10)
    return Number.isFinite(y) && y >= 2020 && y <= year ? y : year
  })()

  const displayName = profile?.display_name ?? user.email ?? 'ユーザー'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="bg-[#F8FAFC] min-h-screen lg:pl-60">
      {/* Header + Threshold card */}
      <Suspense fallback={
        <>
          <header className="bg-white border-b border-slate-100 px-5 py-4">
            <div className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">こんにちは</p>
                <h1 className="text-[17px] font-bold text-slate-900">{displayName} さん</h1>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-slate-100 rounded-full" />
                <div className="flex items-center justify-center w-9 h-9 bg-indigo-100 rounded-full text-indigo-600 font-bold text-[13px]">
                  {initials}
                </div>
              </div>
            </div>
          </header>
          <div className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 px-4 pt-3">
            <div className="h-[220px] bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </>
      }>
        <ThresholdCard userId={user.id} year={year} displayName={displayName} initials={initials} />
      </Suspense>

      <main className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 px-4 pt-3 pb-24 lg:pb-8">
        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start mt-3">

          {/* Left column */}
          <div className="space-y-3">
            <Suspense fallback={<div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />}>
              <SummaryGrid userId={user.id} year={year} />
            </Suspense>
          </div>

          {/* Right column */}
          <div className="space-y-3">
            <Suspense fallback={<div className="h-[200px] bg-slate-200 rounded-2xl animate-pulse" />}>
              <ChartSection userId={user.id} year={chartYear} currentYear={year} />
            </Suspense>

            <Suspense fallback={<div className="h-48 bg-slate-200 rounded-2xl animate-pulse" />}>
              <RecentTransactions userId={user.id} />
            </Suspense>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
