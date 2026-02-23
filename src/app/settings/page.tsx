import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProfileForm from './profile-form'
import DeleteAccountButton from './delete-account-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '設定 | 副楽',
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
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-green-700">
            副楽
          </Link>
          <span className="text-sm text-gray-500">設定</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
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
    </div>
  )
}
