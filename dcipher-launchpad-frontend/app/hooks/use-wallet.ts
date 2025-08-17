'use client'

import { useAccount, useBalance, useChainId, useDisconnect } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { formatEther } from 'viem'

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  
  const { data: balance } = useBalance({
    address,
  })

  // Query for wallet info
  const walletInfo = useQuery({
    queryKey: ['wallet', address],
    queryFn: () => ({
      address,
      isConnected,
      chain: `Chain ID: ${chainId}`,
      chainId: chainId,
      balance: balance ? formatEther(balance.value) : '0',
      symbol: balance?.symbol || 'ETH',
    }),
    enabled: !!address && isConnected,
  })

  // Check if wallet is on supported network (Base Sepolia = 84532)
  const isOnSupportedNetwork = chainId === 84532

  return {
    // Connection status
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    isOnSupportedNetwork,
    
    // Network info
    chainId,
    
    // Balance
    balance: balance ? formatEther(balance.value) : '0',
    symbol: balance?.symbol || 'ETH',
    
    // Actions
    disconnect,
    
    // Query data
    walletInfo: walletInfo.data,
    isLoading: walletInfo.isLoading,
    error: walletInfo.error,
  }
}
