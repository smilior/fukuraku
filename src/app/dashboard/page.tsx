import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">副楽 ダッシュボード</h1>
          <LogoutButton />
        </div>
        <p className="text-gray-600">
          ようこそ、{user.email} さん
        </p>
        <p className="text-sm text-gray-400 mt-2">
          ダッシュボードは準備中です（Issue #5）
        </p>
      </div>
    </div>
  )
}
