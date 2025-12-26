import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Mandalart",
  description: "AI-powered personalized goal planning with Mandalart method",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="py-8 text-center border-t border-black/5 bg-white">
          <p className="text-sm text-black/50 mb-2">
            AI 활용에 관심 있다면 함께해요
          </p>
          <a
            href="https://open.kakao.com/o/gyWjLY6h"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
          >
            <span>Sense & AI 오픈채팅방</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </footer>
      </body>
    </html>
  );
}
