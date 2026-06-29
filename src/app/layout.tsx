import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navigation from '@/components/Navigation'
import ProgressBar from '@/components/ProgressBar'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'AI가 내 밥그릇을 노린다', template: '%s | AI가 내 밥그릇을 노린다' },
  description: '최신 AI 기술 트렌드와 AI 시대 개발자 생존 전략을 다루는 개발자 블로그',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* 페이지 로드 시 테마 플래시 방지 */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var s=localStorage.getItem('theme');
            var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(s==='dark'||(s!=='light'&&d)) document.documentElement.classList.add('dark');
          })()
        `}} />
      </head>
      <body className="flex min-h-full flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <ProgressBar />
        <Navigation />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
          <p>AI가 내 밥그릇을 노린다 — 개발자 생존 블로그</p>
        </footer>
      </body>
    </html>
  )
}
