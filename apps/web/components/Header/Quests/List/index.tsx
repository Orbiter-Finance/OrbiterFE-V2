"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { OrbiterIcon, OrbiterShow } from '@orbiter-finance/ui'
import QuestsItem from "./QuestsItem"
import { BASE_URL } from '../../../../app/constant'
import { pageIsMobileAtom, questsListAtom } from '../../../../stores/bridge'
import { objToParams } from '../../../../utils/objToParams'
import QuestsPending from './QuestsPending'
import Empty from '../../../Empty'
import useWalletAccount from '../../../../hooks/useWalletAccount'
export default function QuestsList() {
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const [questsList, setQuestsList] = useAtom(questsListAtom)
    const { MainWalletAccountInfo } = useWalletAccount()
    const [pending, setPending] = useState(true)
    const init = useCallback(
        async () => {
            setPending(true)
            try {
                const response = await fetch(BASE_URL + `/points_system/v2/activity/list` + objToParams({
                    page: 1,
                    pageSize: 10,
                    ...(MainWalletAccountInfo?.address ? ({ address: MainWalletAccountInfo?.address }) : {})
                }))
                const res = await response.json()
                setQuestsList(res?.data?.list || [])
                setPending(false)
            } catch (error) {
                setPending(false)
            }
        },
        [MainWalletAccountInfo?.address, setQuestsList],
    )
    useEffect(() => {
        const timer = setTimeout(() => {
            init()
        }, 200)
        return () => {
            clearTimeout(timer)
        }
    }, [MainWalletAccountInfo?.address])
    const questsData = useMemo(() => {
        let list: any[] = []
        questsList.forEach((item) => {
            item.taskList.forEach((option: any) => {
                list = list.concat([{
                    ...option,
                    icon: item?.label?.icon || ""
                }])
            })

        })
        return list.filter((item) => Number(item?.status) === 0)
    }, [questsList])

    return (
        <OrbiterShow
            when={!pending}
            fallback={
                <div className='w-full'>
                    {
                        new Array(5).fill(0).map((item, index) => {
                            return <QuestsPending key={index} />
                        })
                    }
                </div>
            }
        >
            <OrbiterShow
                when={!!questsData?.length}
                fallback={
                    <div className='w-full flex mt-20'>
                        <Empty />
                    </div>
                }
            >
                <div className='w-full'>
                    {
                        questsList.map((item) => {
                            return <QuestsItem key={item.id} data={item} />
                        })
                    }
                </div>

            </OrbiterShow>

        </OrbiterShow>
    )
}