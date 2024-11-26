"use client"

import { OrbiterIcon, OrbiterShow } from '@orbiter-finance/ui'
import React from 'react'
import useTimeOut from '../../../../hooks/useTimeOut'

export default function QuestsItem({
  data
}: { data: any }) {
  const { timeList } = useTimeOut(data?.endTime || "")
  return (
    <div className='first:mt-0 mt-4'>
      <div className='flex justify-between items-center w-full overflow-hidden'>
        <div className='flex justify-start items-center mr-2 w-2/3'>
          <OrbiterIcon type='CHAIN' iconId={data.label.icon} className='mr-1' />
          <label className='text-sm text-[var(--o-color-gray-50)] o-font-500 truncate flex-1' title={data.name} >{data?.name}</label>
          {/* <OrbiterTag tag='HOT' /> */}
        </div>
        <div className='flex justify-end items-center whitespace-nowrap w-1/3 text-sm'>
          {
            timeList.map((item, index) => {
              return <div key={index} className='flex justify-end items-center'>
                <OrbiterShow
                  when={!!index}
                >
                  <span className='mx-0.5'>:</span>
                </OrbiterShow>
                <span className='text-[var(--o-color-gray-50)] mr-px o-font-500'>{item.value}</span> {item.symbol}
              </div>
            })
          }
        </div>
      </div>
      <div className='bg-[var(--o-color-gray-900)] px-3 pb-3 rounded-lg mt-3 pt-1'>
        {
          data?.taskList?.map((item) => {

            return <div key={item.id} className='px-3 py-2 bg-[var(--o-color-gray-800)] rounded-lg mt-2'>
              <div className="flex text-[var(--o-color-gray-50)] o-font-500 text-sm" title={item.name}>{item.name}</div>
              <div className='mt-1 w-full flex justify-start items-center text-xs o-font-500 flex-wrap'>
                {
                  item?.tags?.map((option, index) => {
                    return <div key={index} className='bg-[var(--o-color-blue-900)] text-[var(--o-color-gray-50)] px-2 py-0.5 mt-1 mr-1 rounded-md' style={option?.style}>{option.description}</div>
                  })
                }
                <div className='px-2 py-0.5 bg-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)] rounded-md mt-1 mr-1'>+ {item.points} O-Points</div>
                <div className='px-2 py-0.5 bg-[var(--o-color-gray-700)] text-[var(--o-color-gray-400)] rounded-md mt-1 mr-1'>{item.progress.current}/{item.progress.total}</div>
              </div>
            </div>
          })
        }
      </div>
    </div>
  )
}
