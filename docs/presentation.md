# 🍚 AI가 내 밥그릇을 노린다
### AI 시대 개발자를 위한 트렌드 수집 + 생존 블로그 웹앱

---

## 1. 프로젝트 배경

> "AI가 내 일자리를 빼앗기 전에, 내가 먼저 AI를 활용하자"

AI 기술이 빠르게 발전하면서 개발자들은 **무엇을 공부해야 할지** 갈피를 잡기 어려워졌습니다.

이 프로젝트는 두 가지 질문에 답합니다.

- 지금 AI 업계에서 **무슨 일이 일어나고 있는가?**
- AI 시대에 개발자로 **어떻게 살아남을 것인가?**

---

## 2. 서비스 소개

| 기능 | 설명 |
|------|------|
| **AI 트렌드 수집** | HackerNews, Dev.to에서 AI 기사를 매일 자동 수집 |
| **개발자 블로그** | GitHub 로그인 후 누구나 생존 전략 글 작성 가능 |
| **다크 / 라이트 모드** | 사용자 환경에 맞춘 테마 전환 |
| **모바일 최적화** | 사이드 드로어 메뉴, 반응형 레이아웃 |
| **로딩 UX** | 상단 진행 바 + 스켈레톤 로딩 |

---

## 3. 기술 스택

```
Frontend   Next.js 16.2.9 (App Router) + TypeScript
Style      Tailwind CSS v4 + @tailwindcss/typography
Database   Supabase (PostgreSQL)
Auth       Supabase GitHub OAuth
Deploy     Vercel (GitHub 자동 배포)
Cron       Vercel Cron Jobs (매일 오전 9시)
```

---

## 4. 시스템 아키텍처

```
사용자 브라우저
      │
      ▼
  Vercel CDN
      │
  ┌───┴────────────────────────┐
  │         Next.js App        │
  │                            │
  │  ┌──────┐  ┌────────────┐  │
  │  │ ISR  │  │  Dynamic   │  │
  │  │(1시간│  │(force-     │  │
  │  │캐시) │  │ dynamic)   │  │
  │  │      │  │            │  │
  │  │트렌드│  │블로그 상세 │  │
  │  │블로그│  │            │  │
  │  │목록  │  │            │  │
  │  └──────┘  └────────────┘  │
  │                            │
  │  ┌──────────────────────┐  │
  │  │      API Routes      │  │
  │  │  POST /api/blog      │  │
  │  │  GET  /api/trends/   │  │
  │  │       sync (Cron)    │  │
  │  └──────────────────────┘  │
  └───────────────┬────────────┘
                  │
            Supabase
         (PostgreSQL + Auth)
```

---

## 5. 핵심 기능 상세

### 5-1. AI 트렌드 자동 수집

매일 오전 9시 Vercel Cron이 `/api/trends/sync` 를 호출합니다.

```
Vercel Cron (0 9 * * *)
      │
      ▼
/api/trends/sync
      │
      ├── HackerNews Algolia API
      │   └── "AI" 키워드 검색, 상위 30개
      │
      └── Dev.to API
          └── tag=ai, 최신 20개
      │
      ▼
Supabase ai_trends 테이블 upsert (URL 기준 중복 제거)
      │
      ▼
revalidatePath('/trends') → ISR 캐시 즉시 갱신
```

### 5-2. 블로그 글 작성 플로우

```
사용자 → GitHub OAuth 로그인
      │
      ▼
/blog/new 폼 작성
  - 제목 (필수)
  - 본문 마크다운 (필수, 10자 이상)
  - 한 줄 요약 (선택)
  - 태그 최대 5개 (Enter로 추가)
  - 실시간 미리보기 탭
      │
      ▼
POST /api/blog
  - 슬러그 자동 생성 (ASCII + 타임스탬프)
  - Supabase blog_posts 저장
  - revalidatePath('/blog') 캐시 갱신
      │
      ▼
/blog/{slug} 상세 페이지로 이동
```

### 5-3. 렌더링 전략

| 페이지 | 전략 | 이유 |
|--------|------|------|
| `/trends` | ISR (1시간) | 자주 바뀌지 않음, 빠른 응답 |
| `/blog` | ISR (1시간) | 목록은 캐시 가능 |
| `/blog/[slug]` | Dynamic | 새 글 slug는 빌드 시 알 수 없음 |
| `/blog/new` | Static | 폼 자체는 정적 |

---

## 6. 데이터베이스 설계

### ai_trends

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| title | TEXT | 기사 제목 |
| url | TEXT UNIQUE | 중복 방지 기준 |
| source | TEXT | HackerNews / Dev.to |
| summary | TEXT | 요약 |
| tags | TEXT[] | 태그 배열 |
| score | INTEGER | HN 점수 |
| published_at | TIMESTAMPTZ | 원문 발행일 |

### blog_posts

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| slug | TEXT UNIQUE | URL 경로 (ASCII) |
| title | TEXT | 제목 |
| content | TEXT | 마크다운 본문 |
| excerpt | TEXT | 한 줄 요약 |
| tags | TEXT[] | 태그 |
| published | BOOLEAN | 공개 여부 |
| author_id | TEXT | GitHub 유저 ID |
| author_name | TEXT | 표시 이름 |
| author_avatar | TEXT | 프로필 이미지 URL |

**RLS (Row Level Security)**
- 읽기: 누구나 (anon key)
- 쓰기: service_role만 허용 → 클라이언트 직접 DB 접근 불가

---

## 7. 해결한 주요 문제들

### 문제 1. 한글 슬러그 → Vercel 404
- **원인**: Vercel CDN이 한글 URL 경로의 정적 파일을 서빙하지 못함
- **해결**: 슬러그 생성 시 한글 제거, ASCII + 타임스탬프만 사용
  ```
  "AI 시대 생존법" → "ai-mqypwfcc"
  ```

### 문제 2. ISR 캐시가 빈 상태로 고정
- **원인**: 빌드 시점에 DB가 비어있어 빈 페이지가 캐시됨
- **해결**: 트렌드 동기화 API에서 `revalidatePath()` 호출
  ```typescript
  revalidatePath('/trends') // 동기화 완료 후 캐시 무효화
  ```

### 문제 3. 다크모드 새로고침 시 화면 깜빡임
- **원인**: React가 hydration 전에 테마 클래스가 없는 상태로 렌더링
- **해결**: `<head>`에 blocking 인라인 스크립트 삽입
  ```html
  <script>
    var s = localStorage.getItem('theme');
    if (s === 'dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark');
  </script>
  ```

### 문제 4. Tailwind v4 다크모드 적용 안 됨
- **원인**: v4에서 class 기반 다크모드 설정 방식이 변경됨
- **해결**: `globals.css`에 커스텀 variant 직접 선언
  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```

### 문제 5. Vercel Hobby Cron 제한
- **원인**: Hobby 플랜은 1일 1회만 Cron 실행 가능
- **해결**: `0 * * * *` (매시간) → `0 9 * * *` (매일 오전 9시)로 변경

---

## 8. UX 개선 포인트

### 로딩 피드백
사용자가 버튼을 눌렀는지 인지하지 못하는 문제 → 두 가지로 해결

1. **상단 진행 바** (next-nprogress-bar)
   - 페이지 이동 시 보라색 바가 상단에 표시
   - YouTube, GitHub와 동일한 패턴

2. **스켈레톤 로딩** (loading.tsx)
   - 데이터 로딩 중 카드 형태의 회색 박스 표시
   - 실제 콘텐츠와 동일한 레이아웃 유지

### 모바일 네비게이션
- 데스크탑: 가로 나열 메뉴
- 모바일: 햄버거 → 오른쪽에서 슬라이드되는 사이드 드로어
- 배경 오버레이 클릭 시 닫힘, 페이지 이동 시 자동 닫힘

---

## 9. 프로젝트 구조 한눈에 보기

```
ai-is-after-my-rice-bowl/
├── src/
│   ├── app/                  # Next.js App Router 페이지
│   │   ├── page.tsx          # 홈
│   │   ├── layout.tsx        # 공통 레이아웃
│   │   ├── trends/           # AI 트렌드
│   │   ├── blog/             # 블로그 (목록, 상세, 작성)
│   │   └── api/              # API Routes
│   ├── components/           # 재사용 UI 컴포넌트
│   └── lib/                  # 비즈니스 로직 (DB 쿼리 등)
├── supabase/
│   └── migrations/           # DB 스키마 SQL
├── vercel.json               # Cron 설정
└── .env.local                # 환경 변수 (비공개)
```

---

## 10. 회고 및 배운 점

- **Next.js App Router의 렌더링 전략**을 상황에 맞게 선택하는 것이 중요
- **Supabase RLS**로 클라이언트 코드에서 DB를 직접 건드리지 않아도 안전하게 권한 관리 가능
- **ISR + revalidatePath** 조합으로 정적 페이지의 신선도를 유지하는 패턴 습득
- Tailwind v4는 v3와 설정 방식이 많이 달라 공식 문서를 꼼꼼히 읽는 것이 필수
- 배포 환경(Vercel)과 로컬 환경의 차이(한글 URL, Hobby Cron 제한 등)를 미리 파악하면 디버깅 시간을 줄일 수 있음

---

> **GitHub**: https://github.com/rlgus120712-wq/ai-is-after-my-rice-bowl
