'use client'

import { SelectionResult } from '../types/selection'

interface ResultsDisplayProps {
  selection: SelectionResult
}

export function ResultsDisplay({ selection }: ResultsDisplayProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Selection Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#ff006e] border-4 border-black p-6 text-center">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">{selection.participants.length}</div>
          <div className="text-white text-lg font-black uppercase tracking-wide">Total Participants</div>
        </div>
        <div className="bg-[#00d4ff] border-4 border-black p-6 text-center">
          <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-black">{selection.winnerCount}</div>
          <div className="text-black text-lg font-black uppercase tracking-wide">Winners Selected</div>
        </div>
        <div className="bg-[#ffbe0b] border-4 border-black p-6 text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-black break-words">{formatTimestamp(selection.timestamp)}</div>
          <div className="text-black text-lg font-black uppercase tracking-wide">Selection Time</div>
        </div>
      </div>

      {/* Transaction Hash - Show prominently if available */}
      {selection.transactionHash && (
        <div className="bg-green-100 border-4 border-green-400 p-6">
          <h4 className="text-green-800 font-black text-xl mb-4 uppercase tracking-wide">✅ TRANSACTION CONFIRMED</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-black text-green-700 mb-2 uppercase tracking-wide">
                Transaction Hash
              </label>
              <code className="block bg-white border-2 border-green-300 px-4 py-3 text-green-800 font-mono text-base break-all">
                {selection.transactionHash}
              </code>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => copyToClipboard(selection.transactionHash!)}
                className="px-6 py-3 bg-green-600 text-white font-black text-lg border-2 border-green-700 hover:bg-green-700 transition-colors whitespace-nowrap"
                title="Copy transaction hash"
              >
                COPY
              </button>
              <a
                href={`https://sepolia.basescan.org/tx/${selection.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white font-black text-lg border-2 border-blue-700 hover:bg-blue-700 transition-colors text-center"
              >
                VIEW ON BASESCAN
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Winners List */}
      <div className="bg-[#06ffa5] border-4 border-black p-8">
        <h4 className="text-black font-black text-2xl sm:text-3xl mb-6 uppercase tracking-wide">Selected Winners</h4>
        {selection.winners && selection.winners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selection.winners.map((winner: string, index: number) => (
              <div key={index} className="bg-white border-4 border-black p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#06ffa5] border-4 border-black flex items-center justify-center text-black font-black text-lg sm:text-xl">
                      {index + 1}
                    </div>
                    <span className="text-black font-mono text-lg sm:text-xl font-black">{formatAddress(winner)}</span>
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
        ) : (
          <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
            ⏳ Waiting for winners to be selected... This will be populated when the randomness is received and winners are calculated.
          </div>
        )}
      </div>

      {/* Verification Information */}
      <div className="bg-[#06ffa5] border-4 border-black p-8">
        <h4 className="text-black font-black text-2xl sm:text-3xl mb-6 uppercase tracking-wide">Verification & Transparency</h4>
        
        <div className="space-y-8">
          {/* Transaction Hash */}
          {selection.transactionHash ? (
            <div>
              <label className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
                Transaction Hash (On-Chain Proof)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <code className="flex-1 bg-white border-4 border-black px-4 py-3 text-black font-mono text-base break-all">
                  {selection.transactionHash}
                </code>
                <button
                  onClick={() => copyToClipboard(selection.transactionHash!)}
                  className="px-6 py-3 bg-[#06ffa5] text-black font-black text-lg border-4 border-black hover:bg-[#06ffa5]/90 transition-colors whitespace-nowrap"
                  title="Copy transaction hash"
                >
                  COPY
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                ✅ This transaction hash proves your selection was recorded on the blockchain
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
                Transaction Hash (On-Chain Proof)
              </label>
              <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                ⏳ Waiting for transaction hash... 
                <div className="mt-2 text-sm">
                  The transaction hash will appear here once your selection request is confirmed on the blockchain. 
                  This typically happens within 10-30 seconds after you submit the selection.
                  <br /><br />
                  <strong>Status:</strong> {selection.status === 'pending' ? 'Processing selection request...' : 'Unknown'}
                  <br />
                  <strong>What's happening:</strong> Your transaction is being processed by the network. Once confirmed, 
                  you'll see the transaction hash here and can verify it on Basescan.
                </div>
              </div>
            </div>
          )}

          {/* Randomness Seed */}
          {selection.randomness && selection.randomness !== '0x' ? (
            <div>
              <label className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
                Randomness Seed (VRF Output)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <code className="flex-1 bg-white border-4 border-black px-4 py-3 text-black font-mono text-base break-all">
                  {selection.randomness}
                </code>
                <button
                  onClick={() => copyToClipboard(selection.randomness!)}
                  className="px-6 py-3 bg-[#06ffa5] text-black font-black text-lg border-4 border-black hover:bg-[#06ffa5]/90 transition-colors whitespace-nowrap"
                  title="Copy randomness seed"
                >
                  COPY
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
                Randomness Seed (VRF Output)
              </label>
              <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                ⏳ Waiting for VRF callback from dcipher network... 
                <div className="mt-2 text-sm">
                  The smart contract has requested randomness and is waiting for the callback to complete. 
                  This typically takes 1-2 minutes. The page will automatically update when the randomness arrives.
                </div>
              </div>
            </div>
          )}

          {/* Request ID */}
          {selection.requestId ? (
            <div>
              <label className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
                VRF Request ID
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <code className="flex-1 bg-white border-4 border-black px-4 py-3 text-black font-mono text-base break-all">
                  {selection.requestId}
                </code>
                <button
                  onClick={() => copyToClipboard(selection.requestId!)}
                  className="px-6 py-3 bg-[#06ffa5] text-black font-black text-lg border-4 border-black hover:bg-[#06ffa5]/90 transition-colors whitespace-nowrap"
                  title="Copy request ID"
                >
                  COPY
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                This ID tracks your randomness request in the dcipher VRF system
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
                VRF Request ID
              </label>
              <div className="bg-yellow-100 border-4 border-yellow-400 p-4 text-yellow-800 font-black">
                ⏳ Waiting for VRF request to be processed... 
                <div className="mt-2 text-sm">
                  The request ID will be available once the randomness request is submitted to the VRF network.
                </div>
              </div>
            </div>
          )}

          {/* Verification Links */}
          <div className="pt-6 border-t-4 border-black">
            <h5 className="text-xl font-black text-black mb-4 uppercase tracking-wide">Verify Fairness</h5>
            <div className="flex flex-col sm:flex-row gap-4">
              {selection.transactionHash ? (
                <a
                  href={`https://sepolia.basescan.org/tx/${selection.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#00d4ff] text-black font-black text-lg border-4 border-black hover:bg-[#00d4ff]/90 transition-colors text-center"
                >
                  VIEW ON BASESCAN
                </a>
              ) : (
                <button
                  disabled
                  className="px-8 py-4 bg-gray-400 text-gray-600 font-black text-lg border-4 border-gray-300 cursor-not-allowed text-center"
                  title="Transaction hash not available yet"
                >
                  WAITING FOR TX HASH
                </button>
              )}
              
              <button
                onClick={() => {
                  const text = `Selection ID: ${selection.id}\nWinners: ${selection.winners.join(', ')}\nTransaction: ${selection.transactionHash || 'Pending'}\nRandomness: ${selection.randomness || 'Pending'}`
                  copyToClipboard(text)
                }}
                className="px-8 py-4 bg-[#ffbe0b] text-black font-black text-lg border-4 border-black hover:bg-[#ffbe0b]/90 transition-colors text-center"
              >
                COPY RESULTS
              </button>
            </div>
            {!selection.transactionHash && (
              <div className="mt-4 text-sm text-gray-700 text-center">
                🔍 Once the transaction hash appears, you can verify your selection on the blockchain
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white border-4 border-black p-8">
        <h4 className="text-black font-black text-2xl sm:text-3xl mb-6 uppercase tracking-wide">Technical Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
          <div>
            <span className="text-black font-black">Selection ID:</span>
            <span className="text-black ml-3 font-mono">{selection.id}</span>
          </div>
          <div>
            <span className="text-black font-black">Total Participants:</span>
            <span className="text-black ml-3">{selection.participants.length}</span>
          </div>
          <div>
            <span className="text-black font-black">Winners Requested:</span>
            <span className="text-black ml-3">{selection.winnerCount}</span>
          </div>
          <div>
            <span className="text-black font-black">Selection Method:</span>
            <span className="text-black ml-3">dcipher VRF</span>
          </div>
          <div>
            <span className="text-black font-black">Status:</span>
            <span className="text-black ml-3 font-black uppercase">{selection.status || 'completed'}</span>
          </div>
          {selection.transactionHash && (
            <div>
              <span className="text-black font-black">Transaction Hash:</span>
              <span className="text-black ml-3 font-mono text-sm break-all">{selection.transactionHash}</span>
            </div>
          )}
          {selection.requestId && (
            <div>
              <span className="text-black font-black">Request ID:</span>
              <span className="text-black ml-3 font-mono">{selection.requestId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
