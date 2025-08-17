'use client'

import { useState } from 'react'
import { useContract } from '../hooks/use-contract'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'

export function RandomnessVerification() {
  const { address: userAddress } = useAccount()
  const {
    nextSelectionId,
    contractBalance,
    subscriptionId,
    randomnessSender,
    fundContract,
    isFunding,
    checkRandomnessUpdate
  } = useContract()

  const [isCheckingRandomness, setIsCheckingRandomness] = useState(false)
  const [lastCheckResult, setLastCheckResult] = useState<string>('')

  const handleFundContract = async () => {
    if (!userAddress) {
      alert('Please connect your wallet first')
      return
    }

    try {
      await fundContract(parseEther('0.01'))
      alert('Contract funded successfully!')
    } catch (error) {
      console.error('Failed to fund contract:', error)
      alert(`Failed to fund contract: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCheckRandomness = async () => {
    if (!nextSelectionId || typeof nextSelectionId !== 'bigint' || nextSelectionId <= BigInt(0)) {
      setLastCheckResult('❌ No selections available to check')
      return
    }

    setIsCheckingRandomness(true)
    try {
      const selectionId = nextSelectionId - BigInt(1)
      console.log(`🔍 Checking randomness update for selection ${selectionId}...`)
      
      const result = await checkRandomnessUpdate(selectionId)
      if (result) {
        setLastCheckResult(`🎲 Randomness received!\nRandomness: ${result.randomness}\nWinners: ${result.winners.length}`)
      } else {
        setLastCheckResult('⏳ Randomness not yet received. Please wait for the VRF callback.')
      }
    } catch (error) {
      console.error('Failed to check randomness update:', error)
      setLastCheckResult(`❌ Failed to check randomness update: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCheckingRandomness(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Contract Status */}
      <div className="bg-white border-4 border-black p-8">
        <h2 className="text-3xl font-black text-black mb-6 text-center">🔧 RANDOMNESS VERIFICATION</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
            <h3 className="text-lg font-black text-blue-800 mb-2">Contract Status</h3>
            <p className="text-blue-900"><strong>Balance:</strong> {contractBalance} ETH</p>
            <p className="text-blue-900"><strong>Subscription ID:</strong> {subscriptionId}</p>
            <p className="text-blue-900"><strong>Next Selection ID:</strong> {nextSelectionId?.toString() || 'None'}</p>
          </div>
          
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded">
            <h3 className="text-lg font-black text-green-800 mb-2">Randomness Sender</h3>
            <p className="text-green-900"><strong>Address:</strong> {randomnessSender || 'Not set'}</p>
            <p className="text-green-900"><strong>Status:</strong> {randomnessSender ? '✅ Configured' : '❌ Not configured'}</p>
          </div>
        </div>

        {/* Funding Section */}
        <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded mb-6">
          <h3 className="text-lg font-black text-yellow-800 mb-2">💰 Contract Funding</h3>
          <p className="text-yellow-900 text-sm mb-4">
            The contract needs ETH to pay for VRF randomness requests. Each request costs approximately 0.001 ETH.
          </p>
          <button
            onClick={handleFundContract}
            disabled={isFunding}
            className="px-6 py-3 bg-yellow-500 text-black font-bold border-2 border-yellow-700 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isFunding ? 'Funding...' : 'Fund Contract (0.01 ETH)'}
          </button>
        </div>

        {/* Randomness Testing */}
        <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded">
          <h3 className="text-lg font-black text-purple-800 mb-2">🎲 Randomness Testing</h3>
          <p className="text-purple-900 text-sm mb-4">
            Test if randomness is being generated for your selections. This will check the blockchain for updates.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleCheckRandomness}
              disabled={isCheckingRandomness || !nextSelectionId || typeof nextSelectionId !== 'bigint' || nextSelectionId <= BigInt(0)}
              className="px-6 py-3 bg-purple-600 text-white font-bold border-2 border-purple-700 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCheckingRandomness ? 'Checking...' : 'Check Randomness Update'}
            </button>
            
            {lastCheckResult && (
              <div className="bg-white border-2 border-purple-300 p-4 rounded">
                <h4 className="font-black text-purple-800 mb-2">Last Check Result:</h4>
                <pre className="text-sm whitespace-pre-wrap text-purple-900">{lastCheckResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white border-4 border-black p-8">
        <h3 className="text-2xl font-black text-black mb-4">📋 How Randomness Generation Works</h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
            <h4 className="font-black text-blue-800 mb-2">1. Submit Selection</h4>
            <p className="text-blue-900">When you submit a selection, the smart contract calls <code className="bg-blue-100 px-1 rounded">getRandomness()</code> to request randomness from dcipher VRF.</p>
          </div>
          
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded">
            <h4 className="font-black text-green-800 mb-2">2. VRF Processing</h4>
            <p className="text-green-900">dcipher VRF generates cryptographically secure randomness and calls back to your contract's <code className="bg-green-100 px-1 rounded">onRandomnessReceived()</code> function.</p>
          </div>
          
          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded">
            <h4 className="font-black text-purple-800 mb-2">3. Winners Selected</h4>
            <p className="text-purple-900">The contract uses the received randomness to select winners using a provably fair algorithm (Fisher-Yates shuffle).</p>
          </div>
          
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded">
            <h4 className="font-black text-yellow-800 mb-2">4. Event Emission</h4>
            <p className="text-yellow-900">A <code className="bg-yellow-100 px-1 rounded">SelectionCompleted</code> event is emitted with the winners and randomness, which the frontend listens for.</p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-white border-4 border-black p-8">
        <h3 className="text-2xl font-black text-black mb-4">🔍 Troubleshooting</h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded">
            <h4 className="font-black text-red-800 mb-2">Randomness Not Received?</h4>
            <ul className="list-disc list-inside space-y-1 text-red-900">
              <li>Check if the contract has sufficient ETH balance</li>
              <li>Verify the RandomnessSender address is correct</li>
              <li>Ensure the contract is properly deployed and configured</li>
              <li>Check blockchain explorer for transaction status</li>
              <li>Wait 1-2 minutes for VRF callback (normal processing time)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
            <h4 className="font-black text-blue-800 mb-2">Testing Steps</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-900">
              <li>Fund the contract with ETH</li>
              <li>Submit a selection with participants</li>
              <li>Wait for transaction confirmation</li>
              <li>Use "Check Randomness Update" button</li>
              <li>Monitor for SelectionCompleted events</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
