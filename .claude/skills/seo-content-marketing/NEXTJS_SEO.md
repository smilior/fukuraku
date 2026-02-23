# Next.js App Router SEO設定（Metadata API, サイトマップ, JSON-LD）

## Metadata API の基本設定

```typescript
// app/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  // 基本メタデータ
  title: {
    default: "副楽 | 副業サラリーマンのAI確定申告アプリ",
    template: "%s | 副楽",
  },
  description:
    "レシートを撮るだけでAIが経費を自動分類。副業サラリーマン専用の確定申告支援アプリ。20万円ラインの自動監視、経費の自動分類で確定申告の準備を3分で完了。",

  // キーワード（SEO効果は限定的だが設定推奨）
  keywords: [
    "副業",
    "確定申告",
    "経費管理",
    "AI",
    "レシート",
    "副業サラリーマン",
    "20万円",
    "確定申告アプリ",
  ],

  // 著者情報
  authors: [{ name: "副楽" }],
  creator: "副楽",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://fukuraku.app",
    siteName: "副楽",
    title: "副楽 | 副業サラリーマンのAI確定申告アプリ",
    description:
      "レシートを撮るだけでAIが経費を自動分類。副業サラリーマン専用の確定申告支援アプリ。",
    images: [
      {
        url: "https://fukuraku.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "副楽 - 副業サラリーマンのAI確定申告アプリ",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "副楽 | 副業サラリーマンのAI確定申告アプリ",
    description:
      "レシートを撮るだけでAIが経費を自動分類。副業サラリーマン専用の確定申告支援アプリ。",
    images: ["https://fukuraku.app/og-image.png"],
    creator: "@fukuraku_app",
  },

  // その他
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Google Search Console の認証コード",
  },
};
```

---

## 各ページのメタデータ設定

```typescript
// app/blog/[slug]/page.tsx

import type { Metadata } from "next";

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["副楽"],
      images: [
        {
          url: post.ogImage || "https://fukuraku.app/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
```

```typescript
// app/pricing/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン",
  description:
    "副楽の料金プラン。フリープランは無料。プロプランは月額980円で全機能が使えます。副業サラリーマンに最適な確定申告アプリ。",
  openGraph: {
    title: "料金プラン | 副楽",
    description:
      "フリープラン：無料、プロプラン：月額980円。副業サラリーマン専用の確定申告アプリ。",
  },
};
```

---

## サイトマップの生成

```typescript
// app/sitemap.ts

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ブログ記事の一覧を取得
  const posts = await getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `https://fukuraku.app/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://fukuraku.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://fukuraku.app/pricing",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://fukuraku.app/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://fukuraku.app/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://fukuraku.app/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...blogEntries,
  ];
}
```

---

## robots.txt の設定

```typescript
// app/robots.ts

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/settings/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://fukuraku.app/sitemap.xml",
  };
}
```

---

## 構造化データ（JSON-LD）

```typescript
// app/layout.tsx に追加

// WebSite 構造化データ
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "副楽",
  url: "https://fukuraku.app",
  description:
    "副業サラリーマン専用のAI確定申告支援アプリ",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fukuraku.app/blog?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// SoftwareApplication 構造化データ
const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "副楽",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      name: "フリープラン",
    },
    {
      "@type": "Offer",
      price: "980",
      priceCurrency: "JPY",
      name: "プロプラン",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: "XX", // 実際のレビュー数
  },
};

// ブログ記事の構造化データ
function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "副楽",
      logo: {
        "@type": "ImageObject",
        url: "https://fukuraku.app/logo.png",
      },
    },
    image: post.ogImage,
    description: post.excerpt,
  };
}

// FAQ構造化データ（LPのFAQセクション用）
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "本当に無料で使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。フリープランは無料で、月5枚までのレシート登録と基本的な経費管理機能をご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "税理士の代わりになりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "いいえ。副楽は経費の記録・管理を効率化するツールです。個別の税務相談は税理士にご依頼ください。",
      },
    },
    // 他のFAQ項目...
  ],
};
```

---

## OGP設定

### OG画像の最適サイズ

**推奨サイズ：**
- og:image: 1200 x 630px（1.91:1 の比率）
- Twitter Card: 同サイズでOK（summary_large_image の場合）

**デザインのポイント：**
- 背景にブランドカラーを使用
- サービス名（副楽）を大きく表示
- キャッチコピーを含める
- アプリのスクリーンショット（小さめ）を配置
- テキストは画像の中央に配置（SNSの表示切れ対策）

### Vercel OG Image 生成

```typescript
// app/api/og/route.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "副楽";
  const description =
    searchParams.get("description") ||
    "副業サラリーマンのAI確定申告アプリ";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A",
          padding: "40px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            {description}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "40px",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#3B82F6",
              }}
            >
              副楽
            </span>
            <span style={{ fontSize: "20px", color: "#64748B" }}>
              fukuraku.app
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**ブログ記事のOG画像を動的生成：**
```typescript
// app/blog/[slug]/opengraph-image.tsx

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#0F172A",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            color: "#3B82F6",
            marginBottom: "16px",
          }}
        >
          副楽 ブログ
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#FFFFFF",
            lineHeight: 1.3,
            maxWidth: "900px",
          }}
        >
          {post.title}
        </h1>
        <div
          style={{
            fontSize: "18px",
            color: "#64748B",
            marginTop: "24px",
          }}
        >
          fukuraku.app/blog/{params.slug}
        </div>
      </div>
    ),
    size
  );
}
```

---

## パフォーマンス最適化（Core Web Vitals）

SEOランキングに影響するCore Web Vitalsの最適化ポイント：

```typescript
// next.config.ts での画像最適化

import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // 実験的機能
  experimental: {
    optimizeCss: true, // CSS最適化
  },
};

export default config;
```

**パフォーマンスチェックリスト：**
- [ ] LCP（Largest Contentful Paint）: 2.5秒以内
- [ ] INP（Interaction to Next Paint）: 200ms以内
- [ ] CLS（Cumulative Layout Shift）: 0.1以内
- [ ] 画像は next/image でWebP/AVIF変換
- [ ] フォントは next/font でサブセット化
- [ ] 不要なJavaScriptのバンドルサイズを削減
- [ ] サーバーコンポーネントを活用してクライアントJSを削減

---

## SEO実装チェックリスト

### リリース前チェック

- [ ] Metadata API で全ページのtitle/descriptionを設定
- [ ] OGP画像を全ページに設定
- [ ] sitemap.xml が正しく生成される
- [ ] robots.txt で不要なページ（/dashboard/, /api/）をブロック
- [ ] 構造化データ（JSON-LD）を設置
- [ ] Google Search Console にサイトを登録
- [ ] Google Analytics 4 を設置
- [ ] Core Web Vitals のスコアが良好（Lighthouse 90+）
- [ ] モバイル対応（レスポンシブ）が完了
- [ ] canonical URL が正しく設定されている
- [ ] 404ページがカスタマイズされている
- [ ] 内部リンク構造が適切

### リリース後チェック（月次）

- [ ] Search Console でインデックス状況を確認
- [ ] 主要キーワードの掲載順位を記録
- [ ] 新規記事がインデックスされたことを確認
- [ ] エラーページが発生していないか
- [ ] Core Web Vitals に問題がないか
- [ ] 外部リンク（被リンク）の増加状況
