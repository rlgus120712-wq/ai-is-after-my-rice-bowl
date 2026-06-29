'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props {
  slug: string
}

export default function PostActions({ slug }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/blog')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error ?? '삭제에 실패했습니다')
        setShowConfirm(false)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/blog/${slug}/edit`}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        >
          수정
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          삭제
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">게시글 삭제</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              이 글을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="rounded-full px-5 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
