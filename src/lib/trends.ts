import { createPublicSupabase, createServiceSupabase, isSupabaseConfigured } from './supabase/server'
import type { AiTrend } from '@/types'

export async function getTrends(): Promise<AiTrend[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = createPublicSupabase()
  const { data, error } = await supabase
    .from('ai_trends')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(40)

  if (error) {
    console.error('getTrends error:', error)
    return []
  }
  return data ?? []
}

interface HNHit {
  objectID: string
  title: string | null
  story_title: string | null
  url: string | null
  points: number | null
  created_at: string
  _tags: string[]
}

interface DevtoArticle {
  title: string
  url: string
  description: string | null
  public_reactions_count: number
  tag_list: string[]
  published_at: string
}

export async function syncTrends(): Promise<number> {
  const supabase = createServiceSupabase()

  const [hnRes, devtoRes] = await Promise.all([
    fetch(
      'https://hn.algolia.com/api/v1/search?query=AI+LLM+Claude+GPT+agent+RAG&tags=story&hitsPerPage=25',
      { cache: 'no-store' }
    ),
    fetch('https://dev.to/api/articles?tag=ai&per_page=15&top=1', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
  ])

  const hnData = await hnRes.json()
  const devtoData: DevtoArticle[] = await devtoRes.json()

  const trends = [
    ...hnData.hits
      .filter((h: HNHit) => h.url && (h.title || h.story_title))
      .map((h: HNHit) => ({
        title: (h.title || h.story_title)!,
        url: h.url!,
        source: 'HackerNews',
        summary: null as null,
        score: h.points ?? 0,
        tags: ['ai', 'tech'],
        published_at: h.created_at,
      })),
    ...devtoData
      .filter((a) => a.url)
      .map((a) => ({
        title: a.title,
        url: a.url,
        source: 'Dev.to',
        summary: a.description,
        score: a.public_reactions_count,
        tags: a.tag_list,
        published_at: a.published_at,
      })),
  ]

  if (trends.length === 0) return 0

  const { error } = await supabase
    .from('ai_trends')
    .upsert(trends, { onConflict: 'url' })

  if (error) throw error
  return trends.length
}
