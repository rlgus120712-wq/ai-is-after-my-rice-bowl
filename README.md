# AI가 내 밥그릇을 노린다 🍚

AI 기술 트렌드 자동 수집 + 개발자 생존 블로그 웹앱

---

## 개요

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16.2.9 (App Router) |
| 스타일 | Tailwind CSS v4 |
| DB / Auth | Supabase (PostgreSQL + GitHub OAuth) |
| 배포 | Vercel (GitHub main 브랜치 자동 배포) |
| 렌더링 | ISR (트렌드/블로그 목록) + Dynamic (블로그 상세) |

---

## 기능

### AI 트렌드 수집
- HackerNews Algolia API, Dev.to API에서 AI 관련 기사 자동 수집
- Vercel Cron Job으로 매일 오전 9시 자동 동기화 (`0 9 * * *`)
- 수집 후 `revalidatePath('/trends')` 호출로 ISR 캐시 갱신

### 개발자 블로그
- GitHub OAuth 로그인한 사용자 누구나 글 작성 가능
- 마크다운 지원 (react-markdown + remark-gfm)
- 실시간 미리보기, 태그 (최대 5개), 한 줄 요약 입력
- 글 작성 유효성 검사 (제목 필수, 본문 10자 이상)

### UI/UX
- 다크 / 라이트 모드 토글 (localStorage 저장, 새로고침 시 플래시 없음)
- 페이지 이동 시 상단 진행 바 (보라색, next-nprogress-bar)
- 스켈레톤 로딩 (트렌드, 블로그 목록, 블로그 상세)
- 모바일 반응형 — 오른쪽 슬라이드 사이드 드로어 메뉴

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                  # 홈
│   ├── layout.tsx                # 공통 레이아웃 (네비, 푸터, 진행바)
│   ├── globals.css               # Tailwind v4 + 다크모드 CSS 변수
│   ├── trends/
│   │   ├── page.tsx              # AI 트렌드 목록 (ISR 1h)
│   │   └── loading.tsx           # 스켈레톤
│   ├── blog/
│   │   ├── page.tsx              # 블로그 목록 (ISR 1h)
│   │   ├── loading.tsx           # 스켈레톤
│   │   ├── new/page.tsx          # 글 작성 폼
│   │   └── [slug]/
│   │       ├── page.tsx          # 블로그 상세 (force-dynamic)
│   │       └── loading.tsx       # 스켈레톤
│   ├── api/
│   │   ├── blog/route.ts         # POST: 블로그 글 저장
│   │   └── trends/sync/route.ts  # GET: 트렌드 동기화 (Cron)
│   └── auth/callback/route.ts    # GitHub OAuth 콜백
├── components/
│   ├── Navigation.tsx            # 헤더 네비 (모바일 사이드 드로어 포함)
│   ├── ThemeToggle.tsx           # 다크/라이트 토글 버튼
│   ├── ProgressBar.tsx           # 상단 페이지 전환 진행 바
│   ├── TrendCard.tsx             # 트렌드 카드 컴포넌트
│   ├── BlogPostCard.tsx          # 블로그 목록 카드
│   └── MarkdownRenderer.tsx      # 마크다운 렌더러
└── lib/
    ├── trends.ts                 # getTrends(), syncTrends()
    ├── blog.ts                   # getBlogPosts(), getBlogPost()
    └── supabase/
        ├── server.ts             # createPublicSupabase(), createServiceSupabase()
        ├── client.ts             # createBrowserClient (클라이언트용)
        └── middleware-server.ts  # createAuthClient() (쿠키 기반 SSR Auth)
```

---

## DB 스키마

```sql
-- AI 트렌드
CREATE TABLE ai_trends (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  url          TEXT NOT NULL UNIQUE,
  source       TEXT NOT NULL,           -- 'HackerNews' | 'Dev.to'
  summary      TEXT,
  tags         TEXT[] DEFAULT '{}',
  score        INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 블로그 포스트
CREATE TABLE blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,   -- ASCII only + 타임스탬프 suffix
  content       TEXT NOT NULL,
  excerpt       TEXT,
  tags          TEXT[] DEFAULT '{}',
  published     BOOLEAN DEFAULT FALSE,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  author_id     TEXT,
  author_name   TEXT,
  author_avatar TEXT
);
```

RLS 정책:
- `ai_trends`: 전체 공개 읽기
- `blog_posts`: `published = true`인 글만 공개 읽기
- 쓰기는 service_role만 허용

---

## 환경 변수

`.env.local` 파일에 아래 값 설정 (Vercel에도 동일하게 등록):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=<랜덤 시크릿>
```

---

## 로컬 개발

```bash
npm install
npm run dev        # http://localhost:3000
```

트렌드 수동 동기화:
```bash
curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/trends/sync
```

---

## 배포

GitHub `main` 브랜치 push 시 Vercel이 자동 빌드 및 배포.

`vercel.json` Cron 설정:
```json
{
  "crons": [{ "path": "/api/trends/sync", "schedule": "0 9 * * *" }]
}
```

> Vercel Hobby 플랜 제한: 하루 1회만 가능

---

## 주요 기술 결정 사항

| 문제 | 해결책 |
|------|--------|
| 한글 slug → Vercel CDN 404 | slug를 ASCII만 허용 + `force-dynamic` 적용 |
| ISR 캐시가 빈 상태로 굳음 | sync API에서 `revalidatePath('/trends')` 호출 |
| 다크모드 새로고침 시 색상 플래시 | `<head>`에 blocking 인라인 스크립트로 클래스 선적용 |
| Tailwind v4 다크모드 class 전략 | `@custom-variant dark (&:where(.dark, .dark *))` |
| Vercel Hobby Cron 제한 | hourly(`0 * * * *`) → daily(`0 9 * * *`) |
