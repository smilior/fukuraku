import Stripe from 'stripe'

// Fallback prevents build-time failure when env var is not set
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
})

export const PRICE_IDS = {
  basic:  process.env.STRIPE_PRICE_BASIC!,
  pro:    process.env.STRIPE_PRICE_PRO!,
  season: process.env.STRIPE_PRICE_SEASON!,
} as const

export type PlanKey = keyof typeof PRICE_IDS

export { PLAN_LABELS, PLAN_LIMITS } from '@/lib/plans'
