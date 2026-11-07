'use client'

import { useRef, useState } from 'react'
import { StudySummaryPage } from '@/types'

interface StudySummaryProps {
  title: string
  pages: StudySummaryPage[]
  source?: string
}

export default function StudySummary({ title, pages, source }: StudySummaryProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const page = pages[pageIndex]

  if (!page) return null

  const goToPage = (index: number) => {
    setPageIndex(index)
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden" aria-label={title}>
      <div className="bg-purple-600 p-4 text-white">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-purple-100 mt-1">Leia uma página por vez. Depois, revise com os flashcards e as questões.</p>
      </div>

      <nav aria-label="Páginas do resumo" className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
        {pages.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-current={index === pageIndex ? 'page' : undefined}
            onClick={() => goToPage(index)}
            className={`rounded-lg px-3 py-2 text-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 ${
              index === pageIndex ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </nav>

      <div className="p-5 sm:p-8">
        <p className="text-sm text-purple-700 mb-2" role="status">Página {pageIndex + 1} de {pages.length}</p>
        <h3 ref={heading} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 scroll-mt-6">
          {page.title}
        </h3>
        <div className="study-summary text-gray-700 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: page.content }} />
        {source && <p className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">Base de estudo: {source}</p>}
      </div>

      <div className="flex items-center justify-between gap-3 p-4 bg-purple-50">
        <button type="button" disabled={pageIndex === 0} onClick={() => goToPage(pageIndex - 1)}
          className="px-4 py-3 rounded-lg bg-white text-purple-900 border border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed">
          Anterior
        </button>
        <span className="text-sm text-purple-900">{pageIndex + 1} / {pages.length}</span>
        <button type="button" disabled={pageIndex === pages.length - 1} onClick={() => goToPage(pageIndex + 1)}
          className="px-4 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed">
          Próxima
        </button>
      </div>
    </section>
  )
}
