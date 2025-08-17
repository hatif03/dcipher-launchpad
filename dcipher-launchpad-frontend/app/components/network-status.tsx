'use client'

import { useWallet } from '../hooks/use-wallet'
import { useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export function NetworkStatus() {
  const { isConnected, isOnSupportedNetwork, chainId } = useWallet()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected || isOnSupportedNetwork) {
    return null
  }

  return (
    <div className="bg-yellow-100 border-2 border-yellow-600 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
          <div>
            <h3 className="font-bold text-yellow-800">Wrong Network</h3>
            <p className="text-sm text-yellow-700">
              You're currently on Chain ID: {chainId || 'an unsupported network'}. 
              Please switch to Base Sepolia (Chain ID: 84532) to use DCipher Launchpad.
            </p>
          </div>
        </div>
        <button
          onClick={() => switchChain?.({ chainId: baseSepolia.id })}
          disabled={isPending}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          {isPending ? 'Switching...' : 'Switch to Base Sepolia'}
        </button>
      </div>
    </div>
  )
}
