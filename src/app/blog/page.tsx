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
        <h1 className="text-3xl font-bold text-zinc-50">블로그</h1>
        <p className="mt-2 text-zinc-400">AI 시대 개발자 생존 전략과 핵심 기술 개념</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-24 text-center">
          <p className="text-4xl">✍️</p>
          <p className="mt-4 font-medium text-zinc-400">아직 작성된 포스트가 없습니다</p>
          <p className="mt-2 text-sm text-zinc-600">
            Supabase에서 blog_posts 테이블에 포스트를 추가하세요
          </p>
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
