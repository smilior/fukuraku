import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(160deg, #f8f7ff 0%, #eef2ff 50%, #f0fdf4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: 'rgba(79,70,229,0.06)', top: -180, right: -80 }} />
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(79,70,229,0.04)', bottom: -120, left: 320 }} />

        {/* ── Left: Text content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1, maxWidth: 580 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div
              style={{
                width: 52,
                height: 52,
                background: '#4F46E5',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
            </div>
            <span style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>副楽</span>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'white',
              border: '1px solid #c7d2fe',
              color: '#4F46E5',
              fontSize: 15,
              fontWeight: 700,
              padding: '7px 18px',
              borderRadius: 100,
              marginBottom: 28,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5' }} />
            副業サラリーマン専用 確定申告アプリ
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 22 }}>
            <span style={{ fontSize: 54, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              副業の確定申告を
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span
                style={{
                  fontSize: 54,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                15分
              </span>
              <span style={{ fontSize: 54, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                で終わらせよう
              </span>
            </div>
          </div>

          {/* Subtext */}
          <span style={{ fontSize: 20, color: '#64748B', lineHeight: 1.6 }}>
            会計知識ゼロ・3ステップで確定申告が完了
          </span>
        </div>

        {/* ── Right: Dashboard card ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            zIndex: 1,
            background: 'white',
            borderRadius: 24,
            padding: 30,
            border: '1px solid #e0e7ff',
            width: 390,
            boxShadow: '0 20px 60px rgba(79,70,229,0.12)',
          }}
        >
          {/* Income header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, color: '#94A3B8', marginBottom: 2 }}>副業所得（累計）</span>
              <span style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>¥156,800</span>
            </div>
            <div
              style={{
                background: '#EF4444',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 100,
              }}
            >
              要申告！
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ background: '#F1F5F9', borderRadius: 100, height: 14, overflow: 'hidden' }}>
              <div
                style={{
                  width: '78%',
                  height: '100%',
                  background: 'linear-gradient(to right, #FBBF24, #EF4444)',
                  borderRadius: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 7,
                }}
              >
                <span style={{ color: 'white', fontSize: 9, fontWeight: 700 }}>78%</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>¥0</span>
              <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>20万円ライン</span>
            </div>
          </div>

          {/* Income / Expense cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 12, padding: 14 }}>
              <span style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>副業収入</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', display: 'block' }}>¥192,000</span>
              <span style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>今月 +¥45K</span>
            </div>
            <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 12, padding: 14 }}>
              <span style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>経費合計</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', display: 'block' }}>¥35,200</span>
              <span style={{ fontSize: 10, color: '#F97316', fontWeight: 600 }}>今月 −¥8.4K</span>
            </div>
          </div>

          {/* Feature tags */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['AI-OCR', '20万円監視', 'CSV出力'].map((tag) => (
              <div
                key={tag}
                style={{
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 100,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
