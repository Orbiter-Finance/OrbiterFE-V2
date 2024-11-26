import React, { useState, useMemo, useCallback } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage: number
  initialPage?: number
  maxPageNumbers?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  startIndex: number
  endIndex: number
  pageNumbers: (number | string)[]
}

function usePaginationWithEllipsis({
  totalItems,
  itemsPerPage,
  initialPage = 1,
  maxPageNumbers = 7
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = useMemo(() => itemsPerPage && totalItems ? Math.ceil(totalItems / itemsPerPage) : 0, [totalItems, itemsPerPage])

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }, [totalPages])

  const pageNumbers = useMemo(() => {
    const pageArray: (number | string)[] = []
    const innerMaxPageNumbers = maxPageNumbers - 2 // 减去首尾页码

    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageArray.push(i)
      }
    } else {
      pageArray.push(1)

      if (currentPage <= innerMaxPageNumbers - 1) {
        for (let i = 2; i <= innerMaxPageNumbers; i++) {
          pageArray.push(i)
        }
        pageArray.push('...', totalPages)
      } else if (currentPage >= totalPages - innerMaxPageNumbers + 2) {
        pageArray.push('...')
        for (let i = totalPages - innerMaxPageNumbers + 1; i <= totalPages; i++) {
          pageArray.push(i)
        }
      } else {
        pageArray.push('...')
        const offset = Math.floor((innerMaxPageNumbers - 3) / 2)
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          pageArray.push(i)
        }
        pageArray.push('...', totalPages)
      }
    }

    return pageArray
  }, [currentPage, totalPages, maxPageNumbers])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1)

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    pageNumbers
  }
}

export default usePaginationWithEllipsis