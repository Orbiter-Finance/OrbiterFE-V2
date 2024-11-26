import React, { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BridgeInfoProvider, ProjectInfoType, SelectChainItemConfigType } from '../bridgeInfo/providers.js'
import { InitialDataType } from '../components/AtomCom.js'
import { WalletProvides, WalletProviderConfigType } from '@orbiter-finance/wallet-management'
import { Provider as JotaiProvider } from 'jotai'
import { BridgeTransactionType } from '../stores/bridge.js'
import { ProviderChild } from './ProviderChild.js'

const queryClient = new QueryClient()

export interface ConfigType extends WalletProviderConfigType {
  initialData?: InitialDataType
  projectInfo?: ProjectInfoType
  selectChainConfig?: SelectChainItemConfigType[]
  LogEvent?: (method: string, params: string) => void
  reportTx?: (chainId: string, hash: string, params?: BridgeTransactionType) => void
  isCustomHeader?: boolean,
}

export interface ProviderType {
  children: ReactNode,
  config: ConfigType,
}

export const Provider = React.memo(({ children, config }: ProviderType) => {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <WalletProvides config={{
          isMainnet: config?.isMainnet,
          disbaledVm: config?.disbaledVm,
          ton: config?.ton,
          hostEnvironment: config?.hostEnvironment,
          totas: config?.totas
        }}>
          <BridgeInfoProvider
            selectChainConfig={config?.selectChainConfig || []}
            projectInfo={config?.projectInfo}
            isMainnet={config.isMainnet}
            LogEvent={config?.LogEvent}
            reportTx={config?.reportTx}
            disbaledVm={config.disbaledVm || []}
            isCustomHeader={!!config?.isCustomHeader}
            hostEnvironment={config?.hostEnvironment}
          >
            <ProviderChild initialData={config?.initialData}>
              {children}
            </ProviderChild>
          </BridgeInfoProvider>
        </WalletProvides>
      </JotaiProvider>
    </QueryClientProvider>
  )
})
