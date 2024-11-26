import React from 'react'

import { CradTypes } from './card.type'
import { cn } from '../utils/cn'
import { OrbiterShow } from '../OrbiterShow'

export const OrbiterCard: React.FC<CradTypes> = ({
    isBorder = false,
    children,
    className,
    onClick,
    ...rest
}) => {

    const defaultClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        event.stopPropagation()
    }

    return (
        <OrbiterShow
            when={!!isBorder}
            fallback={
                <div
                    className={
                        cn("w-full bg-[var(--o-color-gray-900)] rounded-3xl p-4", className)
                    }
                    onClick={
                        onClick || defaultClick
                    }
                    {...rest}
                >
                    {children}
                </div>
            }
        >
            <div
                onClick={
                    onClick || defaultClick
                }
                className={
                    cn("w-full bg-[var(--o-color-gray-900)] rounded-3xl p-4 border border-[var(--o-color-gray-700)]", className)
                }
                {...rest}
            >
                {children}
            </div>
        </OrbiterShow>

    )
}
