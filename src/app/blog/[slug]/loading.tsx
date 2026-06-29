export default function BlogPostLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-8 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mb-10 space-y-4">
        <div className="flex gap-2">
          <div className="h-5 w-14 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="space-y-3">
          <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="mb-10 h-px bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800 ${
              i % 4 === 3 ? 'w-1/2' : i % 3 === 2 ? 'w-4/5' : 'w-full'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
