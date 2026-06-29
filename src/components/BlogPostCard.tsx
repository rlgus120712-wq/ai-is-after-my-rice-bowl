import Link from 'next/link'
import type { BlogPost } from '@/types'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

type BlogPostCardProps = Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'tags' | 'published_at'>

export default function BlogPostCard({ post }: { post: BlogPostCardProps }) {
  return (
    <article className="group border-b border-zinc-200 py-8 last:border-0 dark:border-zinc-800">
      {post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      {post.excerpt && (
        <p className="mt-2 line-clamp-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
      )}

      <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-600">{formatDate(post.published_at)}</p>
    </article>
  )
}
