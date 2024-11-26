import { App } from "./App.js"
import { useCurrentWallet } from "./hooks/useCurrentWallet.js"
import { Page } from './page/Page.js'
import { Provider } from './Provider/Provider.js'
import { BridgeTransactionType } from "./stores/bridge.js"

export { useUpdateChainAndToken } from "./hooks/useUpdateChainAndToken.js"
export { useBridgeInfoContext } from "./bridgeInfo/providers.js"
export * from "./bridgeInfo/hooks/useExploreLink.js"
export * from "./bridgeInfo/hooks/useOrbiterGetChainsConfig.js"
export * from "./bridgeInfo/hooks/useTransactionRouter.js"
export * from "./hooks/useOrbiterToast.js"
export * from "./hooks/useWalletAddress.js"
export * from "./hooks/useBridgeData.js"
export { useUpgradeBridgeTransaction } from "./hooks/useUpgradeBridgeTransaction.js"
export { useTransactionInfo } from "./hooks/useTransactionInfo.js"
export { useCurrentWallet } from "./hooks/useCurrentWallet.js"
export { App as Widget } from "./App"
export { Page } from './page/Page.js'
export { BridgePage } from './page/BridgePage.js'
export { Provider } from './Provider/Provider.js'
export * from "@orbiter-finance/wallet-management"

export { type BridgeTransactionType }

export default {
  Widget: App,
  useCurrentWallet,
  Page,
  Provider
} 