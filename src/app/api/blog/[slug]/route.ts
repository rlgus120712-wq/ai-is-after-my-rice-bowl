import { createAuthClient } from '@/lib/supabase/middleware-server'
import { revalidatePath } from 'next/cache'

async function getPostAndUser(slug: string) {
  const supabase = await createAuthClient()
  const [{ data: { user } }, { data: post, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('blog_posts').select('id, author_id').eq('slug', slug).single(),
  ])
  return { supabase, user, post, error }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { supabase, user, post, error } = await getPostAndUser(slug)

  if (!user) return Response.json({ error: '로그인이 필요합니다' }, { status: 401 })
  if (error || !post) return Response.json({ error: '게시글을 찾을 수 없습니다' }, { status: 404 })
  if (post.author_id !== user.id) return Response.json({ error: '수정 권한이 없습니다' }, { status: 403 })

  const body = await request.json()
  const { title, content, excerpt, tags } = body

  if (!title?.trim() || !content?.trim()) {
    return Response.json({ error: '제목과 내용은 필수입니다' }, { status: 400 })
  }

  const { data: updated, error: updateError } = await supabase.from('blog_posts').update({
    title: title.trim(),
    content: content.trim(),
    excerpt: excerpt?.trim() ?? (content.trim().slice(0, 150) + '...'),
    tags: tags ?? [],
    updated_at: new Date().toISOString(),
  }).eq('slug', slug).select('slug')

  if (updateError || !updated?.length) {
    console.error('Update post error:', updateError ?? 'no rows updated')
    return Response.json({ error: '수정에 실패했습니다' }, { status: 500 })
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  return Response.json({ slug })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { supabase, user, post, error } = await getPostAndUser(slug)

  if (!user) return Response.json({ error: '로그인이 필요합니다' }, { status: 401 })
  if (error || !post) return Response.json({ error: '게시글을 찾을 수 없습니다' }, { status: 404 })
  if (post.author_id !== user.id) return Response.json({ error: '삭제 권한이 없습니다' }, { status: 403 })

  const { error: deleteError } = await supabase.from('blog_posts').delete().eq('slug', slug)

  if (deleteError) {
    console.error('Delete post error:', deleteError)
    return Response.json({ error: '삭제에 실패했습니다' }, { status: 500 })
  }

  revalidatePath('/blog')
  return Response.json({ ok: true })
}
