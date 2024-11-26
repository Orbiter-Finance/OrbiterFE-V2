import { Endpoint, ExploreLinkProvider } from "@orbiter-finance/explore-link"
import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import { codexFieldWalletRainbowKit } from "codexfield-wallet-connector"
import { HOSTtENVIRONMENT } from "../constant"
import { TomoWalletConnector } from "../wallets/TomoWalletConnector"
import { UxuyWallet } from "../wallets/UxuyWallet"
import { fallback, http } from "viem"
import {
    injectedWallet,
    walletConnectWallet,
    metaMaskWallet,
    okxWallet,
    coinbaseWallet,
    binanceWallet,
    bitgetWallet,
  } from "@rainbow-me/rainbowkit/wallets";
  import * as rainbowkitWallets from "@rainbow-me/rainbowkit/wallets";
import { cookieStorage, createConfig, createStorage } from "wagmi"

export const getConfig = (exploreLink: ExploreLinkProvider, hostEnvironmenth: HOSTtENVIRONMENT, projectId: string) => {
      const chainGroup = exploreLink.getChains();
      
      const list: any[] = Object.keys(chainGroup).map((key) => {
        return chainGroup[key];
      }).filter((item) => {
        return item && item?.vm === "EVM";
      });
      const chainS = list.map((item) => {
        const rpcs = (item?.rpc || []).filter((option: string) => !option.includes("${") && !option.includes("wss://") && !option.includes("ws://"));
        return ({
          blockExplorers: {
            default: {
              name: (item?.explorers as any[] || [])[0]?.name || "",
              url: (item?.explorers as any[] || [])[0]?.url || "",
            },
            etherscan: {
              name: (item?.explorers as any[] || [])[0]?.name || "",
              url: (item?.explorers as any[] || [])[0]?.url || "",
            }
          },
          contracts: {},
          fees: undefined,
          formatters: undefined,
          name: item?.name,
          id: Number(item?.chainId),
          nativeCurrency: item?.nativeCurrency,
          network: item?.name || "",
          serializers: undefined,
          rpcUrls: {
            default: {
              http: rpcs
            },
            public: {
              http: rpcs
            }
          }
        });
      })

      let transportGroup = {
      };
  
      if (chainS?.length) {
        chainS.forEach((item) => {
          transportGroup = {
            ...transportGroup,
            [Number(item.id)]: fallback(item.rpcUrls.default.http.map((option: string) => {
              return http(option);
            }))
          };
        });
      }

      const connectors = connectorsForWallets(
        [
          {
            groupName: "Recommended",
            wallets: hostEnvironmenth === HOSTtENVIRONMENT.TELEGRAM ? [
              walletConnectWallet
            ] : [
              walletConnectWallet,
              metaMaskWallet,
              binanceWallet,
              okxWallet,
              coinbaseWallet,
              bitgetWallet,
              injectedWallet,
              UxuyWallet
            ],
          },
          hostEnvironmenth === HOSTtENVIRONMENT.TELEGRAM ? {
            groupName: "TG Wallet",
            wallets: [
              codexFieldWalletRainbowKit,
              UxuyWallet,
              TomoWalletConnector,
            ],
          } :
            {
              groupName: "More",
              wallets: [
                codexFieldWalletRainbowKit,
                TomoWalletConnector,
                ...(Object.keys(rainbowkitWallets).map(walletName => (rainbowkitWallets as any)[walletName]) || [])
              ],
            },
        ],
        {
          appName: "Orbiter Finance",
          projectId,
        }
        // other configs
      );

      const wagmiConfigMemo = createConfig({
        chains: chainS as any,
        ccipRead: false,
        transports: transportGroup,
        connectors,
        multiInjectedProviderDiscovery: false,
        storage: createStorage({
          storage: cookieStorage,
        }),
        ssr: true,
      });

      // exploreLink.on('ready',(res) => {
      //   // 
      //   console.log(res, wagmiConfigMemo, 'callback---')
      // })

      return wagmiConfigMemo
}

