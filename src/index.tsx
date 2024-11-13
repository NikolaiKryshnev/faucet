import React from "react";
import ReactDOM from "react-dom";
import '@mysten/dapp-kit/dist/index.css';
import { type Chain } from 'viem'
import FaucetRoutes from "./FaucetRoutes";
import { http } from 'wagmi'

import {holesky} from 'wagmi/chains';
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {
  AptosWalletAdapterProvider,
} from "@aptos-labs/wallet-adapter-react";
import {PetraWallet} from "petra-plugin-wallet-adapter";
import {PontemWallet} from "@pontem/wallet-adapter-plugin";
import {MartianWallet} from "@martianwallet/aptos-wallet-adapter";
import {RiseWallet} from "@rise-wallet/wallet-adapter";
import {FewchaWallet} from "fewcha-plugin-wallet-adapter";
import {StatsigProvider} from "statsig-react";
import {NightlyWallet} from "@nightlylabs/aptos-wallet-adapter-plugin";
import {OpenBlockWallet} from "@openblockhq/aptos-wallet-adapter";
import {TokenPocketWallet} from "@tp-lab/aptos-wallet-adapter";
import {TrustWallet} from "@trustwallet/aptos-wallet-adapter";
import {WelldoneWallet} from "@welldone-studio/aptos-wallet-adapter";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
 
// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	m2: { url: 'https://devnet.baku.movementlabs.xyz', language: 'sui' },
});


// 1. Your WalletConnect Cloud project ID
const projectId = '47763f0426c0cb4279a4ccfae07b46bf'

// 2. Create wagmiConfig
const metadata = {
  name: 'Movement Faucet',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const mevm = {
  id: 30732,
  name: 'MEVM',
  nativeCurrency: {
    name:'Move', symbol: 'MOVE', decimals: 18
  },
  rpcUrls: {
    default: { http: ['https://mevm.devnet.imola.movementlabs.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Movement Explorer', url: 'https://explorer.movementlabs.xyz' },
  },
} as const satisfies Chain

const chains = [holesky, mevm] as const
export const config = defaultWagmiConfig({
  chains: chains,
  transports: {[holesky.id]: http("https://holesky.gateway.tenderly.co"),[mevm.id] : http('https://mevm.devnet.imola.movementlabs.xyz')},
  projectId,
  metadata,
})


createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeVariables: {
    '--w3m-border-radius-master': '0px',
    '--w3m-accent': '#FFDA34',
  }
})

// inform the compiler of the existence of the window.aptos API
declare global {
  interface Window {
    aptos: any;
  }
}

const queryClient = new QueryClient();

const wallets = [
  new PetraWallet(),
  new PontemWallet(),
  new MartianWallet(),
  new FewchaWallet(),
  new RiseWallet(),
  new NightlyWallet(),
  new OpenBlockWallet(),
  new TokenPocketWallet(),
  new TrustWallet(),
  new WelldoneWallet(),
];

ReactDOM.render(
  <React.StrictMode>
    <StatsigProvider
      sdkKey={
        process.env.REACT_APP_STATSIG_SDK_KEY ||
        "client-78XrPWGisrqq4IRQyYWuenLEe4oMaUdSqRcsCYbMeqj"
      }
      waitForInitialization={true}
      options={{
        environment: {tier: process.env.NODE_ENV},
      }}
      user={{}}
    >
      <QueryClientProvider client={queryClient}>
        <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="m2">
        <WalletProvider>
        <WagmiProvider config={config}>
          <BrowserRouter>
          <FaucetRoutes />
          </BrowserRouter>
          </WagmiProvider>
          </WalletProvider>
          </SuiClientProvider>
          </AptosWalletAdapterProvider>
          </QueryClientProvider>
      </QueryClientProvider>
    </StatsigProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);