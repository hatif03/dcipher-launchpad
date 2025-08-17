'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatEther } from 'viem'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({
    address,
  })

  return (
    <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3">
      {/* Wallet Info Display */}
      {isConnected && address && (
        <div className="flex items-center space-x-3 bg-white border-2 border-black px-3 py-2 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            {/* Status Indicator */}
            <div className="w-2 h-2 bg-[#06ffa5] rounded-full border border-black"></div>
            
            {/* Address and Balance */}
            <div className="text-xs lg:text-sm">
              <div className="font-bold text-black">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              <div className="text-[#666666] font-medium">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Connect Button - Custom Styling */}
      <div className="w-full lg:w-auto">
        <div className="[&_.rainbow-kit-connect-button]:!bg-[#ff006e] [&_.rainbow-kit-connect-button]:!text-white [&_.rainbow-kit-connect-button]:!font-bold [&_.rainbow-kit-connect-button]:!border-2 [&_.rainbow-kit-connect-button]:!border-black [&_.rainbow-kit-connect-button]:hover:!bg-[#e6005a] [&_.rainbow-kit-connect-button]:!transition-colors [&_.rainbow-kit-connect-button]:!duration-200 [&_.rainbow-kit-connect-button]:!rounded-lg [&_.rainbow-kit-connect-button]:!px-4 [&_.rainbow-kit-connect-button]:!py-2 [&_.rainbow-kit-connect-button]:!text-sm [&_.rainbow-kit-connect-button]:lg:!text-base">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            label="Connect Wallet"
          />
        </div>
      </div>
    </div>
  )
}
