import React, { ReactNode } from 'react'

export function CardGroup({children}: {children:ReactNode}) {
    return (
        <div className='w-full flex justify-center items-center'>
            <div className="w-full orbiter-card relative p-px max-w-[30.5rem] min-h-[28rem] rounded-[1.3125rem]">

                <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden rounded-[1.3125rem]">
                    <div className="card-shadow1"></div>
                    <div className="card-shadow2"></div>
                    <div className="card-shadow3"></div>
                    <div className="card-shadow4"></div>
                </div>
                <div className='w-full p-px bg-[var(--o-color-black)] min-h-[28rem] rounded-[1.28125rem] relative z-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}
