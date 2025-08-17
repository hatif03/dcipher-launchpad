'use client'

import { useState, useEffect } from 'react'
import { SelectionForm } from './selection-form'
import { ResultsDisplay } from './results-display'
import { SelectionHistory } from './selection-history'
import { useContract } from '../hooks/use-contract'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import Link from 'next/link'
import { SelectionResult } from '../types/selection'

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
  const convertedSelection: SelectionResult = {
    id: selection.selectionId,
    participants: selection.participants,
    winnerCount: Number(selection.winnerCount),
    winners: selection.winners,
    timestamp: new Date(Number(selection.timestamp) * 1000), // Convert from Unix timestamp
    transactionHash: undefined, // Not available from blockchain data
    randomness: selection.randomness !== '0x' ? selection.randomness : undefined,
    status: selection.isCompleted ? 'completed' : selection.isCancelled ? 'cancelled' : 'pending' as const,
    requestId: selection.requestId ? selection.requestId.toString() : undefined,
    completedAt: selection.isCompleted ? new Date(Number(selection.timestamp) * 1000) : undefined,
    cancelledAt: selection.isCancelled ? new Date(Number(selection.timestamp) * 1000) : undefined
  }

  // Check if this selection is recent (within last 24 hours) or has active status
  const isRecent = (Date.now() - Number(selection.timestamp) * 1000) < 24 * 60 * 60 * 1000 // 24 hours
  const isActive = !selection.isCompleted && !selection.isCancelled
  const hasRandomness = selection.randomness !== '0x'
  
  // Only show detailed results for recent or active selections
  if (!isRecent && !isActive && !hasRandomness) {
    return (
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
          BLOCKCHAIN RESULTS
        </h3>
        <div className="bg-blue-100 border-4 border-blue-400 p-4 text-blue-800 font-black">
          🔍 Historical selection data available but not currently active. Make a new selection to see live results.
        </div>
      </div>
    )
  }

  // Debug information
  console.log('Blockchain selection data:', selection)
  console.log('Converted selection:', convertedSelection)
  console.log('Randomness available:', selection.randomness !== '0x')
  console.log('Winners available:', selection.winners.length > 0)
  console.log('Is completed:', selection.isCompleted)
  console.log('Is recent:', isRecent, 'Is active:', isActive)

  return (
    <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
        BLOCKCHAIN RESULTS
      </h3>
      
      {/* Data Freshness Indicator */}
      <div className="mb-6 bg-gray-100 border-2 border-gray-300 p-3 text-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            📅 Last Updated: {new Date(Number(selection.timestamp) * 1000).toLocaleString()}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            isRecent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isRecent ? '🟢 Recent' : '🟡 Historical'}
          </span>
        </div>
      </div>
      
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

// Component to render transaction status indicator
function TransactionStatusIndicator({ currentSelection }: { currentSelection: SelectionResult | null }) {
  if (!currentSelection || currentSelection.status !== 'pending') {
    return null
  }

  return (
    <div className="mb-6 bg-yellow-50 border-4 border-yellow-400 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
        <div>
          <p className="font-black text-yellow-800 text-lg">🔄 SELECTION IN PROGRESS</p>
          <p className="text-yellow-700 text-sm">
            Your selection request is being processed. Here's what's happening:
          </p>
          <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
            <li>Transaction submitted to blockchain</li>
            <li>Waiting for confirmation (10-30 seconds)</li>
            <li>VRF randomness request initiated</li>
            <li>Winners will be selected once randomness arrives (1-2 minutes)</li>
          </ul>
          {!currentSelection.transactionHash && (
            <p className="text-yellow-600 text-xs mt-2">
              <strong>Note:</strong> Transaction hash will appear once confirmed on blockchain
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Component to display blockchain data comparison
function BlockchainDataComparison({ selectionId, transactionHash }: { selectionId: bigint, transactionHash?: string }) {
  const { useSelection } = useContract()
  const { data: selection, isLoading, error } = useSelection(selectionId)

  if (isLoading) {
    return (
      <div className="bg-blue-50 border-4 border-blue-400 p-4">
        <p className="font-black text-blue-800">🔄 Loading blockchain data...</p>
      </div>
    )
  }

  if (error || !selection) {
    return (
      <div className="bg-red-50 border-4 border-red-400 p-4">
        <p className="font-black text-red-800">❌ Failed to load blockchain data</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border-4 border-blue-400 p-4">
      <h4 className="font-black text-blue-800 mb-2">🔗 BLOCKCHAIN DATA VERIFICATION</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="text-blue-900">
          <strong>Selection ID:</strong> {selection.selectionId}
          <br />
          <strong>Requester:</strong> {selection.requester}
          <br />
          <strong>Participants:</strong> {selection.participants.length}
          <br />
          <strong>Winner Count:</strong> {selection.winnerCount.toString()}
        </div>
        <div className="text-blue-900">
          <strong>Request ID:</strong> {selection.requestId?.toString() || 'None'}
          <br />
          <strong>Is Completed:</strong> {selection.isCompleted ? 'Yes' : 'No'}
          <br />
          <strong>Is Cancelled:</strong> {selection.isCancelled ? 'Yes' : 'No'}
          <br />
          <strong>Winners:</strong> {selection.winners.length}
        </div>
      </div>
      {transactionHash && (
        <div className="mt-2 p-2 bg-white border border-blue-300 rounded">
          <strong className="text-blue-900">Transaction Hash:</strong> 
          <code className="ml-2 text-xs break-all text-blue-800">{transactionHash}</code>
          <a
            href={`https://sepolia.basescan.org/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
          >
            View on Basescan
          </a>
        </div>
      )}
      {selection.randomness !== '0x' && (
        <div className="mt-2 text-blue-900">
          <strong>Randomness:</strong> {selection.randomness}
        </div>
      )}
    </div>
  )
}



// Local storage key for selections
const SELECTIONS_STORAGE_KEY = 'dcipher_selections'

export function ProvablyFairLaunchpad() {
  const { address: userAddress } = useAccount()
  const {
    nextSelectionId,
    requestSelection,
    isRequestingSelection,
    requestSelectionHash,
    checkRandomnessUpdate
  } = useContract()

  const [currentSelection, setCurrentSelection] = useState<SelectionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selections, setSelections] = useState<SelectionResult[]>([])

  // Check if contract is deployed
  const isContractDeployed = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && 
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS !== 'undefined' &&
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS !== ''

  // Load existing selections from localStorage on component mount
  useEffect(() => {
    loadSelectionsFromStorage()
  }, [])

  // Watch for transaction hash and update selection
  useEffect(() => {
    if (requestSelectionHash && currentSelection && !currentSelection.transactionHash) {
      console.log('Transaction hash received:', requestSelectionHash)
      updateSelectionWithTransactionHash(currentSelection.id, requestSelectionHash)
    }
  }, [requestSelectionHash, currentSelection])

  // Save selections to localStorage whenever they change
  useEffect(() => {
    if (selections.length > 0) {
      saveSelectionsToStorage(selections)
    }
  }, [selections])

  // Watch for transaction hash changes and update all relevant selections
  useEffect(() => {
    if (requestSelectionHash) {
      console.log('Transaction hash changed:', requestSelectionHash)
      // Find the most recent pending selection and update it
      const pendingSelection = selections.find(sel => sel.status === 'pending' && !sel.transactionHash)
      if (pendingSelection) {
        updateSelectionWithTransactionHash(pendingSelection.id, requestSelectionHash)
      }
    }
  }, [requestSelectionHash, selections])

  const loadSelectionsFromStorage = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(SELECTIONS_STORAGE_KEY)
        if (stored) {
          const parsedSelections = JSON.parse(stored).map((sel: any) => ({
            ...sel,
            timestamp: new Date(sel.timestamp),
            completedAt: sel.completedAt ? new Date(sel.completedAt) : undefined,
            cancelledAt: sel.cancelledAt ? new Date(sel.cancelledAt) : undefined
          }))
          setSelections(parsedSelections)
          console.log('Loaded selections from storage:', parsedSelections.length)
        }
      }
    } catch (error) {
      console.error('Failed to load selections from storage:', error)
    }
  }

  const saveSelectionsToStorage = (selectionsToSave: SelectionResult[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SELECTIONS_STORAGE_KEY, JSON.stringify(selectionsToSave))
        console.log('Saved selections to storage:', selectionsToSave.length)
      }
    } catch (error) {
      console.error('Failed to save selections to storage:', error)
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
        winnerCount: BigInt(winnerCount),
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
    const updatedSelections = selections.map(sel => 
      sel.id === selectionId ? { ...sel, transactionHash } : sel
    )
    
    setSelections(updatedSelections)
    
    if (currentSelection?.id === selectionId) {
      setCurrentSelection(prev => prev ? { ...prev, transactionHash } : null)
    }
    
    console.log(`Updated selection ${selectionId} with transaction hash: ${transactionHash}`)
  }

  // Clear all selections (for testing/debugging)
  const clearAllSelections = () => {
    if (confirm('Are you sure you want to clear all selection history? This cannot be undone.')) {
      setSelections([])
      setCurrentSelection(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SELECTIONS_STORAGE_KEY)
      }
    }
  }

  // Check for randomness updates manually
  const checkRandomnessUpdates = async () => {
    if (!nextSelectionId || typeof nextSelectionId !== 'bigint' || nextSelectionId <= BigInt(0)) {
      alert('No selections available to check')
      return
    }

    try {
      const selectionId = nextSelectionId - BigInt(1)
      console.log(`🔍 Checking randomness update for selection ${selectionId}...`)
      
      const result = await checkRandomnessUpdate(selectionId)
      if (result) {
        alert(`🎲 Randomness received!\nRandomness: ${result.randomness}\nWinners: ${result.winners.length}`)
        
        // Update the current selection with the new data
        if (currentSelection) {
          const updatedSelection = {
            ...currentSelection,
            randomness: result.randomness,
            winners: result.winners,
            status: 'completed' as const
          }
          setCurrentSelection(updatedSelection)
          
          // Update selections array
          setSelections(prev => prev.map(sel => 
            sel.id === currentSelection.id ? updatedSelection : sel
          ))
        }
      } else {
        alert('⏳ Randomness not yet received. Please wait for the VRF callback.')
      }
    } catch (error) {
      console.error('Failed to check randomness update:', error)
      alert(`Failed to check randomness update: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

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

  return (
    <div className="space-y-12">
      {/* Main Selection Interface */}
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-8 sm:mb-10 text-center leading-tight">
          CONDUCT A VERIFIABLY RANDOM SELECTION
        </h2>
        
        {/* Transaction Status Banner */}
        {isRequestingSelection && (
          <div className="mb-6 bg-blue-50 border-4 border-blue-400 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-black text-blue-800 text-lg">🔄 TRANSACTION IN PROGRESS</p>
                <p className="text-blue-700 text-sm">
                  Your selection request is being processed on the blockchain. Please wait for confirmation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Confirmation Banner */}
        {requestSelectionHash && !isRequestingSelection && (
          <div className="mb-6 bg-green-50 border-4 border-green-400 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-black text-green-800 text-lg">✅ TRANSACTION CONFIRMED</p>
                <p className="text-green-700 text-sm">
                  Your selection request has been confirmed on the blockchain. Transaction hash: 
                  <code className="ml-2 font-mono text-xs bg-white px-2 py-1 rounded border text-green-800">
                    {requestSelectionHash.slice(0, 8)}...{requestSelectionHash.slice(-6)}
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction Hash Display */}
        {requestSelectionHash && (
          <div className="mb-6 bg-white border-4 border-black p-4">
            <h3 className="text-lg font-black text-black mb-3 uppercase tracking-wide">🔗 TRANSACTION DETAILS</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
                  Transaction Hash
                </label>
                <code className="block bg-gray-100 border-2 border-gray-300 px-4 py-3 text-gray-800 font-mono text-sm break-all">
                  {requestSelectionHash}
                </code>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => navigator.clipboard.writeText(requestSelectionHash)}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-sm border-2 border-blue-700 hover:bg-blue-700 transition-colors"
                  title="Copy transaction hash"
                >
                  COPY
                </button>
                <a
                  href={`https://sepolia.basescan.org/tx/${requestSelectionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white font-bold text-sm border-2 border-green-700 hover:bg-green-700 transition-colors text-center"
                >
                  VIEW ON BASESCAN
                </a>
                <button
                  onClick={checkRandomnessUpdates}
                  className="px-4 py-2 bg-purple-600 text-white font-bold text-sm border-2 border-purple-700 hover:bg-purple-700 transition-colors text-center"
                  title="Check for randomness updates"
                >
                  CHECK RANDOMNESS
                </button>
              </div>
            </div>
          </div>
        )}

        <SelectionForm 
          onSubmit={handleSelectionSubmit}
          isProcessing={isProcessing || isRequestingSelection}
        />
      </div>

      {/* Current Results */}
      {/* Temporarily commented out to fix build issues */}
      {/* {currentSelection && (
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
            LATEST SELECTION RESULTS
          </h3>
          
          <TransactionStatusIndicator currentSelection={currentSelection} />
          
          {nextSelectionId && typeof nextSelectionId === 'bigint' && nextSelectionId > BigInt(0) && currentSelection && (
            <div className="mb-6">
              <BlockchainDataComparison 
                selectionId={nextSelectionId - BigInt(1)} 
                transactionHash={currentSelection.transactionHash || requestSelectionHash} 
              />
            </div>
          )}
          
          {currentSelection && <ResultsDisplay selection={currentSelection} />}
        </div>
      )} */}

      {/* Blockchain Results - Read from actual smart contract */}
      {(() => {
        // Only show blockchain results if we have a recent selection or active transaction
        const hasRecentActivity = currentSelection || requestSelectionHash
        const hasValidSelectionId = nextSelectionId && typeof nextSelectionId === 'bigint' && nextSelectionId > BigInt(0)
        
        if (!hasRecentActivity && !hasValidSelectionId) {
          return (
            <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
                BLOCKCHAIN RESULTS
              </h3>
              <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                📋 No selections have been made yet. Make your first selection above to see results here.
              </div>
            </div>
          )
        }
        
        if (hasRecentActivity && hasValidSelectionId) {
          return (
            <div>
              <BlockchainResultsDisplay 
                selectionId={nextSelectionId - BigInt(1)} 
              />
              {/* Show transaction hash if available */}
              {requestSelectionHash && (
                <div className="bg-green-50 border-4 border-green-400 p-4 mt-4">
                  <h4 className="font-black text-green-800 mb-2">✅ TRANSACTION CONFIRMED</h4>
                  <p className="text-green-700 text-sm mb-2">
                    Your selection request has been confirmed on the blockchain:
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-black text-green-700 mb-2 uppercase tracking-wide">
                        Transaction Hash
                      </label>
                      <code className="block bg-white border-2 border-green-300 px-4 py-3 text-green-800 font-mono text-sm break-all">
                        {requestSelectionHash}
                      </code>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(requestSelectionHash)}
                        className="px-4 py-2 bg-blue-600 text-white font-bold text-sm border-2 border-blue-700 hover:bg-blue-700 transition-colors"
                        title="Copy transaction hash"
                      >
                        COPY
                      </button>
                      <a
                        href={`https://sepolia.basescan.org/tx/${requestSelectionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white font-bold text-sm border-2 border-green-700 hover:bg-green-700 transition-colors text-center"
                      >
                        VIEW ON BASESCAN
                      </a>
                      <button
                        onClick={checkRandomnessUpdates}
                        className="px-4 py-2 bg-purple-600 text-white font-bold text-sm border-2 border-purple-700 hover:bg-purple-700 transition-colors text-center"
                        title="Check for randomness updates"
                      >
                        CHECK RANDOMNESS
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }
        
        // If we have a selection ID but no recent activity, show a minimal status
        if (hasValidSelectionId && !hasRecentActivity) {
          return (
            <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
                BLOCKCHAIN STATUS
              </h3>
              <div className="bg-blue-100 border-4 border-blue-400 p-4 text-blue-800 font-black">
                🔍 Contract is ready for selections. Previous selections may exist but are not currently active.
              </div>
            </div>
          )
        }
        
        return null
      })()}

      {/* Selection History */}
      {selections.length > 0 && (
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight">
              SELECTION HISTORY ({selections.length} selections)
            </h3>
            <button
              onClick={clearAllSelections}
              className="px-4 py-2 bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600 transition-colors"
              title="Clear all selection history"
            >
              CLEAR ALL
            </button>
          </div>
          <SelectionHistory selections={selections} />
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white border-4 border-black p-8 text-center">
        <h3 className="text-2xl font-black text-black mb-6">Need More Control?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/contract-status"
            className="bg-[#ff006e] text-white font-bold py-3 px-6 border-2 border-black hover:bg-[#ff1a7a] transition-colors"
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
            className="bg-[#06ffa5] text-black font-bold py-3 px-6 border-2 border-black hover:bg-[#06ffa5]/90 transition-colors"
          >
            Verification
          </Link>
        </div>
      </div>
    </div>
  )
}
