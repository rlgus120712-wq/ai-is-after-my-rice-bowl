import type { Metadata } from 'next'
import BlogPostCard from '@/components/BlogPostCard'
import { getBlogPosts } from '@/lib/blog'

export const revalidate = 3600

export const metadata: Metadata = {
  title: '블로그',
  description: 'AI 시대 개발자 생존 전략과 핵심 기술 개념을 다루는 블로그',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">블로그</h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">AI 시대 개발자 생존 전략과 핵심 기술 개념</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-24 text-center dark:border-zinc-700">
          <p className="text-4xl">✍️</p>
          <p className="mt-4 text-base font-medium text-zinc-500">아직 작성된 포스트가 없습니다</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
