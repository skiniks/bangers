import { Icon } from '@iconify/react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1)
    return null

  const handlePageChange = (page: number) => {
    // Scroll to top smoothly before changing the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
    onPageChange(page)
  }

  const getPageNumbers = () => {
    const pages: Array<number | 'start-ellipsis' | 'end-ellipsis'> = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    if (currentPage <= 2) {
      end = 4
    }
    if (currentPage >= totalPages - 1) {
      start = totalPages - 3
    }

    if (start > 2) {
      pages.push('start-ellipsis')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push('end-ellipsis')
    }

    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        type="button"
        className="group relative p-2 rounded-lg
          bg-linear-to-br/oklch from-gray-900/80 to-gray-800/80
          text-gray-400 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          ring-1 ring-white/[0.08] hover:ring-white/[0.15]
          transition-all ease-fluid"
      >
        <div className="absolute inset-0 bg-linear-to-br/oklch from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-lg transition-all ease-fluid" />
        <Icon icon="mdi:chevron-left" className="relative w-5 h-5" />
      </button>

      <div className="flex gap-1.5">
        {pageNumbers.map(number =>
          number === 'start-ellipsis' || number === 'end-ellipsis'
            ? (
                <span key={number} className="px-2 py-1.5 text-gray-500">
                  ...
                </span>
              )
            : (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  type="button"
                  className={`
                    group relative px-4 py-1.5 rounded-lg transition-all ease-fluid
                    ${
                currentPage === number
                  ? 'bg-linear-to-br/oklch from-blue-500 to-blue-400 text-white ring-1 ring-white/20'
                  : 'bg-linear-to-br/oklch from-gray-900/80 to-gray-800/80 text-gray-400 hover:text-white ring-1 ring-white/[0.08] hover:ring-white/[0.15]'
                }
                  `}
                >
                  <div
                    className={`
                    absolute inset-0 rounded-lg transition-all ease-fluid
                    ${
                currentPage === number
                  ? 'bg-linear-to-br/oklch from-white/10 to-white/5'
                  : 'bg-linear-to-br/oklch from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10'
                }
                  `}
                  />
                  <span className="relative font-medium">{number}</span>
                </button>
              ),
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        type="button"
        className="group relative p-2 rounded-lg
          bg-linear-to-br/oklch from-gray-900/80 to-gray-800/80
          text-gray-400 hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          ring-1 ring-white/[0.08] hover:ring-white/[0.15]
          transition-all ease-fluid"
      >
        <div className="absolute inset-0 bg-linear-to-br/oklch from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-lg transition-all ease-fluid" />
        <Icon icon="mdi:chevron-right" className="relative w-5 h-5" />
      </button>
    </div>
  )
}
