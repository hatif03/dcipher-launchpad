'use client'

import { WalletConnect } from '../components/wallet-connect'
import { useContract } from '../hooks/use-contract'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import Link from 'next/link'

export default function ContractStatusPage() {
  const { address: userAddress } = useAccount()
  const {
    nextSelectionId,
    contractBalance,
    subscriptionId,
    randomnessSender,
    fundContract,
    createSubscription,
    topUpSubscription,
    isFunding,
    isCreatingSubscription,
    isToppingUp,
    fundHash,
    createSubscriptionHash,
    topUpSubscriptionHash
  } = useContract()

  const handleFundContract = async (amount: string) => {
    if (!userAddress) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const value = parseEther(amount)
      fundContract({ value })
      console.log(`Funding contract with ${amount} ETH`)
    } catch (error) {
      console.error('Funding failed:', error)
      alert(`Funding failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCreateSubscription = async (amount: string) => {
    if (!userAddress) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const value = parseEther(amount)
      createSubscription({ value })
      console.log(`Creating subscription with ${amount} ETH`)
    } catch (error) {
      console.error('Subscription creation failed:', error)
      alert(`Subscription creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleTopUpSubscription = async (amount: string) => {
    if (!userAddress) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const value = parseEther(amount)
      topUpSubscription({ value })
      console.log(`Topping up subscription with ${amount} ETH`)
    } catch (error) {
      console.error('Top-up failed:', error)
      alert(`Top-up failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
                  DCIPHER
                </h1>
                <p className="text-base sm:text-lg text-[#666666] font-bold mt-1">
                  CONTRACT STATUS & MANAGEMENT
                </p>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                <Link href="/" className="text-sm text-black font-bold hover:text-[#ff006e] transition-colors">
                  HOME
                </Link>
                <Link href="/verification" className="text-sm text-black font-bold hover:text-[#ff006e] transition-colors">
                  VERIFICATION
                </Link>
                <Link href="/randomness-testing" className="text-sm text-black font-bold hover:text-[#06ffa5] transition-colors">
                  RANDOMNESS TESTING
                </Link>
              </nav>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
            CONTRACT STATUS & MANAGEMENT
          </h2>
          <p className="text-xl text-gray-700 font-bold max-w-3xl mx-auto">
            Monitor contract health, manage subscriptions, and fund operations
          </p>
        </div>

        {/* Contract Status Overview */}
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 mb-12">
          <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 text-center leading-tight">
            CONTRACT STATUS OVERVIEW
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-100 p-6 border-2 border-black">
              <h4 className="text-lg font-bold text-black mb-2">Contract Balance</h4>
              <p className="text-2xl font-black text-[#ff006e]">{contractBalance} ETH</p>
            </div>
            
            <div className="bg-gray-100 p-6 border-2 border-black">
              <h4 className="text-lg font-bold text-black mb-2">Subscription ID</h4>
              <p className="text-2xl font-black text-[#00d4ff]">{subscriptionId}</p>
            </div>
            
            <div className="bg-gray-100 p-6 border-2 border-black">
              <h4 className="text-lg font-bold text-black mb-2">Next Selection ID</h4>
              <p className="text-2xl font-black text-[#06ffa5]">{nextSelectionId?.toString() || '0'}</p>
            </div>
            
            <div className="bg-gray-100 p-6 border-2 border-black">
              <h4 className="text-lg font-bold text-black mb-2">Randomness Sender</h4>
              <p className="text-sm font-black text-[#ffbe0b] break-all">
                {randomnessSender || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Management */}
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 mb-12">
          <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 text-center leading-tight">
            CONTRACT MANAGEMENT
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="text-xl font-black text-black mb-4">Create Subscription</h4>
              <p className="text-gray-700 mb-4">
                Create a new subscription for randomness requests
              </p>
              <button
                onClick={() => handleCreateSubscription('0.01')}
                disabled={isCreatingSubscription}
                className="bg-[#ff006e] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#ff1a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreatingSubscription ? 'Creating...' : 'Create (0.01 ETH)'}
              </button>
            </div>
            
            <div className="text-center">
              <h4 className="text-xl font-black text-black mb-4">Top Up Subscription</h4>
              <p className="text-gray-700 mb-4">
                Add funds to existing subscription
              </p>
              <button
                onClick={() => handleTopUpSubscription('0.005')}
                disabled={isToppingUp}
                className="bg-[#00d4ff] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#1ad8ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isToppingUp ? 'Topping Up...' : 'Top Up (0.005 ETH)'}
              </button>
            </div>
            
            <div className="text-center">
              <h4 className="text-xl font-black text-black mb-4">Fund Contract</h4>
              <p className="text-gray-700 mb-4">
                Add general funds to contract
              </p>
              <button
                onClick={() => handleFundContract('0.01')}
                disabled={isFunding}
                className="bg-[#06ffa5] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#1affb0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isFunding ? 'Funding...' : 'Fund (0.01 ETH)'}
              </button>
            </div>
          </div>

          {/* Transaction Status */}
          {(fundHash || createSubscriptionHash || topUpSubscriptionHash) && (
            <div className="mt-8 p-4 bg-yellow-100 border-2 border-yellow-600">
              <h4 className="font-black text-black mb-2">Recent Transactions:</h4>
              {fundHash && <p className="text-sm">Fund: {fundHash}</p>}
              {createSubscriptionHash && <p className="text-sm">Create Subscription: {createSubscriptionHash}</p>}
              {topUpSubscriptionHash && <p className="text-sm">Top Up: {topUpSubscriptionHash}</p>}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-[#00d4ff] text-black font-bold py-4 px-8 border-4 border-black hover:bg-[#1ad8ff] transition-colors"
          >
            ← BACK TO LAUNCHPAD
          </Link>
        </div>
      </div>
    </main>
  )
}
