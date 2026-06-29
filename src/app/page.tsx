import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500 dark:bg-violet-400" />
          AI 트렌드 자동 수집 중
        </div>

        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 md:text-7xl">
          AI가 내{' '}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
            밥그릇
          </span>
          을<br />
          노린다
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          최신 AI 기술 트렌드부터 개발자 생존 전략까지.
          <br />
          변화하는 시대에서 개발자로 살아남는 법.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/trends"
            className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            AI 트렌드 보기 →
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            블로그 읽기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            무엇을 다루나요?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-2xl dark:bg-orange-500/10">
                📡
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">AI 기술 트렌드</h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                HackerNews, Dev.to 등에서 최신 AI 기술 뉴스와 트렌드를 자동으로 수집합니다.
                매일 업데이트되는 AI 생태계의 흐름을 파악하세요.
              </p>
              <Link href="/trends" className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
                트렌드 보기 →
              </Link>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-2xl dark:bg-violet-500/10">
                ✍️
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">개발자 생존 블로그</h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                MCP, RAG, Agent부터 프롬프트 엔지니어링까지. AI 시대에 개발자가 알아야 할
                핵심 지식과 생존 전략을 깊이 있게 다룹니다.
              </p>
              <Link href="/blog" className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300">
                블로그 읽기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-zinc-200 px-4 py-12 dark:border-zinc-800">
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-12 text-center">
          {[
            { value: '매일', label: '트렌드 업데이트' },
            { value: 'HN + Dev.to', label: 'AI 뉴스 소스' },
            { value: 'ISR', label: 'Next.js 하이브리드 렌더링' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{value}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
