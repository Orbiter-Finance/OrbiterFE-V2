import React from 'react'
import { pageIsMobileAtom } from '../../stores/bridge'
import { useAtomValue } from "jotai"
import { OrbiterShow } from '@orbiter-finance/ui'
import { ConnectWallet } from '../ConnectWallet'
import QuestOPoint from './Quests/Modal/QuestOPoint'
import OrbiterQuestsDetails from './OrbiterQuestsDetails'
import useWalletAccount from '../../hooks/useWalletAccount'
import Setting from './Setting'
export const HeaderTools = React.memo(() => {

    const { MainWalletAccountInfo } = useWalletAccount()
    const pageIsMobile = useAtomValue(pageIsMobileAtom)

    return (
        <div className="flex justify-end items-center">
            <OrbiterShow
                when={!pageIsMobile && !!MainWalletAccountInfo?.address}
            >
                <div className='mr-3 flex justify-center items-center'><QuestOPoint /></div>
            </OrbiterShow>
            <ConnectWallet />
            <OrbiterQuestsDetails />
            <OrbiterShow
                when={pageIsMobile}
            >
                <Setting />
            </OrbiterShow>
        </div>
    )
})
