import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const Button = ({
    children,
    onClick,
    disabled,
    size = 'default',
    className,
    ...rest
}: {
    children: React.ReactNode
    onClick: () => Promise<void> | void
    disabled?: boolean
    size?: 'small' | 'default' | 'connect'
    className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const [loading, setLoading] = useState(false)
    const handleClick = useCallback(async () => {
        try {
            setLoading(true)
            await onClick()
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }, [onClick])
    const btnClass = useMemo(() => {
        const classMap = {
            small: {
                base: 'h-7 w-16 rounded-lg',
                disabled: 'bg-[var(--o-color-gray-700)] text-[var(--o-color-text-t4)]',
                normal: 'bg-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)] hover:bg-[var(--o-color-brand-800)]',
            },
            connect: {
                base: 'rounded-2xl o-font-600 text-xl  w-full h-14 flex justify-center items-center',
                disabled: 'text-[var(--o-color-text-t4)] bg-[var(--o-color-gray-700)]',
                normal: 'text-[var(--o-color-brand-500)] bg-[var(--o-color-brand-900)] hover:bg-[var(--o-color-brand-800)]',
            },
            default: {
                base: 'rounded-2xl o-font-600 text-xl  w-full h-14 flex justify-center items-center',
                disabled: 'text-[var(--o-color-text-t4)] bg-[var(--o-color-gray-700)]',
                normal: 'text-[var(--o-color-black)] bg-[var(--o-color-brand-500)]  hover:bg-[var(--o-color-brand-500)]',
            },
        }
        const classObj = classMap[size] || classMap['default']
        return twMerge(
            classObj.base,
            disabled || loading ? classObj.disabled : classObj.normal,
            className,
        )
    }, [size, className, disabled, loading])
    return (
        <button disabled={disabled || loading} className={btnClass} onClick={handleClick} {...rest}>
            {loading ? (size === 'small' ? 'Pending' : 'Pending...') : children}
        </button>
    )
}
