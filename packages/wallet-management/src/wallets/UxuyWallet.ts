

import type { Wallet, DefaultWalletOptions } from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
import type { EIP1193Provider } from 'viem'

import { createConnector } from "wagmi"
import { injected } from 'wagmi/connectors'

import { WalletTgSdk } from "@uxuycom/web3-tg-sdk"

export const UxuyWallet = ({
    walletConnectParameters,
    projectId,
}: DefaultWalletOptions): Wallet => {
    let provider: unknown | EIP1193Provider
    return {
        id: 'uxuyWallet',
        name: 'UXUY Wallet',
        // iconUrl: sdk.getAppInfo().logo,
        iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSIjRkY3NDAwIi8+CjxwYXRoIGQ9Ik0zMDAuMDcgMzY2LjI0SDcyNC4zNjJDNzYzLjE5IDM2Ni4yNCA3OTQuNjY3IDM5Ny43MTcgNzk0LjY2NyA0MzYuNTQ1VjcxMS43NjhDNzk0LjY2NyA3NTAuNTk3IDc2My4xOSA3ODIuMDczIDcyNC4zNjIgNzgyLjA3M0gzMDAuMDcxQzI2MS4yNDMgNzgyLjA3MyAyMjkuNzY2IDc1MC41OTcgMjI5Ljc2NiA3MTEuNzY4VjQzNi41NDNDMjI5Ljc2NiAzOTcuNzE2IDI2MS4yNDIgMzY2LjI0IDMwMC4wNyAzNjYuMjRaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI5LjUzMjg4Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjQyLjk3MSAyNzcuNjA5TDMwOS41MDkgMzE3LjE3MUMyODIuMjc0IDMyMC40MDIgMjYxLjA1NiAzNDIuMzIyIDI1OC43MTMgMzY5LjY0OEwyNTguMzI3IDM3NC4xNTVWMzkwLjkzNkg2OTYuMDI5TDY3NC4zNzYgMjk5LjU2QzY3MS4wMDQgMjg1LjMyNyA2NTcuNDk1IDI3NS44ODYgNjQyLjk3MSAyNzcuNjA5Wk03MDYuNjU3IDI5MS45MUM2OTkuMzk4IDI2MS4yNzggNjcwLjMyNCAyNDAuOTU2IDYzOS4wNjMgMjQ0LjY2NUwzMDUuNjAxIDI4NC4yMjdDMjYyLjczOCAyODkuMzEyIDIyOS4zNDYgMzIzLjgxIDIyNS42NiAzNjYuODE1TDIyNS4xNTIgMzcyLjczNlY0NDYuMzY1TDI3MC4yNjYgNDIyLjU5SDczNy42MjNMNzA2LjY1NyAyOTEuOTFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTIzLjA5MiA3MjEuMzU0SDU4My4yNjNDNTk2LjA2NyA3MjEuMzU0IDYwMi45NzkgNzA2LjMzOSA1OTQuNjUyIDY5Ni42MTJMNTAyLjI3NCA1ODguNjk2QzUwMS41IDU4Ny43OTIgNTAxLjUwMyA1ODYuNDU3IDUwMi4yODIgNTg1LjU1N0w2MjUuNzI3IDQ0Mi43NEM2MzQuMTIzIDQzMy4wMjggNjI3LjIyMyA0MTcuOTQ0IDYxNC4zODUgNDE3Ljk0NEg1NTQuMzE0QzU0OS45NTUgNDE3Ljk0NCA1NDUuODEyIDQxOS44NDEgNTQyLjk2NCA0MjMuMTRMNDA5Ljc2OSA1NzcuNDYzQzQwNC45MjcgNTgzLjA3MyA0MDQuOTExIDU5MS4zOCA0MDkuNzMgNTk3LjAwOUw1MTEuNzA0IDcxNi4xMTJDNTE0LjU1MiA3MTkuNDM5IDUxOC43MTMgNzIxLjM1NCA1MjMuMDkyIDcyMS4zNTRaIiBmaWxsPSIjRkY3NDAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEyLjU4NSIvPgo8cGF0aCBkPSJNMzIyLjMzOSA3MjEuMzU2SDM4Mi40NjNDMzg2LjgzIDcyMS4zNTYgMzkwLjk4MSA3MTkuNDUxIDM5My44MjkgNzE2LjE0TDQ5Ni4zOTggNTk2Ljg5NUM1MDEuMjMzIDU5MS4yNzQgNTAxLjIzMyA1ODIuOTYzIDQ5Ni4zOTkgNTc3LjM0MkwzOTMuODI5IDQ1OC4wODRDMzkwLjk4MSA0NTQuNzcyIDM4Ni44MyA0NTIuODY4IDM4Mi40NjIgNDUyLjg2OEgzMjIuMzM4QzMwOS41MTggNDUyLjg2OCAzMDIuNjEyIDQ2Ny45MTYgMzEwLjk3MiA0NzcuNjM2TDQwMy43ODMgNTg1LjU0OEM0MDQuNTU5IDU4Ni40NTEgNDA0LjU1OSA1ODcuNzg1IDQwMy43ODMgNTg4LjY4OEwzMTAuOTczIDY5Ni41ODdDMzAyLjYxMyA3MDYuMzA3IDMwOS41MTggNzIxLjM1NiAzMjIuMzM5IDcyMS4zNTZaIiBmaWxsPSIjRkY3NDAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEyLjU4NSIvPgo8cGF0aCBkPSJNNzMxLjYyNyA0ODdDNjg2LjgzNSA0ODcgNjUwLjUyMyA1MjMuMzExIDY1MC41MjMgNTY4LjEwM0M2NTAuNTIzIDYxMi44OTUgNjg2LjgzNSA2NDkuMjA3IDczMS42MjcgNjQ5LjIwN0g4MDguMDAyQzgzNS4yMTcgNjQ5LjIwNyA4NTcuMjc5IDYyNy4xNDUgODU3LjI3OSA1OTkuOTNWNTM2LjI3N0M4NTcuMjc5IDUwOS4wNjIgODM1LjIxNyA0ODcgODA4LjAwMiA0ODdINzMxLjYyN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNODA4LjAwMiA1MTguMjc5SDczMS42MjdDNzA0LjExIDUxOC4yNzkgNjgxLjgwMiA1NDAuNTg2IDY4MS44MDIgNTY4LjEwM0M2ODEuODAyIDU5NS42MiA3MDQuMTEgNjE3LjkyOCA3MzEuNjI3IDYxNy45MjhIODA4LjAwMkM4MTcuOTQyIDYxNy45MjggODI2IDYwOS44NyA4MjYgNTk5LjkzVjUzNi4yNzdDODI2IDUyNi4zMzcgODE3Ljk0MiA1MTguMjc5IDgwOC4wMDIgNTE4LjI3OVpNNzMxLjYyNyA0ODdDNjg2LjgzNSA0ODcgNjUwLjUyMyA1MjMuMzExIDY1MC41MjMgNTY4LjEwM0M2NTAuNTIzIDYxMi44OTUgNjg2LjgzNSA2NDkuMjA3IDczMS42MjcgNjQ5LjIwN0g4MDguMDAyQzgzNS4yMTcgNjQ5LjIwNyA4NTcuMjc5IDYyNy4xNDUgODU3LjI3OSA1OTkuOTNWNTM2LjI3N0M4NTcuMjc5IDUwOS4wNjIgODM1LjIxNyA0ODcgODA4LjAwMiA0ODdINzMxLjYyN1oiIGZpbGw9IiNGRjc0MDAiLz4KPGNpcmNsZSBjeD0iNzM1LjEyNSIgY3k9IjU2OC45MDUiIHI9IjI1LjkwNDciIGZpbGw9IiNGRjc0MDAiLz4KPC9zdmc+Cg==",
        installed: true,
        iconBackground: '#000000',
        createConnector: (walletDetails) => {
            return createConnector((config) => ({
                ...injected({
                    // shimDisconnect: false

                })(config),
                ...walletDetails,
                getProvider: async () => {
                    if (provider) return provider
                    // const { WalletTgSdk } = (await import("@uxuycom/web3-tg-sdk")).default
                    const sdk = new WalletTgSdk({
                        injected: true,
                        projectId,
                        // @ts-ignore
                        metaData: {
                            icon: walletConnectParameters?.metadata?.icons?.[0],
                            name: walletConnectParameters?.metadata?.name,
                            description: walletConnectParameters?.metadata?.description,
                            url: walletConnectParameters?.metadata?.url,
                        }
                    })
                    provider = sdk.ethereum
                    return provider
                },
            }))
        },

    }
}