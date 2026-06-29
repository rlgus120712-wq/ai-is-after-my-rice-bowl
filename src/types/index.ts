export interface AiTrend {
  id: string
  title: string
  url: string
  source: string
  summary: string | null
  tags: string[]
  score: number
  published_at: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author_id: string | null
}
