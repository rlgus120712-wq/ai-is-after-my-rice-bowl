import Link from 'next/link'
import type { BlogPost } from '@/types'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type BlogPostCardProps = Pick<BlogPost, 'title' | 'slug' | 'excerpt' | 'tags' | 'published_at'>

export default function BlogPostCard({ post }: { post: BlogPostCardProps }) {
  return (
    <article className="group border-b border-zinc-800 py-8 last:border-0">
      {post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-violet-800 bg-violet-900/20 px-2 py-0.5 text-xs text-violet-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold text-zinc-100 transition-colors group-hover:text-violet-400">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      {post.excerpt && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
      )}

      <p className="mt-4 text-xs text-zinc-600">{formatDate(post.published_at)}</p>
    </article>
  )
}
