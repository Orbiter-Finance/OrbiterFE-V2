import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  cookieStorage,
  createConfig,
  createStorage
} from 'wagmi'
import { metaMask } from 'wagmi/connectors';
export function getConfig(chains:any) {
  const MetaMaskOptions = {
    dappMetadata: {
      name: "Example Wagmi dapp",
    },
    infuraAPIKey: "YOUR-API-KEY",
    // Other options.
  }
  // const connectors = connectorsForWallets(
  //   [
  //     {
  //       groupName: "Recommended",
  //       wallets:[nm]
  //     },
  //   ],
  //   {
  //     appName: "Orbiter Finance",
  //     projectId: '',
  //   }
  //   // other configs
  // );
  const config: any = createConfig({
    connectors:[
      metaMask(MetaMaskOptions),
    ],
    transports: {},
    chains: chains as any,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
  });
  return config;
}

