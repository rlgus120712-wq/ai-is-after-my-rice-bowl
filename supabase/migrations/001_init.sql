-- AI 트렌드 테이블
CREATE TABLE IF NOT EXISTS ai_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  score INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_trends_score_idx ON ai_trends (score DESC);
CREATE INDEX IF NOT EXISTS ai_trends_published_at_idx ON ai_trends (published_at DESC);

-- 블로그 포스트 테이블
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (published, published_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE ai_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "ai_trends_public_read" ON ai_trends FOR SELECT USING (true);
CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (published = true);

-- 서비스 롤은 모든 권한
CREATE POLICY "ai_trends_service_write" ON ai_trends FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "blog_posts_service_write" ON blog_posts FOR ALL USING (auth.role() = 'service_role');
