import React from 'react'
import { CardHeaderType } from './card.type';
import { cn } from '../utils/cn';

export const CardHeader:React.FC<CardHeaderType> = ({
    left,
    right,
    className,
    ...rest
}) => {
  return (
    <div className={cn('w-full flex justify-between items-center', className)} {...rest}>
        <div className='flex items-center'>
            {left}
        </div>
        <div className='flex flex-end items-center'>
            {right}
        </div>
    </div>
  )
}
