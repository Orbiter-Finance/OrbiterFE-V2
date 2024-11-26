"use client"

import React, { useCallback, useEffect } from 'react'
import usePaginationWithEllipsis from './usePaginationWithEllipsis'
import { cn } from '../../../utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationType {
    total: number
    itemsPerPage: number
    maxPageNumbers?: number,
    pending?: boolean,
    onPageChange?: (currentPage: number) => void
}

const PaginatedList: React.FC<PaginationType> = ({
    total,
    itemsPerPage,
    maxPageNumbers,
    pending,
    onPageChange
}) => {
    const {
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        pageNumbers
    } = usePaginationWithEllipsis({
        totalItems: total || 1,
        itemsPerPage: itemsPerPage || 1,
        maxPageNumbers
    })


    const handlePageClick = (pageNumber: number | string, index: number) => {
        if (pending) return
        if (typeof pageNumber === 'number') {
            goToPage(pageNumber)
        } else if (pageNumber === '...') {
            const visiblePages = pageNumbers.filter(p => typeof p === 'number') as number[]
            if (index === 1 && visiblePages[1] !== undefined) {
                goToPage(visiblePages[1] - 1)
            } else if (visiblePages.length >= 2) {
                const secondLastPage = visiblePages[visiblePages.length - 2]
                if (secondLastPage !== undefined) {
                    goToPage(secondLastPage + 1)
                }
            }
        }
    }

    const pageChange = useCallback(
        () => {
            onPageChange && onPageChange(currentPage)
        },
        [currentPage],
    )


    useEffect(() => {
        const timer = setTimeout(() => {
            pageChange()
        }, 50)

        return () => {
            clearTimeout(timer)
        }
    }, [currentPage])

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='flex justify-center items-center'>
                <div className='h-10 p-1.5 flex justify-center items-center'>
                    <button className={
                        cn('min-w-8 h-full rounded-[0.25rem] bg-[var(--o-color-gray-800)] flex justify-center items-center px-1')
                    } onClick={prevPage} disabled={currentPage === 1}>
                        <ChevronLeft strokeWidth={2} className='w-4 h-4' stroke={currentPage === 1 ? "var(--o-color-gray-600)" : "var(--o-color-gray-200)"} />
                    </button>
                </div>

                {pageNumbers.map((pageNumber, index) => (
                    <div key={`${pageNumber}-${index}`} className='h-10 p-1.5 flex justify-center items-center'>
                        <button
                            key={index}
                            onClick={() => handlePageClick(pageNumber, index)}
                            disabled={pageNumber === currentPage}
                            className={
                                cn('min-w-8 h-full rounded-[0.25rem] px-1', pageNumber === currentPage ? "bg-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)] o-font-500" : "bg-[var(--o-color-gray-800)] text-[var(--o-color-gray-600)] o-font-400")
                            }
                        >
                            {pageNumber}
                        </button>
                    </div>
                ))}
                <div className=' h-10 p-1.5 flex justify-center items-center'>

                    <button
                        className={
                            cn('min-w-8 h-full rounded-[0.25rem] bg-[var(--o-color-gray-800)] flex justify-center items-center px-1', currentPage === totalPages ? "text-[var(--o-color-gray-600)]" : "text-[var(--o-color-gray-200)]")
                        }
                        onClick={nextPage} disabled={currentPage === totalPages}>
                        <ChevronRight strokeWidth={2} className='w-4 h-4' stroke={currentPage === totalPages ? "var(--o-color-gray-600)" : "var(--o-color-gray-200)"} />

                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaginatedList