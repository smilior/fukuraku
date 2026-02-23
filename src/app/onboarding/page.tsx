'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const SIDE_JOB_TYPES = [
  { value: 'freelance', label: 'フリーランス案件' },
  { value: 'resale', label: '物販・せどり' },
  { value: 'sharing', label: 'シェアリングエコノミー' },
  { value: 'content', label: 'コンテンツ販売' },
  { value: 'other', label: 'その他' },
]

const INCOME_RANGES = [
  { value: 'under_200k', label: '〜20万円' },
  { value: '200k_1m', label: '20〜100万円' },
  { value: 'over_1m', label: '100万円以上' },
]

const CURRENT_YEAR = new Date().getFullYear()
const START_YEARS = Array.from({ length: CURRENT_YEAR - 2014 }, (_, i) => CURRENT_YEAR - i)

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 2
  const [sideJobType, setSideJobType] = useState('')
  // Step 3
  const [displayName, setDisplayName] = useState('')
  const [startYear, setStartYear] = useState<number>(CURRENT_YEAR)
  const [incomeRange, setIncomeRange] = useState('')

  const progress = ((step - 1) / 2) * 100

  async function handleComplete() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    await supabase.from('users').update({
      display_name: displayName || null,
      onboarding_completed: true,
      side_job_type: sideJobType || null,
      side_job_start_year: startYear,
      annual_income_range: incomeRange || null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md">
        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>ステップ {step} / 3</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: ウェルカム */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-green-700">fukuraku</h1>
              <p className="text-gray-500 text-sm mt-1">ふくらく</p>
            </div>
            <p className="text-xl font-semibold text-gray-800">
              副業サラリーマンの<br />確定申告をかんたんに
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="font-medium">確定申告<br />かんたん</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl mb-1">📷</div>
                  <p className="font-medium">AI-OCR<br />自動読取</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <p className="font-medium">収支<br />自動集計</p>
                </CardContent>
              </Card>
            </div>
            <Button className="w-full" size="lg" onClick={() => setStep(2)}>
              はじめる
            </Button>
          </div>
        )}

        {/* Step 2: 副業タイプ選択 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">副業のタイプを教えてください</h2>
              <p className="text-sm text-gray-500 mt-1">最も近いものを選んでください</p>
            </div>
            <div className="space-y-3">
              {SIDE_JOB_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSideJobType(type.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    sideJobType === type.value
                      ? 'border-green-500 bg-green-50 text-green-800 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                戻る
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!sideJobType}
                className="flex-1"
              >
                次へ
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: 基本情報入力 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">基本情報を入力してください</h2>
              <p className="text-sm text-gray-500 mt-1">あとから設定で変更できます</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">表示名</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="例：田中 太郎"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="startYear">副業開始年</Label>
                <select
                  id="startYear"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {START_YEARS.map((year) => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>想定年間収入</Label>
                <div className="mt-2 space-y-2">
                  {INCOME_RANGES.map((range) => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="incomeRange"
                        value={range.value}
                        checked={incomeRange === range.value}
                        onChange={() => setIncomeRange(range.value)}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                戻る
              </Button>
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? '保存中...' : '完了'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
