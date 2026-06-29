import type { AiTrend } from '@/types'

const SOURCE_STYLES: Record<string, string> = {
  HackerNews: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  'Dev.to': 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}

export default function TrendCard({ trend }: { trend: AiTrend }) {
  const sourceStyle = SOURCE_STYLES[trend.source] ?? 'bg-zinc-800 text-zinc-400'

  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-violet-700">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sourceStyle}`}>
          {trend.source}
        </span>
        {trend.score > 0 && (
          <span className="text-xs text-zinc-500">⬆ {trend.score.toLocaleString()}</span>
        )}
      </div>

      <h3 className="text-sm font-medium leading-snug text-zinc-100 transition-colors group-hover:text-violet-400">
        <a href={trend.url} target="_blank" rel="noopener noreferrer" className="line-clamp-2">
          {trend.title}
        </a>
      </h3>

      {trend.summary && (
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">{trend.summary}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {trend.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-zinc-600">
            #{tag}
          </span>
        ))}
        <span className="ml-auto text-xs text-zinc-600">{formatDate(trend.published_at)}</span>
      </div>
    </article>
  )
}
