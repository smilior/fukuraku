import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProfileForm from './profile-form'
import DeleteAccountButton from './delete-account-button'
import LogoutButton from '../dashboard/logout-button'
import BottomNav from '@/components/app/bottom-nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '設定 | fukuraku',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, display_name, side_job_type, side_job_start_year, annual_income_range')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-0 lg:pl-60">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-2xl mx-auto lg:max-w-5xl lg:px-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-[11px] text-slate-400 hover:text-slate-600">← ダッシュボード</Link>
            <h2 className="text-[17px] font-bold text-slate-900 mt-0.5">設定</h2>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto lg:max-w-2xl px-4 py-8 space-y-8">
        {/* プロフィール */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">プロフィール</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm user={profile} />
          </CardContent>
        </Card>

        <hr className="border-gray-200" />

        {/* データエクスポート */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">データエクスポート</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500">
              {currentYear}年の収支データを CSV ファイルとしてダウンロードできます。
            </p>
            <Button asChild variant="outline">
              <a href={`/api/summary/csv?year=${currentYear}`} download>
                CSV をダウンロード（{currentYear}年）
              </a>
            </Button>
          </CardContent>
        </Card>

        <hr className="border-gray-200" />

        {/* アカウント削除 */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base text-red-600">アカウント削除</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500">
              アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
            </p>
            <DeleteAccountButton />
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}
