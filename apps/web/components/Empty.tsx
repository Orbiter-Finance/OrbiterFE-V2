"use client"

import Image from 'next/image'
import React from 'react'

export default function Empty({
  emptyText
}: {
  emptyText?: string
}) {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-full'>
        <div className='w-full flex justify-center items-center'><Image src="/assets/image/quests/empty.png" width={504} height={504} alt="empty" className='w-32 h-32' /></div>
        <div className='w-full flex justify-center items-center text-[var(--o-color-no-data-999)]'>
          {emptyText || "No Active Quests Available"}
        </div>
      </div>
    </div>
  )
}
