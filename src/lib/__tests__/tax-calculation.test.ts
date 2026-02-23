import { describe, it, expect } from 'vitest'
import {
  requiresTaxFiling,
  calcWithholding,
  calcProgressPercent,
  TAX_THRESHOLD,
} from '@/lib/tax-calculation'

describe('requiresTaxFiling — 20万円ライン判定', () => {
  describe('申告が必要なケース', () => {
    it('副業所得が200,001円（20万円超）の場合、申告が必要', () => {
      const result = requiresTaxFiling(300_000, 99_999)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(200_001)
      expect(result.reason).toContain('確定申告が必要')
    })

    it('副業所得が100万円の場合、申告が必要', () => {
      const result = requiresTaxFiling(1_500_000, 500_000)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(1_000_000)
    })

    it('経費を引いても20万円超なら申告が必要', () => {
      const result = requiresTaxFiling(500_000, 250_000)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(250_000)
    })
  })

  describe('申告が不要なケース', () => {
    it('副業所得がちょうど20万円の場合、申告不要', () => {
      const result = requiresTaxFiling(200_000, 0)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(200_000)
      expect(result.reason).toContain('申告は不要')
      expect(result.reason).toContain('住民税')
    })

    it('副業所得が0円の場合、申告不要', () => {
      const result = requiresTaxFiling(0, 0)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(0)
    })

    it('副業所得が199,999円の場合、申告不要', () => {
      const result = requiresTaxFiling(199_999, 0)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(199_999)
    })

    it('経費を引いて20万円以下になる場合、申告不要', () => {
      const result = requiresTaxFiling(500_000, 350_000)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(150_000)
    })
  })

  describe('赤字のケース', () => {
    it('経費が収入を上回る場合（赤字）、申告不要', () => {
      const result = requiresTaxFiling(100_000, 200_000)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(-100_000)
      expect(result.reason).toContain('赤字')
      expect(result.reason).toContain('損失の繰越')
    })

    it('収入0で経費がある場合、赤字', () => {
      const result = requiresTaxFiling(0, 50_000)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(-50_000)
    })
  })

  describe('境界値テスト', () => {
    it('所得199,999円は申告不要', () => {
      expect(requiresTaxFiling(199_999, 0).required).toBe(false)
    })

    it('所得200,000円は申告不要', () => {
      expect(requiresTaxFiling(200_000, 0).required).toBe(false)
    })

    it('所得200,001円は申告必要', () => {
      expect(requiresTaxFiling(200_001, 0).required).toBe(true)
    })

    it('TAX_THRESHOLDは200,000円', () => {
      expect(TAX_THRESHOLD).toBe(200_000)
    })
  })
})

describe('calcWithholding — 源泉徴収税額計算', () => {
  it('100,000円 × 10.21% = 10,210円（切り捨て）', () => {
    expect(calcWithholding(100_000)).toBe(10_210)
  })

  it('1円の場合は0円（切り捨て）', () => {
    expect(calcWithholding(1)).toBe(0)
  })

  it('10円の場合は1円（10.21% → 1.021 → 切り捨て1）', () => {
    expect(calcWithholding(10)).toBe(1)
  })

  it('0円の場合は0円', () => {
    expect(calcWithholding(0)).toBe(0)
  })

  it('50,000円の場合は5,105円', () => {
    expect(calcWithholding(50_000)).toBe(5_105)
  })
})

describe('calcProgressPercent — 20万円バー進捗率', () => {
  it('0円は0%', () => {
    expect(calcProgressPercent(0)).toBe(0)
  })

  it('100,000円は50%', () => {
    expect(calcProgressPercent(100_000)).toBe(50)
  })

  it('200,000円は100%', () => {
    expect(calcProgressPercent(200_000)).toBe(100)
  })

  it('300,000円でも100%にクランプ', () => {
    expect(calcProgressPercent(300_000)).toBe(100)
  })

  it('マイナスは0%にクランプ', () => {
    expect(calcProgressPercent(-50_000)).toBe(0)
  })
})
