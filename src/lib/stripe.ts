import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export const PRICE_IDS = {
  basic:  process.env.STRIPE_PRICE_BASIC!,
  pro:    process.env.STRIPE_PRICE_PRO!,
  season: process.env.STRIPE_PRICE_SEASON!,
} as const

export type PlanKey = keyof typeof PRICE_IDS

/** plan カラムの値から表示名を返す */
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
