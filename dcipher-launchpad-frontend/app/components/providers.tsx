'use client'

import '@rainbow-me/rainbowkit/styles.css'
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import {
    QueryClientProvider,
    QueryClient,
} from '@tanstack/react-query'

import {
    baseSepolia
} from 'wagmi/chains'
import { http } from 'wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

const config = getDefaultConfig({
    appName: 'DCipher Launchpad',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default',
    chains: [baseSepolia],
    ssr: true,
    // Use default transport if no Alchemy key is provided
    ...(process.env.NEXT_PUBLIC_ALCHEMY_KEY && {
        transports: {
            [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`)
        }
    })
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config as any}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
