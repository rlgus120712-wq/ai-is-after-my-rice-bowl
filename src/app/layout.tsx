import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navigation from '@/components/Navigation'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AI가 내 밥그릇을 노린다',
    template: '%s | AI가 내 밥그릇을 노린다',
  },
  description: '최신 AI 기술 트렌드와 AI 시대 개발자 생존 전략을 다루는 개발자 블로그',
  keywords: ['AI', '인공지능', '개발자', '트렌드', 'LLM', 'Claude', 'GPT'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <Navigation />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
          <p>AI가 내 밥그릇을 노린다 — 개발자 생존 블로그</p>
        </footer>
      </body>
    </html>
  )
}
