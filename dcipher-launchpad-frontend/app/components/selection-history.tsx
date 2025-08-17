'use client'

import { useState } from 'react'

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

interface SelectionHistoryProps {
  selections: SelectionResult[]
}

export function SelectionHistory({ selections }: SelectionHistoryProps) {
  const [expandedSelection, setExpandedSelection] = useState<string | null>(null)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString()
  }

  const toggleExpanded = (selectionId: string) => {
    setExpandedSelection(expandedSelection === selectionId ? null : selectionId)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (selections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-black font-black text-xl">No selections have been made yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {selections.map((selection) => (
        <div key={selection.id} className="bg-white border-4 border-black">
          {/* Selection Header */}
          <div 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpanded(selection.id)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ff006e] border-4 border-black flex items-center justify-center text-white font-black text-lg sm:text-xl">
                  {selections.indexOf(selection) + 1}
                </div>
                <div>
                  <h5 className="text-black font-black text-xl sm:text-2xl">
                    Selection #{selection.id.split('_')[1]}
                  </h5>
                  <p className="text-[#666666] text-lg font-black">
                    {selection.participants.length} participants • {selection.winnerCount} winners
                  </p>
                  {selection.status && (
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 text-sm font-black uppercase tracking-wide ${
                        selection.status === 'completed' ? 'bg-[#06ffa5] text-black' :
                        selection.status === 'pending' ? 'bg-[#ffbe0b] text-black' :
                        'bg-[#ff006e] text-white'
                      } border-2 border-black`}>
                        {selection.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <span className="text-[#666666] text-lg font-black">
                  {formatTimestamp(selection.timestamp)}
                </span>
                <svg 
                  className={`w-8 h-8 text-black transition-transform ${
                    expandedSelection === selection.id ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedSelection === selection.id && (
            <div className="border-t-4 border-black p-6 space-y-8">
              {/* Winners List */}
              <div>
                <h6 className="text-black font-black text-xl mb-4 uppercase tracking-wide">Selected Winners</h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selection.winners.map((winner, index) => (
                    <div key={index} className="bg-white border-4 border-black p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#06ffa5] border-4 border-black flex items-center justify-center text-black font-black text-sm sm:text-base">
                            {index + 1}
                          </div>
                          <span className="text-black font-mono text-lg font-black">{formatAddress(winner)}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(winner)}
                          className="px-4 py-2 bg-[#ffbe0b] text-black font-black text-sm border-4 border-black hover:bg-[#ffbe0b]/90 transition-colors"
                          title="Copy address"
                        >
                          COPY
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Details */}
              {selection.transactionHash ? (
                <div>
                  <h6 className="text-black font-black text-lg mb-3 uppercase tracking-wide">Transaction Hash</h6>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <code className="flex-1 bg-white border-4 border-black px-4 py-3 text-black font-mono text-base break-all">
                      {selection.transactionHash}
                    </code>
                    <button
                      onClick={() => copyToClipboard(selection.transactionHash!)}
                      className="px-6 py-3 bg-[#06ffa5] text-black font-black text-lg border-4 border-black hover:bg-[#06ffa5]/90 transition-colors whitespace-nowrap"
                    >
                      COPY
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h6 className="text-black font-black text-lg mb-3 uppercase tracking-wide">Transaction Hash</h6>
                  <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                    ⏳ Waiting for transaction hash... This will be populated when the transaction completes.
                  </div>
                </div>
              )}

              {/* Request ID */}
              {selection.requestId ? (
                <div>
                  <h6 className="text-black font-black text-lg mb-3 uppercase tracking-wide">VRF Request ID</h6>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <code className="flex-1 bg-white border-4 border-black px-4 py-3 text-black font-mono text-base break-all">
                      {selection.requestId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(selection.requestId!)}
                      className="px-6 py-3 bg-[#00d4ff] text-black font-black text-lg border-4 border-black hover:bg-[#00d4ff]/90 transition-colors whitespace-nowrap"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    This ID tracks your randomness request in the dcipher VRF system
                  </div>
                </div>
              ) : (
                <div>
                  <h6 className="text-black font-black text-lg mb-3 uppercase tracking-wide">VRF Request ID</h6>
                  <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                    ⏳ Waiting for VRF request to be processed... 
                    <div className="mt-2 text-sm">
                      The request ID will be available once the randomness request is submitted to the VRF network.
                    </div>
                  </div>
                </div>
              )}

              {/* Randomness Seed */}
              {selection.randomness && selection.randomness !== '0x' ? (
                <div>
                  <h6 className="text-black font-black text-lg mb-3 uppercase tracking-wide">Randomness Seed</h6>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <code className="flex-1 bg-white border-4 border-black px-4 py-3 text-black font-mono text-base break-all">
                      {selection.randomness}
                    </code>
                    <button
                      onClick={() => copyToClipboard(selection.randomness!)}
                      className="px-6 py-3 bg-[#ffbe0b] text-black font-black text-lg border-4 border-black hover:bg-[#ffbe0b]/90 transition-colors whitespace-nowrap"
                    >
                      COPY
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h6 className="text-black font-black text-lg mb-3 uppercase tracking-wide">Randomness Seed</h6>
                  <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                    ⏳ Waiting for VRF callback from dcipher network... 
                    <div className="mt-2 text-sm">
                      The smart contract has requested randomness and is waiting for the callback to complete. 
                      This typically takes 1-2 minutes.
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {selection.transactionHash && (
                  <a
                    href={`https://sepolia.basescan.org/tx/${selection.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#00d4ff] text-black font-black text-lg border-4 border-black hover:bg-[#00d4ff]/90 transition-colors text-center"
                  >
                    VIEW ON BASESCAN
                  </a>
                )}
                
                <button
                  onClick={() => {
                    const text = `Selection ID: ${selection.id}\nWinners: ${selection.winners.join(', ')}\nTransaction: ${selection.transactionHash}\nRandomness: ${selection.randomness}`
                    copyToClipboard(text)
                  }}
                  className="px-6 py-3 bg-[#ffbe0b] text-black font-black text-lg border-4 border-black hover:bg-[#ffbe0b]/90 transition-colors text-center"
                >
                  COPY RESULTS
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
