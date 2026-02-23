import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "fukuraku | 副業サラリーマンのAI確定申告アプリ",
    template: "%s | fukuraku",
  },
  description:
    "レシートを撮るだけでAIが経費を自動分類。副業サラリーマン専用の確定申告支援アプリ。20万円ラインの自動監視、経費の自動分類で確定申告の準備を3分で完了。",
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
  authors: [{ name: "fukuraku" }],
  creator: "fukuraku",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://fukuraku.smilior.com",
    siteName: "fukuraku",
    title: "fukuraku | 副業サラリーマンのAI確定申告アプリ",
    description:
      "レシートを撮るだけでAIが経費を自動分類。副業サラリーマン専用の確定申告支援アプリ。",
  },
  twitter: {
    card: "summary_large_image",
    title: "fukuraku | 副業サラリーマンのAI確定申告アプリ",
    description:
      "レシートを撮るだけでAIが経費を自動分類。副業サラリーマン専用の確定申告支援アプリ。",
    creator: "@fukuraku_app",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
