import { createPublicSupabase, isSupabaseConfigured } from './supabase/server'
import type { BlogPost } from '@/types'

export async function getBlogPosts(): Promise<Omit<BlogPost, 'content'>[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = createPublicSupabase()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, tags, published_at, created_at, updated_at, published')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('getBlogPosts error:', error)
    return []
  }
  return data ?? []
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = createPublicSupabase()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('getBlogPost error:', error)
    return null
  }
  return data
}

export async function getBlogPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = createPublicSupabase()
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true)

  return (data ?? []).map((p) => p.slug)
}
