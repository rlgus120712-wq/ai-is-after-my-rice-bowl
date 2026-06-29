export default function BlogLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex gap-2">
              <div className="h-5 w-12 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-6 w-1/2 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="mt-4 h-3 w-28 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
