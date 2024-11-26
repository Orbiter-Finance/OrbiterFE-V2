import React, { useContext, useEffect } from 'react'
import { useBalance } from '../../hooks/useBalance'
import { useCurrentWallet } from '../../hooks/useCurrentWallet'
import { useAtomValue, useSetAtom } from 'jotai'
import { bridgeBalanceDataGroupAtom, bridgeCurrentChainBalanceAtom, orbiterExploreInitAtom, selectFromChainAtom, selectTokenAtom } from '../../stores/bridge'
import { BridgeInfoContext } from '../../bridgeInfo/providers'
import { useWalletAddress } from 'src/hooks/useWalletAddress'

const BalanceAtom = () => {

  const { walletAddress } = useWalletAddress()

  const { getAllBalance, getCurrentBalance } = useBalance()

  const wallet = useCurrentWallet()
  const selectFromChain = useAtomValue(selectFromChainAtom)
  const orbiterExploreInit = useAtomValue(orbiterExploreInitAtom)
  const selectToken = useAtomValue(selectTokenAtom)
  const { orbiterClient } = useContext(BridgeInfoContext)

  const setBridgeCurrentChainBalance = useSetAtom(bridgeCurrentChainBalanceAtom)
  const bridgeBalanceDataGroup = useAtomValue(bridgeBalanceDataGroupAtom)


  useEffect(() => {
    let timer: NodeJS.Timeout
    if (orbiterExploreInit && walletAddress && selectFromChain && selectToken && (bridgeBalanceDataGroup.chainId !== selectFromChain || bridgeBalanceDataGroup.token !== selectToken || bridgeBalanceDataGroup.walletAddress !== walletAddress)) {
      if (orbiterClient) {
        timer = setTimeout(() => {
          getAllBalance()
        }, 200)
      }
    }
    return () => {
      clearTimeout(timer)
    }
  }, [walletAddress, selectFromChain, selectToken, getAllBalance, orbiterClient, bridgeBalanceDataGroup, orbiterExploreInit])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (wallet?.address && selectFromChain && selectToken) {
      if (orbiterClient) {
        timer = setTimeout(() => {
          getCurrentBalance()
        }, 200)
      } else {
        setBridgeCurrentChainBalance([{
          pending: false,
          balance: "0",
          error: false,
          chainId: ""
        }])
      }
    }
    return () => {
      clearTimeout(timer)
    }
  }, [wallet?.address, selectFromChain, selectToken, getCurrentBalance, orbiterClient, orbiterExploreInit])
  return (
    null
  )
}


export default React.memo(BalanceAtom)