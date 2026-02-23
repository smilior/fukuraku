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
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 100px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(83, 52, 131, 0.25)',
            top: -100,
            right: 200,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(15, 52, 96, 0.4)',
            bottom: -80,
            left: 350,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.06)',
            top: 60,
            right: 480,
          }}
        />

        {/* Left: Text content */}
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '6px 20px',
              borderRadius: 20,
              marginBottom: 28,
            }}
          >
            副業サラリーマン専用 確定申告アプリ
          </div>

          {/* App name */}
          <div
            style={{
              display: 'flex',
              fontSize: 108,
              fontWeight: 900,
              letterSpacing: '0.06em',
              lineHeight: 1,
              marginBottom: 28,
            }}
          >
            <span style={{ color: '#ffffff' }}>副</span>
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              楽
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 30,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.04em',
              lineHeight: 1.6,
              gap: 4,
            }}
          >
            <span>レシートを撮るだけ。</span>
            <span style={{ color: '#a78bfa' }}>確定申告の準備が終わる。</span>
          </div>
        </div>

        {/* Right: Feature pills */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 16,
            zIndex: 1,
          }}
        >
          {[
            { icon: '📷', text: 'AIレシートOCRで自動分類' },
            { icon: '📊', text: '20万円ラインを自動監視' },
            { icon: '✅', text: '確定申告書類を自動生成' },
          ].map((f) => (
            <div
              key={f.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '14px 24px',
                width: 340,
              }}
            >
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                }}
              >
                {f.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
