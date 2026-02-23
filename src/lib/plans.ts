/**
 * プラン定義（Stripeクライアント不要）
 * テスト・クライアントコンポーネントからも安全にインポート可能
 */

export const PLAN_LABELS: Record<string, string> = {
  free:   '無料',
  basic:  'ベーシック',
  pro:    'プロ',
  season: 'シーズンパス',
}

/** 年間件数上限 (free: 10, basic: 100, pro/season: Infinity) */
export const PLAN_LIMITS: Record<string, number> = {
  free:   10,
  basic:  100,
  pro:    Infinity,
  season: Infinity,
}
