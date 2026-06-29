'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none
      prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100
      prose-p:text-zinc-700 prose-p:leading-relaxed dark:prose-p:text-zinc-300
      prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-violet-400
      prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
      prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-violet-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800 dark:prose-code:text-violet-300
      prose-pre:bg-zinc-100 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:bg-zinc-900 dark:prose-pre:border-zinc-700
      prose-blockquote:border-violet-400 prose-blockquote:text-zinc-500 dark:prose-blockquote:text-zinc-400
      prose-li:text-zinc-700 dark:prose-li:text-zinc-300
      prose-hr:border-zinc-200 dark:prose-hr:border-zinc-700
      prose-img:rounded-xl
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
