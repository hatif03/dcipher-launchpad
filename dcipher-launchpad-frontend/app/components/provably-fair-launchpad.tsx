'use client'

import { useState, useEffect } from 'react'
import { SelectionForm } from './selection-form'
import { ResultsDisplay } from './results-display'
import { SelectionHistory } from './selection-history'
import { useContract } from '../hooks/use-contract'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import Link from 'next/link'

// Component to display results from blockchain
function BlockchainResultsDisplay({ selectionId }: { selectionId: bigint }) {
  const { useSelection } = useContract()
  const { data: selection, isLoading, error } = useSelection(selectionId)

  if (isLoading) {
    return (
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
          BLOCKCHAIN RESULTS
        </h3>
        <div className="bg-blue-100 border-4 border-blue-400 p-4 text-blue-800 font-black">
          🔄 Loading selection data from blockchain...
        </div>
      </div>
    )
  }

  if (error || !selection) {
    return (
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
          BLOCKCHAIN RESULTS
        </h3>
        <div className="bg-red-100 border-4 border-red-400 p-4 text-red-800 font-black">
          ❌ Failed to load selection data from blockchain
        </div>
      </div>
    )
  }

  // Convert blockchain data to match SelectionResult interface
  const convertedSelection = {
    id: selection.selectionId,
    participants: selection.participants,
    winnerCount: Number(selection.winnerCount),
    winners: selection.winners,
    timestamp: new Date(Number(selection.timestamp) * 1000), // Convert from Unix timestamp
    transactionHash: undefined, // Not available from blockchain data
    randomness: selection.randomness !== '0x' ? selection.randomness : undefined,
    status: selection.isCompleted ? 'completed' : selection.isCancelled ? 'cancelled' : 'pending',
    requestId: selection.requestId ? selection.requestId.toString() : undefined,
    completedAt: selection.isCompleted ? new Date(Number(selection.timestamp) * 1000) : undefined,
    cancelledAt: selection.isCancelled ? new Date(Number(selection.timestamp) * 1000) : undefined
  }

  // Debug information
  console.log('Blockchain selection data:', selection)
  console.log('Converted selection:', convertedSelection)
  console.log('Randomness available:', selection.randomness !== '0x')
  console.log('Winners available:', selection.winners.length > 0)
  console.log('Is completed:', selection.isCompleted)

  return (
    <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
        BLOCKCHAIN RESULTS
      </h3>
      
      {/* VRF Status Indicator */}
      {!selection.isCompleted && !selection.isCancelled && (
        <div className="mb-6 bg-blue-100 border-4 border-blue-400 p-4 text-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-black">🔄 Monitoring VRF Callback</p>
              <p className="text-sm">
                Waiting for randomness from dcipher VRF network. This page automatically updates every 5 seconds 
                until the callback completes. Typical wait time: 1-2 minutes.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <ResultsDisplay selection={convertedSelection} />
    </div>
  )
}

/*
 * IMPORTANT: Randomness Integration Notes
 * 
 * The Randomness Seed and Randomness Request ID should come from the actual blockchain:
 * 
 * 1. Randomness Request ID: This should be returned from the smart contract when 
 *    requestSelection() is called, specifically from the randomness request to dcipher VRF
 * 
 * 2. Randomness Seed: This should come from the smart contract's onRandomnessReceived() 
 *    callback, which receives the actual VRF output from dcipher
 * 
 * 3. Winners: Should be selected using the real randomness seed, not generated locally
 * 
 * Current Implementation:
 * - requestId: Set to undefined initially, should be populated from blockchain
 * - randomness: Set to undefined initially, should be populated from blockchain callback
 * - winners: Empty array initially, populated when real randomness is available
 * 
 * TODO: Integrate with actual smart contract callbacks to get real data
 */

interface SelectionResult {
  id: string
  participants: string[]
  winnerCount: number
  winners: string[]
  timestamp: Date
  transactionHash?: string
  randomness?: string
  status?: 'pending' | 'completed' | 'cancelled'
  requestId?: string
  completedAt?: Date
  cancelledAt?: Date
}

export function ProvablyFairLaunchpad() {
  const { address: userAddress } = useAccount()
  const {
    nextSelectionId,
    requestSelection,
    isRequestingSelection,
    requestSelectionHash
  } = useContract()

  const [currentSelection, setCurrentSelection] = useState<SelectionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selections, setSelections] = useState<SelectionResult[]>([])

  // Check if contract is deployed
  const isContractDeployed = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && 
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS !== 'undefined' &&
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS !== ''

  if (!isContractDeployed) {
    return (
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-8 sm:mb-10 text-center leading-tight">
          CONTRACT NOT DEPLOYED
        </h2>
        <div className="bg-red-100 border-4 border-red-400 p-6 text-red-800 font-black text-center">
          <p className="text-lg mb-4">
            The ProvablyFairLaunchpad contract has not been deployed yet.
          </p>
          <p className="text-base">
            Please deploy the contract first using the deployment guide in the contracts folder, 
            then set the NEXT_PUBLIC_CONTRACT_ADDRESS environment variable.
          </p>
          <div className="mt-4 p-3 bg-yellow-200 border-2 border-yellow-600 text-yellow-800">
            <p className="text-sm">
              <strong>Debug Info:</strong> NEXT_PUBLIC_CONTRACT_ADDRESS = {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'undefined'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Load existing selections on component mount
  useEffect(() => {
    loadSelections()
  }, [])

  // Watch for transaction hash and update selection
  useEffect(() => {
    if (requestSelectionHash && currentSelection && !currentSelection.transactionHash) {
      updateSelectionWithTransactionHash(currentSelection.id, requestSelectionHash)
    }
  }, [requestSelectionHash, currentSelection])

  const loadSelections = async () => {
    try {
      console.log('Loading selections from contract...')
      // TODO: Implement proper loading from blockchain
    } catch (error) {
      console.error('Failed to load selections:', error)
    }
  }

  const handleSelectionSubmit = async (participants: string[], winnerCount: number) => {
    if (!userAddress) {
      alert('Please connect your wallet first')
      return
    }

    setIsProcessing(true)
    
    try {
      // Request selection from smart contract
      requestSelection({
        participants,
        winnerCount,
        value: parseEther('0.001') // Fixed cost for now
      })

      // Create pending selection result
      const selectionId = `selection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const pendingResult: SelectionResult = {
        id: selectionId,
        participants,
        winnerCount,
        winners: [],
        timestamp: new Date(),
        status: 'pending',
        requestId: undefined,
        transactionHash: undefined,
        randomness: undefined
      }

      setCurrentSelection(pendingResult)
      setSelections(prev => [pendingResult, ...prev])

      console.log(`Selection requested. ID: ${selectionId}`)
    } catch (error) {
      console.error('Selection failed:', error)
      alert(`Selection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Function to update selection with real transaction hash
  const updateSelectionWithTransactionHash = (selectionId: string, transactionHash: string) => {
    setSelections(prev => prev.map(sel => 
      sel.id === selectionId ? { ...sel, transactionHash } : sel
    ))
    
    if (currentSelection?.id === selectionId) {
      setCurrentSelection(prev => prev ? { ...prev, transactionHash } : null)
    }
    
    console.log(`Updated selection ${selectionId} with transaction hash: ${transactionHash}`)
  }

  return (
    <div className="space-y-12">
      {/* Main Selection Interface */}
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-8 sm:mb-10 text-center leading-tight">
          CONDUCT A VERIFIABLY RANDOM SELECTION
        </h2>
        
        <SelectionForm 
          onSubmit={handleSelectionSubmit}
          isProcessing={isProcessing || isRequestingSelection}
        />
      </div>

      {/* Current Results */}
      {currentSelection && (
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
            LATEST SELECTION RESULTS
          </h3>
          <ResultsDisplay selection={currentSelection} />
        </div>
      )}

      {/* Blockchain Results - Read from actual smart contract */}
      {nextSelectionId && nextSelectionId > BigInt(0) ? (
        <BlockchainResultsDisplay 
          selectionId={nextSelectionId - BigInt(1)} 
        />
      ) : (
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
            BLOCKCHAIN RESULTS
          </h3>
          <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
            📋 No selections have been made yet. Make your first selection above to see results here.
          </div>
        </div>
      )}

      {/* Selection History */}
      {selections.length > 0 && (
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
            SELECTION HISTORY
          </h3>
          <SelectionHistory selections={selections} />
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white border-4 border-black p-8 text-center">
        <h3 className="text-2xl font-black text-black mb-6">Need More Control?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/contract-status"
            className="bg-[#ff006e] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#ff1a7a] transition-colors"
          >
            Contract Status
          </Link>
          <Link 
            href="/randomness-testing"
            className="bg-[#00d4ff] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#1ad8ff] transition-colors"
          >
            Randomness Testing
          </Link>
          <Link 
            href="/verification"
            className="bg-[#06ffa5] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#1affb0] transition-colors"
          >
            Verification
          </Link>
        </div>
      </div>
    </div>
  )
}
