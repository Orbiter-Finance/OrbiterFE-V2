import { TotasParmasType } from "@orbiter-finance/widget"
import { atom } from "jotai"
export const pageIsMobileAtom = atom(false)
export const userMainWalletAccountInfoKeyAtom = atom("EVM")

export const showQuestsDetailsAtom = atom(false)
export const showSettingsAtom = atom(false)

export const selectFromChainAtom = atom("11155111")
export const selectToChainAtom = atom("84532")
export const selectTokenAtom = atom("ETH")
export const bridgeContext = atom(null)
export const bridgetTransferAmountAtom = atom("")
// user target address
export const bridgeTargetAddressAtom = atom("")
// user target address
export const bridgeTargetAddressEnterStatusAtom = atom(false)
// user target address
export const bridgeTransactionAtom = atom({
    srcChain: "",
    tgtChain: "",
    srcToken: "",
    tgtToken: "",
    sendAmount: "",
    receiveAmount: "",
    srcTx: "",
    targetTx: "",
    tgtAddress: "",
    status: "",
    points: "",
})
// user target address
export const questsListAtom = atom<any[]>([])

// user point rank and total point

export interface UserPointsRankListType {
    address: string,
    points: number
    rank: number
}

export interface UserPointsDrawCardListType {
    address: string
    cardsCount: string | number
    progress: {
        currentProgress: string | number
        max: string | number
    }
}

export interface UserPointsInfoListType {
    address: string,
    points: number
    summary: {
        activePlatformPoint: string | number
        activityPoint: string | number
        basePoint: string | number
        dappPoint: string | number
        inscriptionPoint: string | number
        tgBindPoint: string | number
        thirdPartyPoint: string | number
        totalActivityPoint: string | number
    }
}

export const userPointsRankListAtom = atom<UserPointsRankListType[]>([])
export const userPointsDrawCardListAtom = atom<Array<UserPointsDrawCardListType | null>>([])
export const userPointsInfoListAtom = atom<Array<UserPointsInfoListType | null>>([])

export const pointRankShowAtom = atom(false)
export const pointRankUserAddressAtom = atom("")

export const pointCardShowAtom = atom(false)
export const pointCardUserAddressAtom = atom("")

export const pointsInfoRefreshAtom = atom(0)
export const showUserPointDetailsAtom = atom(false)


export const MqttSendTransactionAddressAtom = atom("")
export const MqttSendTransactionAddressRefreshAtom = atom(0)

export const currentPrizesProjectInfoAtom = atom<{ weekId: string, dayId: string }>({ weekId: "", dayId: "" })
export const prizesProjectInfoAtom = atom<any[]>([])
export const prizesPoolInfoAtom = atom<{
    totalTxsCount: string,
    totalAddressCount: string
    totalReward: string
}>({
    totalTxsCount: "",
    totalAddressCount: "",
    totalReward: ""
})

export const prizesUserInfoAtom = atom<{
    totalRank: string,
    totalTxCount: number | string,
    licenseCount: number | string
    fastPass: boolean
    lotteryRewards: Array<{ name: string, rewardAmount: string }>,
    weeklyLicense: boolean,
    weeklyLicenses: { name: string, rewardAmount: string }[],
    projectRankRewards: Array<{
        projectId: string
        rank: string | number
        txs: string | number
        weeklyLicense: boolean
        weeklyReward: {
            amount: string,
            name: string,
            uAmount: string
        }
    }>
}>({
    totalRank: "",
    totalTxCount: "",
    licenseCount: "",
    lotteryRewards: [],
    fastPass: false,
    weeklyLicense: false,
    weeklyLicenses: [],
    projectRankRewards: []
})

export const prizesRefreshNowAtom = atom(0)
export const prizesRankRoundListAtom = atom<any[]>([])
export const prizesRankTotalListAtom = atom<any[]>([])

export const bridgeToastInfoAtom = atom<{
    data: TotasParmasType | null,
    type: "success" | "error" | "info" | "warn",
    time: number
}|null>({
    data: null,
    type: "success",
    time: 0
})


