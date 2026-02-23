'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UserRow } from '@/types/database'

interface ProfileFormProps {
  user: Pick<UserRow, 'id' | 'display_name' | 'side_job_type' | 'side_job_start_year' | 'annual_income_range'>
}

const SIDE_JOB_TYPES = [
  'フリーランス案件',
  '物販・せどり',
  'シェアリングエコノミー',
  'コンテンツ販売',
  'その他',
] as const

const ANNUAL_INCOME_RANGES = [
  { value: '〜20万円', label: '〜20万円' },
  { value: '20〜100万円', label: '20〜100万円' },
  { value: '100万円以上', label: '100万円以上' },
] as const

const currentYear = new Date().getFullYear()
const START_YEARS = Array.from({ length: currentYear - 2014 }, (_, i) => 2015 + i)

export default function ProfileForm({ user }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(user.display_name ?? '')
  const [sideJobType, setSideJobType] = useState(user.side_job_type ?? '')
  const [sideJobStartYear, setSideJobStartYear] = useState(
    user.side_job_start_year ? String(user.side_job_start_year) : ''
  )
  const [annualIncomeRange, setAnnualIncomeRange] = useState(user.annual_income_range ?? '')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('users')
      .update({
        display_name: displayName || null,
        side_job_type: sideJobType || null,
        side_job_start_year: sideJobStartYear ? parseInt(sideJobStartYear, 10) : null,
        annual_income_range: annualIncomeRange || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setSaving(false)

    if (error) {
      toast.error('保存に失敗しました。再試行してください')
    } else {
      toast.success('プロフィールを保存しました')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 表示名 */}
      <div className="space-y-1.5">
        <Label htmlFor="display_name">表示名</Label>
        <Input
          id="display_name"
          type="text"
          placeholder="例: 田中 太郎"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 副業タイプ */}
      <div className="space-y-1.5">
        <Label htmlFor="side_job_type">副業タイプ</Label>
        <Select value={sideJobType} onValueChange={setSideJobType}>
          <SelectTrigger id="side_job_type" className="max-w-sm w-full">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {SIDE_JOB_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 副業開始年 */}
      <div className="space-y-1.5">
        <Label htmlFor="side_job_start_year">副業開始年</Label>
        <Select value={sideJobStartYear} onValueChange={setSideJobStartYear}>
          <SelectTrigger id="side_job_start_year" className="max-w-sm w-full">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {START_YEARS.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 想定年間収入 */}
      <div className="space-y-2">
        <Label>想定年間収入</Label>
        <div className="flex flex-col gap-2">
          {ANNUAL_INCOME_RANGES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="annual_income_range"
                value={value}
                checked={annualIncomeRange === value}
                onChange={() => setAnnualIncomeRange(value)}
                className="accent-green-600"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? '保存中...' : '保存する'}
      </Button>
    </form>
  )
}
