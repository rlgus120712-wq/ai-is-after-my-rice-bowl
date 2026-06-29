import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getBlogPost } from '@/lib/blog'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: '포스트를 찾을 수 없습니다' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    keywords: post.tags,
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300">
        ← 블로그 목록
      </Link>

      <header className="mb-10">
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
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
        <h1 className="text-3xl font-bold leading-snug text-zinc-50 md:text-4xl">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">{post.excerpt}</p>
        )}
        <p className="mt-4 text-sm text-zinc-600">{formatDate(post.published_at)}</p>
      </header>

      <hr className="mb-10 border-zinc-800" />

      <MarkdownRenderer content={post.content} />
    </div>
  )
}
