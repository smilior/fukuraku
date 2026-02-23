import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { openai } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

const OcrResultSchema = z.object({
  store_name:  z.string().nullable().describe('店舗名・取引先名'),
  date:        z.string().nullable().describe('日付 YYYY-MM-DD 形式'),
  total_amount: z.number().nullable().describe('合計金額（円）'),
  category:    z.enum([
    '通信費', '消耗品費', '接待交際費', '交通費',
    '広告宣伝費', '外注費', '研修費', '地代家賃', 'その他',
  ]).describe('最適な経費カテゴリ'),
  confidence:  z.enum(['high', 'medium', 'low']).describe('読み取り精度'),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 10 requests per minute per user
  const { success } = rateLimit(`ocr:${user.id}`, { maxRequests: 10, windowMs: 60_000 })
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Supabase Storage にアップロード
  const serviceClient = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${user.id}/${Date.now()}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await serviceClient.storage
    .from('receipts')
    .upload(storagePath, bytes, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // Storage から公開 URL を取得（一時 URL）
  const { data: { publicUrl } } = serviceClient.storage
    .from('receipts')
    .getPublicUrl(storagePath)

  // GPT-4o Vision で OCR（Output API 使用）
  const result = await generateText({
    model: openai('gpt-4o'),
    experimental_output: Output.object({ schema: OcrResultSchema }),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `このレシートまたは領収書を読み取り、以下の情報をJSON形式で返してください。
日本語のレシートです。金額は円単位の数値で返してください。
日付が読み取れない場合は今日の日付を推定してください。`,
          },
          { type: 'image', image: new URL(publicUrl) },
        ],
      },
    ],
  })

  // receipts テーブルに記録
  const ocrData = result.experimental_output
  const ocrResult = ocrData ? {
    date:     ocrData.date     ?? undefined,
    amount:   ocrData.total_amount ?? undefined,
    vendor:   ocrData.store_name ?? undefined,
    category: ocrData.category as import('@/types/database').ExpenseCategory ?? undefined,
  } : null

  const { data: receipt } = await supabase.from('receipts').insert({
    user_id: user.id,
    storage_path: storagePath,
    ocr_status: 'done',
    ocr_result: ocrResult,
    extracted_date: ocrData?.date ?? null,
    extracted_amount: ocrData?.total_amount ?? null,
    extracted_vendor: ocrData?.store_name ?? null,
  }).select().single()

  return NextResponse.json({ receipt, ocr: ocrData })
}
