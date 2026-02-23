'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type OcrResult = {
  store_name: string | null
  date: string | null
  total_amount: number | null
  category: string | null
  confidence: 'high' | 'medium' | 'low'
}

type Stage = 'upload' | 'processing' | 'preview' | 'saving'

export default function ReceiptNewPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<Stage>('upload')
  const [preview, setPreview] = useState<string | null>(null)
  const [ocr, setOcr] = useState<OcrResult | null>(null)
  const [receiptId, setReceiptId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // フォーム編集用
  const [storeName, setStoreName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('その他')
  const [memo, setMemo] = useState('')

  const CATEGORIES = [
    '通信費', '消耗品費', '接待交際費', '交通費',
    '広告宣伝費', '外注費', '研修費', '地代家賃', 'その他',
  ]

  async function handleFileSelect(file: File) {
    const url = URL.createObjectURL(file)
    setPreview(url)
    setStage('processing')
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/ocr', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError('OCR に失敗しました。手動で入力してください。')
      setStage('preview')
      return
    }

    const result: OcrResult = data.ocr
    setOcr(result)
    setReceiptId(data.receipt?.id ?? null)

    // フォームに初期値をセット
    setStoreName(result.store_name ?? '')
    setDate(result.date ?? new Date().toISOString().split('T')[0])
    setAmount(result.total_amount ? String(result.total_amount) : '')
    setCategory(result.category ?? 'その他')
    setStage('preview')
  }

  async function handleConfirm() {
    if (!amount || !date) return
    setStage('saving')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: insertError } = await supabase.from('expenses').insert({
      user_id: user.id,
      date,
      amount: Number(amount),
      category: category as never,
      description: storeName || 'レシートより',
      memo: memo || null,
      receipt_id: receiptId,
    })

    if (insertError) {
      console.error(insertError)
      toast.error('保存に失敗しました。再試行してください')
      setStage('preview')
      return
    }

    toast.success('経費を追加しました')
    router.push('/expense')
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
          ← 戻る
        </button>
        <h1 className="text-xl font-bold mt-1">レシートを撮影・アップロード</h1>
      </div>

      {/* アップロード */}
      {stage === 'upload' && (
        <div className="space-y-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <span className="text-4xl">📷</span>
            <span className="font-medium text-gray-700">タップして撮影 / 画像を選択</span>
            <span className="text-xs text-gray-400">JPG / PNG / HEIC 対応</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
          />
        </div>
      )}

      {/* 処理中 */}
      {stage === 'processing' && (
        <div className="text-center py-12 space-y-4">
          {preview && (
            <img src={preview} alt="レシート" className="w-full max-h-64 object-contain rounded-lg mb-4" />
          )}
          <div className="text-2xl animate-pulse">🤖</div>
          <p className="font-medium text-gray-700">AIがレシートを読み取り中...</p>
          <p className="text-sm text-gray-400">2〜3秒かかります</p>
        </div>
      )}

      {/* プレビュー・確認 */}
      {stage === 'preview' && (
        <div className="space-y-5">
          {preview && (
            <img src={preview} alt="レシート" className="w-full max-h-48 object-contain rounded-lg border" />
          )}

          {ocr && (
            <div className={`text-xs px-3 py-1.5 rounded-full inline-block ${
              ocr.confidence === 'high' ? 'bg-green-100 text-green-700' :
              ocr.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-600'
            }`}>
              {ocr.confidence === 'high' ? '✓ 高精度で読み取りました' :
               ocr.confidence === 'medium' ? '⚠ 一部確認が必要です' :
               '⚠ 手動で確認してください'}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">内容を確認・修正してください</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">取引先・店舗名</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="例：コンビニ、電気屋"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="date">日付</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="amount">金額（円）</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">カテゴリ</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="memo">メモ（任意）</Label>
                <Input id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setStage('upload'); setPreview(null); setOcr(null) }} className="flex-1">
              やり直す
            </Button>
            <Button onClick={handleConfirm} disabled={!amount || !date} className="flex-1">
              経費として保存
            </Button>
          </div>
        </div>
      )}

      {stage === 'saving' && (
        <div className="text-center py-12">
          <p className="text-gray-600">保存中...</p>
        </div>
      )}
    </div>
  )
}
