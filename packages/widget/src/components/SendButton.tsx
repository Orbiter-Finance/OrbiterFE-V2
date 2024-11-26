import React, { useCallback, useContext, useMemo, useState } from 'react'
import { RouterType, TradePair } from '@orbiter-finance/bridge-sdk'
import { useAtomValue, useSetAtom } from 'jotai'
import { useSelectChains } from '../bridgeInfo/hooks/useSelectChains.js'
import { PAGE_TYPE } from '../constant.js'
import { useBridgeRouter } from '../hooks/useBridgeRouter.js'
import { useCurrentWallet } from '../hooks/useCurrentWallet.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'
import { useTargetAddress } from '../hooks/useTargetAddress.js'
import { useWallet } from '../hooks/useWallet.js'
import { selectFromChainAtom, selectToChainAtom, selectTokenAtom, bridgetTransferAmountAtom, bridgeTransactionAtom, bridgeTransactionRefreshAtom, BridgeTransactionType, bridgeCurrentChainBalanceAtom, bridgeRouterGasFeeGroupAtom } from '../stores/bridge.js'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import { OrbiterShow, OrbiterCard } from "@orbiter-finance/ui"
import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig.js'
import { useOrbiterToast } from '../hooks/useOrbiterToast.js'
import useBridgeLogEvent from '../hooks/useBridgeLogEvent.js'
import { parseEther } from 'viem'


export function SendButton() {

  const CurrentWallet = useCurrentWallet()

  const { orbiterClient, reportTx } = useContext(BridgeInfoContext)
  const selectFromChain = useAtomValue(selectFromChainAtom)
  const selectToChain = useAtomValue(selectToChainAtom)
  const selectToken = useAtomValue(selectTokenAtom)
  const bridgetTransferAmount = useAtomValue(bridgetTransferAmountAtom)
  const { getWallet } = useWallet()
  const setBridgeTransaction = useSetAtom(bridgeTransactionAtom)
  const [pending, setPending] = useState(false)
  const { getChainsConfig } = useOrbiterGetChainsConfig()
  const setBridgeTransactionRefresh = useSetAtom(bridgeTransactionRefreshAtom)

  const { targetAddress } = useTargetAddress()
  const [fromBalance] = useAtomValue(bridgeCurrentChainBalanceAtom)
  const { value: gasAmount, pending: gasPending } = useAtomValue(bridgeRouterGasFeeGroupAtom)
  const { updatePageModalType } = usePageTypeUpdate()
  const { orbiterTotas } = useOrbiterToast()
  const { simulationAmount } = useBridgeRouter()

  const { balance, error, pending: balancePending } = fromBalance || {
    balance: "0",
    pending: false,
    error: false,
    chainId: ""
}


  const { bridgeLogEvent, BRIDGE_EVENT } = useBridgeLogEvent()

  const toChainList = useSelectChains(true)

  const toWallet = useMemo(() => getWallet(selectToChain), [getWallet, selectToChain])

  const onCloseSend = useCallback(
    () => {
      setPending(false)
    },
    [],
  )

  const send = useCallback(
    async () => {
      if (!orbiterClient || !targetAddress) return null
      setPending(true)
      const fromWallet = getWallet(selectFromChain)
      try {
        const toWallet = getWallet(selectToChain)

        const chainConfig = getChainsConfig(selectFromChain)
        bridgeLogEvent(BRIDGE_EVENT.sendTransaction)

        if (!fromWallet?.address) {
          fromWallet?.connect()
          onCloseSend()
          bridgeLogEvent(BRIDGE_EVENT.connectWallet, fromWallet?.type)
          return
        }

        if (!fromWallet.checkChain(chainConfig?.networkId || "")) {
          await fromWallet?.switchChain(chainConfig?.networkId || "")
          onCloseSend()
          bridgeLogEvent(BRIDGE_EVENT.switchWalletChain, fromWallet?.type)
          return
        }

        if (!targetAddress || !toWallet?.checkAddress(targetAddress)) {
          toWallet?.connect()
          onCloseSend()
          bridgeLogEvent(BRIDGE_EVENT.connectWallet, toWallet?.type)
          return
        }

        const tradePair: TradePair = {
          srcChainId: selectFromChain,
          dstChainId: selectToChain,
          srcTokenSymbol: selectToken,
          dstTokenSymbol: selectToken,
        }
        const router = orbiterClient.createRouter(tradePair)
        const { sendAmount, receiveAmount } = await router.simulationAmountPlusWithHoldingFee(
          bridgetTransferAmount.toString()
        )

        const transaction = await router.createTransaction(
          getWallet(selectFromChain)?.address || "",
          targetAddress,
          sendAmount
        )

        // simulationAmount
        let allowance: any = ""
        let approve: any = ""
        if (transaction.routerType !== RouterType.EOA) {
          try {
            allowance = await router.createAllowance(
              fromWallet.address
            )
            approve = await router.createApprove(
              fromWallet.address,
              sendAmount
            )
          } catch (error) {
            console.log("error", error)
          }
        }

        console.log("parmas",  {
          params: transaction.raw,
          chainId: selectFromChain,
          allowance,
          approve,
          contractAddress: router.contractAddress,
          makerAddress: router.makerAddress,
          token: router.srcToken,
          value: transaction.value,
          isMainnet: selectToken === chainConfig?.nativeCurrency?.symbol,
          vm: chainConfig?.vm
        })

        const res = await fromWallet?.transfer(
          {
            params: transaction.raw,
            chainId: selectFromChain,
            allowance,
            approve,
            contractAddress: router.contractAddress,
            makerAddress: router.makerAddress,
            token: router.srcToken,
            value: transaction.value,
            isMainnet: selectToken === chainConfig?.nativeCurrency?.symbol,
            vm: chainConfig?.vm
          }
        )
        if (!res) {
          onCloseSend()
          return
        }

        bridgeLogEvent(BRIDGE_EVENT.confirmTransaction, fromWallet?.type)


        updatePageModalType(PAGE_TYPE.CONFIRM)
        setBridgeTransactionRefresh(+new Date())
        const bridgeTransaction: BridgeTransactionType = {
          fromAddress: getWallet(selectFromChain)?.address || "",
          srcChain: selectFromChain,
          tgtChain: selectToChain,
          srcToken: selectToken,
          tgtToken: selectToken,
          sendAmount,
          receiveAmount: receiveAmount,
          srcTx: res,
          targetTx: "",
          tgtAddress: targetAddress,
          status: "",
          points: "",
          timeStamp: ""
        }
        setBridgeTransaction(bridgeTransaction)
        reportTx && reportTx(selectFromChain, res, bridgeTransaction)
      } catch (error) {
        bridgeLogEvent(BRIDGE_EVENT.sendTransactionError)
        onCloseSend()
        const errorList = String((error as any)?.data?.message || (error as any)?.message || error).split(".")
        console.log("error", error, errorList)
        orbiterTotas.error({
          title: errorList[0] || "error"
        })
      }
      onCloseSend()
    }, [reportTx, orbiterClient, bridgeLogEvent, onCloseSend, targetAddress, selectFromChain, selectToChain, selectToken, getWallet, bridgetTransferAmount, toChainList, getChainsConfig]
  )

  const checkBalance = useMemo(() => {
    if (!balancePending && simulationAmount && !gasPending) {
      const gasFee = parseEther(gasAmount || "0")
      const sendAmount = simulationAmount.sendAmount
      return (parseEther(balance || "0") - gasFee) >= parseEther(sendAmount)
    }
    return false
  }, [balance, balancePending, simulationAmount, gasPending, gasAmount])

  const label = useMemo(() => {

    if (!targetAddress) {
      return `Connect ${getChainsConfig(selectToChain)?.name || ""} Wallet`
    }

    if (!bridgetTransferAmount) {
      return "Enter Bridge Amount"
    }

    if (!simulationAmount) {
      return "Amount exceeds the range"
    }

    if (!checkBalance && !balancePending && !gasPending) {
      return "Insufficient Balance"
    }

    if (pending) {
      return "Pending..."
    }

    return "Send"

  }, [bridgetTransferAmount, checkBalance, simulationAmount, gasPending, balancePending, pending, targetAddress, selectToChain, getChainsConfig])

  return (
    <OrbiterShow
      when={!!targetAddress && !!CurrentWallet?.address}
      fallback={
        <OrbiterCard
          className='py-2 px-4 mt-3 cursor-pointer h-14 text-lg rounded-2xl sm:text-xl hover:bg-[var(--o-color-brand-800)] bg-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)] flex justify-center items-center o-font-600'
          onClick={(event) => {
            event.stopPropagation()
            if (!CurrentWallet?.address) {
              CurrentWallet?.connect()
              bridgeLogEvent(BRIDGE_EVENT.connectWallet, CurrentWallet?.type)
            } else if (!toWallet?.address) {
              getWallet(selectToChain)?.connect()
              bridgeLogEvent(BRIDGE_EVENT.connectWallet, getWallet(selectToChain)?.type)
            } else {
              console.log("check to chain address")
            }
          }}
        >
          {!CurrentWallet?.address ? "Connect Wallet" : (toWallet?.address ? `Check ${getChainsConfig(selectToChain)?.name || ""} Address` : `Connect ${getChainsConfig(selectToChain)?.name || ""} Wallet`)}
        </OrbiterCard>
      }
    >
      <OrbiterShow when={!!bridgetTransferAmount && !!simulationAmount && !pending && !!targetAddress && !!checkBalance}
        fallback={
          <button className='py-2 px-4 mt-3 h-14 w-full rounded-2xl bg-[var(--o-color-gray-700)] text-[var(--o-color-gray-400)] text-xl o-font-600'>
            {label}
          </button>
        }
      >
        <button
          className='py-2 px-4 mt-3 h-14 w-full rounded-2xl bg-[var(--o-color-brand-500)] hover:bg-[var(--o-color-brand-400)] text-[var(--o-color-gray-50)] text-xl o-font-600'
          onClick={async (event) => {
            event.stopPropagation()
            await send()
          }}
        >
          Bridge
        </button>
      </OrbiterShow>
    </OrbiterShow>
  )
}
