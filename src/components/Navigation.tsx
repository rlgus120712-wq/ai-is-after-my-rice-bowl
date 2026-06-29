'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './AuthButton'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/', label: '홈' },
  { href: '/trends', label: 'AI 트렌드' },
  { href: '/blog', label: '블로그' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="text-xl">🍚</span>
          <span className="hidden sm:inline">밥그릇을 지켜라</span>
        </Link>

        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-violet-600 text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
          <ThemeToggle />
          <AuthButton />
        </div>
      </nav>
    </header>
  )
}
