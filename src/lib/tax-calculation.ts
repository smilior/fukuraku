/**
 * 確定申告判定・税額計算ユーティリティ
 * 副業サラリーマン向け簡易計算（給与所得者のみ対象）
 */

export const TAX_THRESHOLD = 200_000 // 20万円

export interface TaxFilingResult {
  required: boolean
  netIncome: number
  reason: string
}

/**
 * 確定申告の要否を判定する
 * 給与所得者で副業の所得（収入−経費）が20万円超の場合に申告が必要
 */
export function requiresTaxFiling(
  totalIncome: number,
  totalExpense: number,
): TaxFilingResult {
  const netIncome = totalIncome - totalExpense

  if (netIncome < 0) {
    return {
      required: false,
      netIncome,
      reason: '赤字のため申告は不要ですが、損失の繰越には申告が必要な場合があります。',
    }
  }

  if (netIncome > TAX_THRESHOLD) {
    return {
      required: true,
      netIncome,
      reason: `副業所得が${netIncome.toLocaleString('ja-JP')}円のため、確定申告が必要です。`,
    }
  }

  return {
    required: false,
    netIncome,
    reason: '副業所得が20万円以下のため申告は不要です。ただし住民税の申告は必要な場合があります。',
  }
}

/**
 * 源泉徴収税額を計算する（10.21%）
 */
export function calcWithholding(amount: number): number {
  return Math.floor(amount * 0.1021)
}

/**
 * 20万円ラインの進捗率（0〜100%）を返す
 */
export function calcProgressPercent(netIncome: number): number {
  return Math.min(Math.max(Math.round((netIncome / TAX_THRESHOLD) * 100), 0), 100)
}
