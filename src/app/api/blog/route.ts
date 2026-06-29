import { createAuthClient } from '@/lib/supabase/middleware-server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: '로그인이 필요합니다' }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, excerpt, tags } = body

  if (!title?.trim() || !content?.trim()) {
    return Response.json({ error: '제목과 내용은 필수입니다' }, { status: 400 })
  }

  // ASCII-only slug (한글 등 비ASCII 문자 제거) + 랜덤 suffix로 충돌 방지
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '') || 'post'
    + '-' + Date.now().toString(36)

  const { data, error } = await supabase.from('blog_posts').insert({
    title: title.trim(),
    slug,
    content: content.trim(),
    excerpt: excerpt?.trim() || content.trim().slice(0, 150) + '...',
    tags: tags ?? [],
    published: true,
    published_at: new Date().toISOString(),
    author_id: user.id,
    author_name: user.user_metadata?.user_name ?? user.email ?? '익명',
    author_avatar: user.user_metadata?.avatar_url ?? null,
  }).select('slug').single()

  if (error) {
    console.error('Create post error:', error)
    return Response.json({ error: '저장에 실패했습니다' }, { status: 500 })
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${data.slug}`)
  return Response.json({ slug: data.slug })
}
