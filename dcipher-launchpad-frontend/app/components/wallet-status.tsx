'use client'

import { useWallet } from '../hooks/use-wallet'
import { useContract } from '../hooks/use-contract'
import { parseEther } from 'viem'

export function WalletStatus() {
  const { 
    isConnected, 
    address, 
    balance, 
    symbol, 
    isOnSupportedNetwork 
  } = useWallet()
  
  const { 
    contractBalance, 
    nextSelectionId,
    requestSelection,
    isRequestingSelection 
  } = useContract()

  if (!isConnected) {
    return (
      <div className="bg-gray-100 border-2 border-gray-400 p-4 rounded-lg">
        <p className="text-center text-gray-600 font-bold">
          Please connect your wallet to interact with the contract
        </p>
      </div>
    )
  }

  if (!isOnSupportedNetwork) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-600 p-4 rounded-lg">
        <p className="text-center text-yellow-800 font-bold">
          Please switch to Base Sepolia network
        </p>
      </div>
    )
  }

  const handleTestSelection = async () => {
    try {
      const participants = [address!, '0x1234567890123456789012345678901234567890', '0x0987654321098765432109876543210987654321']
      const winnerCount = BigInt(1)
      const value = parseEther('0.001') // Small amount for testing
      
      await requestSelection({
        participants,
        winnerCount,
        value
      })
    } catch (error) {
      console.error('Test selection failed:', error)
    }
  }

  return (
    <div className="bg-green-100 border-2 border-green-600 p-4 rounded-lg space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-green-800 mb-2">Wallet Connected!</h3>
        <p className="text-sm text-green-700">
          Address: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <p className="text-sm text-green-700">
          Balance: {parseFloat(balance).toFixed(4)} {symbol}
        </p>
      </div>
      
      <div className="text-center">
        <h4 className="font-bold text-green-800 mb-2">Contract Status</h4>
        <p className="text-sm text-green-700">
          Contract Balance: {parseFloat(contractBalance).toFixed(4)} ETH
        </p>
        <p className="text-sm text-green-700">
          Next Selection ID: {nextSelectionId?.toString() || 'Loading...'}
        </p>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleTestSelection}
          disabled={isRequestingSelection}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          {isRequestingSelection ? 'Processing...' : 'Test Selection (0.001 ETH)'}
        </button>
      </div>
    </div>
  )
}
