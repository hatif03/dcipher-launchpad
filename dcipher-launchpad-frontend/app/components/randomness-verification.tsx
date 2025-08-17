'use client'

import { useState } from 'react'
import { useContract } from '../hooks/use-contract'
import { parseEther } from 'viem'

export function RandomnessVerification() {
  const {
    fundContract,
    contractBalance,
    subscriptionId,
    isFunding
  } = useContract()

  const [fundAmount, setFundAmount] = useState('0.01')

  const handleFundContract = async () => {
    try {
      await fundContract({ value: parseEther(fundAmount) })
    } catch (error) {
      console.error('Failed to fund contract:', error)
      alert(`Failed to fund contract: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-8 sm:mb-10 text-center leading-tight">
        SMART CONTRACT STATUS & FUNDING
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contract Funding Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-black mb-4">Fund Contract</h3>
          
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Funding Amount (ETH)
            </label>
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="w-full p-3 border-2 border-black font-mono text-sm"
              placeholder="0.01"
              step="0.001"
              min="0.001"
            />
          </div>

          <button
            onClick={handleFundContract}
            disabled={isFunding}
            className="w-full bg-[#00d4ff] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#1ad8ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isFunding ? 'Funding...' : 'Fund Contract'}
          </button>

          <div className="bg-blue-100 p-4 border-2 border-blue-400">
            <h4 className="font-black text-blue-800 mb-2">💡 How VRF Works</h4>
            <p className="text-sm text-blue-800">
              The smart contract automatically requests randomness from dcipher VRF when you create a selection. 
              The randomness is delivered through a blockchain callback, which then selects the winners.
            </p>
          </div>
        </div>

        {/* Contract Information */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-black mb-4">Contract Information</h3>
          
          <div className="bg-gray-100 p-6 border-2 border-black">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600">Contract Balance</p>
                <p className="text-lg font-black text-[#ff006e]">{contractBalance} ETH</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">Subscription ID</p>
                <p className="text-lg font-black text-[#00d4ff]">{subscriptionId}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600">VRF Status</p>
                <p className="text-lg font-black text-[#06ffa5]">Ready</p>
              </div>
            </div>
          </div>

          {/* VRF System Status */}
          <div className="bg-white border-4 border-black p-4">
            <h4 className="text-xl font-black text-black mb-4">VRF System Status</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#06ffa5] rounded-full"></div>
                <p className="text-lg font-black text-[#06ffa5]">Active</p>
              </div>
              <p className="text-sm text-gray-600">
                dcipher VRF system is connected and ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-[#ffbe0b] p-6 border-2 border-black">
        <h3 className="text-xl font-black text-black mb-4">How the VRF System Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-black font-bold">
          <li>Fund the contract with ETH to cover VRF request costs</li>
          <li>Create a selection request through the main interface</li>
          <li>The smart contract automatically requests randomness from dcipher VRF</li>
          <li>VRF generates cryptographically secure randomness</li>
          <li>Randomness is delivered back to the contract via blockchain callback</li>
          <li>Winners are automatically selected using the verified randomness</li>
          <li>Results are immediately available on the blockchain</li>
        </ol>
        
        <div className="mt-4 p-3 bg-yellow-200 border-2 border-yellow-600">
          <h4 className="font-black text-black mb-2">🔗 Smart Contract Integration</h4>
          <p className="text-sm text-black">
            This system uses the dcipher VRF smart contract infrastructure. The randomness is generated 
            off-chain and verified on-chain, ensuring provable fairness while maintaining security.
          </p>
        </div>
      </div>
    </div>
  )
}
