import type { Metadata } from 'next'
import TrendCard from '@/components/TrendCard'
import { getTrends } from '@/lib/trends'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'AI 트렌드',
  description: 'HackerNews, Dev.to에서 수집한 최신 AI 기술 트렌드',
}

export default async function TrendsPage() {
  const trends = await getTrends()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">AI 트렌드</h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          HackerNews · Dev.to에서 자동 수집 — 매일 오전 9시 업데이트
        </p>
      </div>

      {trends.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-24 text-center dark:border-zinc-700">
          <p className="text-4xl">📡</p>
          <p className="mt-4 text-base font-medium text-zinc-500">아직 수집된 트렌드가 없습니다</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      )}
    </div>
  )
}
