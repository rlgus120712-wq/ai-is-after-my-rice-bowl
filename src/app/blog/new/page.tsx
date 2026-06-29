'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/,/g, '')
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('로그인이 필요합니다')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, tags }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '오류가 발생했습니다')
        return
      }

      router.push(`/blog/${data.slug}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← 블로그 목록
        </Link>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          {preview ? '편집으로 돌아가기' : '미리보기'}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {preview ? (
        <div>
          <h1 className="mb-4 text-3xl font-bold text-zinc-50">{title || '제목 없음'}</h1>
          <div className="flex gap-2 mb-6">
            {tags.map((t) => (
              <span key={t} className="rounded-full border border-violet-800 bg-violet-900/20 px-2 py-0.5 text-xs text-violet-400">{t}</span>
            ))}
          </div>
          <hr className="mb-6 border-zinc-800" />
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">{content}</pre>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-transparent text-3xl font-bold text-zinc-50 placeholder-zinc-700 outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="한 줄 요약 (선택, 비우면 본문에서 자동 생성)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-700"
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full border border-violet-800 bg-violet-900/20 px-2 py-0.5 text-xs text-violet-400"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="태그 입력 후 Enter (예: AI, 개발자)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-700"
            />
          </div>

          <div>
            <textarea
              placeholder="마크다운으로 작성하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-700 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-600">마크다운을 지원합니다 · 저장 즉시 발행됩니다</p>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? '저장 중...' : '발행하기'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
