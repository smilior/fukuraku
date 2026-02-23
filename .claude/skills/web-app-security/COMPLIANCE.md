# 個人情報保護法（APPI）対応

## 1. 収集する個人情報の種類と利用目的

副楽が収集・処理する個人情報:

| 情報の種類 | 利用目的 | 保存場所 |
|-----------|---------|---------|
| メールアドレス | アカウント認証、通知 | Supabase Auth |
| 氏名 | 確定申告書作成 | Supabase DB (users) |
| 副業収入データ | 所得計算、申告判定 | Supabase DB (incomes) |
| 経費データ | 所得計算、申告判定 | Supabase DB (expenses) |
| レシート画像 | OCR による経費入力 | Supabase Storage |
| 決済情報 | サブスク管理 | Stripe（副楽側に保存しない） |

---

## 2. プライバシーポリシーに必須の記載事項

```markdown
## プライバシーポリシー記載事項チェックリスト

- [ ] 事業者の名称と連絡先
- [ ] 個人情報の利用目的（上記テーブルの内容を明記）
- [ ] 第三者提供の有無（Stripe, OpenAI への送信を明記）
  - OpenAI: レシート画像の OCR 処理のため送信（APIポリシーにより学習に使用されない旨を明記）
  - Stripe: 決済処理のため必要最小限の情報を送信
- [ ] 個人情報の取り扱いの委託先
- [ ] 開示・訂正・削除請求の手続き
- [ ] 問い合わせ窓口
- [ ] Cookie の使用について
```

---

## 3. レシート画像の保存・削除方針

```typescript
// lib/receipt-lifecycle.ts

/**
 * レシート画像のライフサイクル管理
 *
 * 1. アップロード: ユーザーが撮影/選択 → Supabase Storage に保存
 * 2. OCR処理: OpenAI Vision API で読み取り → テキストデータを DB に保存
 * 3. 保存期間: 確定申告の法定保存期間（7年間）
 * 4. 削除: ユーザーリクエストまたは保存期間経過後
 */

import { createServiceClient } from '@/lib/supabase/service'

// ユーザーのデータ削除リクエスト処理
export async function handleDataDeletionRequest(userId: string) {
  const supabase = createServiceClient()

  // 1. レシート画像の削除
  const { data: receipts } = await supabase
    .from('receipts')
    .select('storage_path')
    .eq('user_id', userId)

  if (receipts && receipts.length > 0) {
    const paths = receipts.map(r => r.storage_path)
    await supabase.storage.from('receipts').remove(paths)
  }

  // 2. DB データの削除（カスケード設定に基づく）
  await supabase.from('receipts').delete().eq('user_id', userId)
  await supabase.from('expenses').delete().eq('user_id', userId)
  await supabase.from('incomes').delete().eq('user_id', userId)
  await supabase.from('tax_calculations').delete().eq('user_id', userId)

  // 3. ユーザーアカウントの無効化
  // Supabase Auth からの削除は Admin API で実行
  await supabase.auth.admin.deleteUser(userId)

  // 4. 監査ログに記録
  await supabase.from('audit_logs').insert({
    user_id: userId,
    event: 'data_delete_request',
    details: {
      receipts_deleted: receipts?.length ?? 0,
      completed_at: new Date().toISOString(),
    },
  })
}
```

---

## 4. データ保持期間のポリシー

```typescript
// lib/data-retention.ts

/**
 * データ保持期間ポリシー
 *
 * - 確定申告関連データ: 7年間（税法上の保存義務期間）
 * - レシート画像: 7年間
 * - 監査ログ: 90日間
 * - 退会済みユーザーデータ: 退会後30日以内に完全削除
 */

export const DATA_RETENTION_PERIODS = {
  taxData: 7 * 365,      // 7年（日数）
  receiptImages: 7 * 365, // 7年
  auditLogs: 90,          // 90日
  deletedUserData: 30,    // 30日
} as const

// 定期実行: 保存期間を超えたデータの削除
export async function cleanupExpiredData() {
  const supabase = createServiceClient()

  // 退会ユーザーのデータ削除（30日経過）
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DATA_RETENTION_PERIODS.deletedUserData)

  const { data: deletedUsers } = await supabase
    .from('users')
    .select('id')
    .eq('status', 'deleted')
    .lt('deleted_at', thirtyDaysAgo.toISOString())

  if (deletedUsers) {
    for (const user of deletedUsers) {
      await handleDataDeletionRequest(user.id)
    }
  }
}
```

---

## 5. OpenAI API へのデータ送信における注意事項

```typescript
// lib/openai/receipt-ocr.ts

/**
 * OpenAI API 利用時の個人情報保護対策
 *
 * 1. API経由のデータは OpenAI のモデル学習に使用されない（API ToS）
 * 2. レシート画像にマイナンバーなどが写り込まないよう注意喚起
 * 3. 送信データは必要最小限にする
 * 4. プライバシーポリシーに OpenAI へのデータ送信を明記
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // サーバーサイドのみ
})

export async function processReceiptImage(imageBase64: string) {
  // 画像サイズの制限（コスト削減 + データ最小化）
  // 最大 4MB, 解像度はリサイズ済みのものを使用

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `あなたはレシート読み取りアシスタントです。
レシート画像から以下の情報を抽出してJSON形式で返してください:
- store_name: 店舗名
- date: 日付（YYYY-MM-DD形式）
- total_amount: 合計金額（数値）
- items: 品目リスト（名前と金額）
- category_suggestion: 経費カテゴリの提案

個人情報（住所、電話番号など）は抽出しないでください。`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'low',  // コスト削減のため low detail を使用
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
    temperature: 0,  // 再現性のため温度を0に
  })

  return response.choices[0].message.content
}
```

---

## 6. セキュリティインシデント対応

### 6.1 インシデント発生時の手順

```markdown
## インシデント対応フロー

1. **検知**: 監査ログ、Supabase Logs、ユーザー報告
2. **評価**: 影響範囲の特定（何のデータが、何件漏洩したか）
3. **封じ込め**:
   - 該当 API キーの即座のローテーション
   - 不正アクセス元 IP のブロック
   - 必要に応じてサービスの一時停止
4. **根本原因分析**: 脆弱性の特定と修正
5. **通知**:
   - 個人情報漏洩の場合: 個人情報保護委員会への報告（72時間以内）
   - 影響を受けたユーザーへの通知
6. **復旧**: 修正のデプロイ、モニタリング強化
7. **振り返り**: 再発防止策の文書化
```

### 6.2 API キー漏洩時の緊急対応

```markdown
## API キー漏洩時の対応

### OpenAI API Key が漏洩した場合
1. OpenAI Dashboard で即座にキーを無効化
2. 新しいキーを生成
3. Vercel 環境変数を更新
4. 再デプロイ
5. OpenAI の Usage ログで不正利用を確認

### Supabase Service Role Key が漏洩した場合
1. Supabase Dashboard > Settings > API でキーをリセット
2. Vercel 環境変数を更新
3. 再デプロイ
4. DB のデータを確認（不正な変更がないか）
5. 影響を受けた可能性のあるユーザーに通知

### Stripe Secret Key が漏洩した場合
1. Stripe Dashboard でキーをローリング
2. Webhook Secret も更新
3. Vercel 環境変数を更新
4. 再デプロイ
5. 不正な決済や返金がないか確認
```
