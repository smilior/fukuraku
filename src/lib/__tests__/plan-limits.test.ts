import { describe, it, expect } from 'vitest'
import { PLAN_LIMITS, PLAN_LABELS } from '@/lib/plans'

describe('PLAN_LIMITS — プラン別件数上限', () => {
  it('free は年10件', () => {
    expect(PLAN_LIMITS.free).toBe(10)
  })

  it('basic は年100件', () => {
    expect(PLAN_LIMITS.basic).toBe(100)
  })

  it('pro は無制限', () => {
    expect(PLAN_LIMITS.pro).toBe(Infinity)
  })

  it('season は無制限', () => {
    expect(PLAN_LIMITS.season).toBe(Infinity)
  })

  it('free < basic < pro', () => {
    expect(PLAN_LIMITS.free).toBeLessThan(PLAN_LIMITS.basic)
    expect(PLAN_LIMITS.basic).toBeLessThan(PLAN_LIMITS.pro)
  })
})

describe('PLAN_LABELS — プラン表示名', () => {
  it('free → 無料', () => {
    expect(PLAN_LABELS.free).toBe('無料')
  })

  it('basic → ベーシック', () => {
    expect(PLAN_LABELS.basic).toBe('ベーシック')
  })

  it('pro → プロ', () => {
    expect(PLAN_LABELS.pro).toBe('プロ')
  })

  it('season → シーズンパス', () => {
    expect(PLAN_LABELS.season).toBe('シーズンパス')
  })
})
