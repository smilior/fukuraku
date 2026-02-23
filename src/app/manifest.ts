import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'fukuraku — 副業確定申告アプリ',
    short_name: 'fukuraku',
    description: '副業の収入・経費をかんたん管理。AIがレシートを自動読み取り、20万円ラインを監視。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16a34a',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['finance', 'productivity'],
    lang: 'ja',
  }
}
