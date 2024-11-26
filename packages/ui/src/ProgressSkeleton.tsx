import React, { HTMLAttributes } from "react"
import { cn } from "./utils/cn"

export const ProgressSkeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return (
    <div className={
      cn('w-full h-full rounded-lg overflow-hidden bg-[var(--o-color-gray-700)]', className)
    }  {...rest}>
      <div  className='w-full h-full progress-skeleton'>
      </div>
    </div>

  )
}
