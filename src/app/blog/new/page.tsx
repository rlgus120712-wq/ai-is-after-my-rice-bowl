'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Errors = { title?: string; content?: string; general?: string }

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [preview, setPreview] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user)
    })
  }, [])

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/,/g, '')
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!title.trim()) e.title = '제목을 입력해주세요'
    if (!content.trim()) e.content = '본문을 입력해주세요'
    else if (content.trim().length < 10) e.content = '본문을 10자 이상 작성해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors({})

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, tags }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrors({ general: data.error ?? '저장에 실패했습니다' })
        return
      }
      router.push(`/blog/${data.slug}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loggedIn === false) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-32 text-center">
        <p className="text-5xl mb-6">🔒</p>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">로그인이 필요합니다</h2>
        <p className="mt-3 text-base text-zinc-500">GitHub 계정으로 로그인하면 블로그 글을 작성할 수 있습니다</p>
        <Link
          href="/"
          className="mt-8 rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <Link href="/blog" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          ← 블로그 목록
        </Link>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          {preview ? '✏️ 편집으로 돌아가기' : '👁 미리보기'}
        </button>
      </div>

      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">새 글 쓰기</h1>

      {errors.general && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <span>⚠️</span> {errors.general}
        </div>
      )}

      {preview ? (
        /* 미리보기 */
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          {tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">{t}</span>
              ))}
            </div>
          )}
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{title || '(제목 없음)'}</h2>
          {excerpt && <p className="mt-3 text-lg text-zinc-500">{excerpt}</p>}
          <hr className="my-6 border-zinc-200 dark:border-zinc-700" />
          <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{content || '(내용 없음)'}</pre>
        </div>
      ) : (
        /* 편집 폼 */
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(p => ({...p, title: undefined})) }}
              placeholder="독자의 눈길을 끄는 제목을 입력하세요"
              className={`w-full rounded-xl border px-4 py-3.5 text-lg text-zinc-900 placeholder-zinc-400 outline-none transition-colors dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 ${
                errors.title
                  ? 'border-red-400 bg-red-50 focus:border-red-500 dark:border-red-700 dark:bg-red-900/10'
                  : 'border-zinc-300 bg-white focus:border-violet-500 dark:border-zinc-700'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <span>⚠</span> {errors.title}
              </p>
            )}
          </div>

          {/* 본문 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                본문 <span className="text-red-500">*</span>
                <span className="ml-2 text-sm font-normal text-zinc-400">마크다운을 지원합니다</span>
              </label>
              <span className={`text-sm ${content.length > 9000 ? 'text-red-500' : 'text-zinc-400'}`}>
                {content.length.toLocaleString()}자
              </span>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50">
              💡 <strong>마크다운 팁:</strong> <code className="mx-1 rounded bg-zinc-200 px-1 dark:bg-zinc-700"># 제목</code> <code className="mx-1 rounded bg-zinc-200 px-1 dark:bg-zinc-700">**굵게**</code> <code className="mx-1 rounded bg-zinc-200 px-1 dark:bg-zinc-700">- 목록</code> <code className="mx-1 rounded bg-zinc-200 px-1 dark:bg-zinc-700">```코드```</code>
            </div>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors(p => ({...p, content: undefined})) }}
              placeholder={`## 들어가며\n\n본문을 마크다운으로 작성해주세요.\n\n## 소제목\n\n내용...`}
              rows={20}
              className={`w-full rounded-xl border px-4 py-3.5 font-mono text-base leading-relaxed text-zinc-900 placeholder-zinc-400 outline-none transition-colors dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 ${
                errors.content
                  ? 'border-red-400 bg-red-50 focus:border-red-500 dark:border-red-700 dark:bg-red-900/10'
                  : 'border-zinc-300 bg-white focus:border-violet-500 dark:border-zinc-700'
              }`}
            />
            {errors.content && (
              <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <span>⚠</span> {errors.content}
              </p>
            )}
          </div>

          {/* 한 줄 요약 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              한 줄 요약 <span className="text-sm font-normal text-zinc-400">(선택)</span>
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="글 목록에 표시될 요약문 (비우면 본문에서 자동 생성)"
              maxLength={200}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3.5 text-base text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600"
            />
          </div>

          {/* 태그 */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              태그 <span className="text-sm font-normal text-zinc-400">(선택, 최대 5개)</span>
            </label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder={tags.length >= 5 ? '태그는 최대 5개까지 추가할 수 있습니다' : 'AI, 개발자, 생존전략 — 입력 후 Enter'}
              disabled={tags.length >= 5}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3.5 text-base text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600"
            />
          </div>

          {/* 제출 */}
          <div className="flex items-center justify-end gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <Link
              href="/blog"
              className="rounded-full px-6 py-2.5 text-base font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-violet-600 px-8 py-2.5 text-base font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? '발행 중...' : '발행하기 →'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
