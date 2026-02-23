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
  const { success } = await rateLimit(`ocr:${user.id}`, { maxRequests: 10, windowMs: 60_000 })
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 413 })
  }

  // Magic bytes validation (read first 4 bytes)
  const bytes = await file.arrayBuffer()
  const header = new Uint8Array(bytes.slice(0, 4))
  const isJpeg = header[0] === 0xFF && header[1] === 0xD8
  const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47
  const isWebp = header[0] === 0x52 && header[1] === 0x49 // RIFF
  // HEIC detection is complex, skip magic bytes for HEIC, use MIME type only
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif'

  if (!ALLOWED_MIME_TYPES.includes(file.type) && !isJpeg && !isPng && !isWebp && !isHeic) {
    return NextResponse.json({ error: '画像ファイル（JPEG・PNG・WebP・HEIC）のみ対応しています' }, { status: 400 })
  }

  // Supabase Storage にアップロード
  const serviceClient = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${user.id}/${Date.now()}.${ext}`

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
  let ocrData: z.infer<typeof OcrResultSchema> | null = null
  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      experimental_output: Output.object({ schema: OcrResultSchema }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `あなたは日本のレシート・領収書を読み取るOCR専門家です。
以下の画像を分析し、情報を抽出してください。

## 読み取りルール
- store_name: 店舗名（上部に記載されていることが多い）
- date: 日付をYYYY-MM-DD形式で（和暦は西暦に変換。例: 令和6年→2024年）
- total_amount: 合計金額（円単位の整数。税込合計を優先。「合計」「お買上合計」等の行を参照）
- category: 以下から最も適切なカテゴリを選択
  - 通信費: 携帯・インターネット・電話
  - 消耗品費: 文房具・日用品・10万円未満の備品
  - 接待交際費: 飲食店・カフェ（打ち合わせ目的）
  - 交通費: 電車・バス・タクシー・駐車場
  - 広告宣伝費: 広告・チラシ・名刺
  - 外注費: 外部サービス・業務委託
  - 研修費: 書籍・セミナー・勉強会
  - 地代家賃: 家賃・コワーキングスペース
  - その他: 上記に該当しないもの
- confidence: 読み取り精度（high/medium/low）

## 注意
- 金額は必ず整数（小数点不可）
- 税込合計がある場合はそちらを使用
- 日付が不明な場合はnullを返す（推測しない）`,
            },
            { type: 'image', image: new URL(publicUrl) },
          ],
        },
      ],
    })
    ocrData = result.experimental_output ?? null
  } catch (ocrError) {
    console.error('OCR processing error:', ocrError)
  }
  const ocrResult = ocrData ? {
    date:     ocrData.date     ?? undefined,
    amount:   ocrData.total_amount ?? undefined,
    vendor:   ocrData.store_name ?? undefined,
    category: ocrData.category as import('@/types/database').ExpenseCategory ?? undefined,
  } : null

  const { data: receipt } = await supabase.from('receipts').insert({
    user_id: user.id,
    storage_path: storagePath,
    ocr_status: ocrData ? 'done' : 'error',
    ocr_result: ocrResult,
    extracted_date: ocrData?.date ?? null,
    extracted_amount: ocrData?.total_amount ?? null,
    extracted_vendor: ocrData?.store_name ?? null,
  }).select().single()

  return NextResponse.json({ receipt, ocr: ocrData })
}
