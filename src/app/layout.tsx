import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "副楽 — 副業サラリーマンの確定申告アプリ",
  description: "副業の収入・経費をかんたん管理。AIがレシートを自動読み取り、20万円ラインを監視。副業サラリーマン専用の確定申告アプリ。",
  openGraph: {
    title: "副楽 — 副業サラリーマンの確定申告アプリ",
    description: "副業の収入・経費をかんたん管理。AIがレシートを自動読み取り、20万円ラインを監視。",
    type: "website",
    locale: "ja_JP",
    siteName: "副楽",
  },
  twitter: {
    card: "summary_large_image",
    title: "副楽 — 副業サラリーマンの確定申告アプリ",
    description: "副業の収入・経費をかんたん管理。AIがレシートを自動読み取り、20万円ラインを監視。",
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
      </body>
    </html>
  );
}
