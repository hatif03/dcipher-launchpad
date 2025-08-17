'use client'

import { useState } from 'react'

interface SelectionFormProps {
  onSubmit: (participants: string[], winnerCount: number) => Promise<void>
  isProcessing: boolean
}

export function SelectionForm({ onSubmit, isProcessing }: SelectionFormProps) {
  const [participants, setParticipants] = useState('')
  const [winnerCount, setWinnerCount] = useState(1)
  const [errors, setErrors] = useState<string[]>([])

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    if (!participants.trim()) {
      newErrors.push('Please enter participant addresses')
    }
    
    const addresses = participants.split('\n').filter(addr => addr.trim())
    if (addresses.length < 2) {
      newErrors.push('At least 2 participants are required')
    }
    
    if (addresses.length > 10000) {
      newErrors.push('Maximum 10,000 participants allowed')
    }
    
    if (winnerCount < 1) {
      newErrors.push('Winner count must be at least 1')
    }
    
    if (winnerCount > addresses.length) {
      newErrors.push('Winner count cannot exceed participant count')
    }
    
    if (winnerCount > 1000) {
      newErrors.push('Maximum 1,000 winners allowed')
    }
    
    // Validate Ethereum addresses
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    const invalidAddresses = addresses.filter(addr => !ethAddressRegex.test(addr.trim()))
    if (invalidAddresses.length > 0) {
      newErrors.push('Invalid Ethereum addresses detected')
    }
    
    // Check for duplicates
    const uniqueAddresses = new Set(addresses.map(addr => addr.toLowerCase().trim()))
    if (uniqueAddresses.size !== addresses.length) {
      newErrors.push('Duplicate addresses detected')
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const addresses = participants
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr)
    
    await onSubmit(addresses, winnerCount)
  }

  const handleSampleData = () => {
    const sampleAddresses = [
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x9876543210987654321098765432109876543210',
      '0xfedcba0987654321fedcba0987654321fedcba09',
      '0x1111111111111111111111111111111111111111',
      '0x2222222222222222222222222222222222222222',
      '0x3333333333333333333333333333333333333333',
      '0x4444444444444444444444444444444444444444',
      '0x5555555555555555555555555555555555555555',
      '0x6666666666666666666666666666666666666666',
      '0x7777777777777777777777777777777777777777',
      '0x8888888888888888888888888888888888888888',
      '0x9999999999999999999999999999999999999999',
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      '0xcccccccccccccccccccccccccccccccccccccccc',
      '0xdddddddddddddddddddddddddddddddddddddddd',
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      '0xffffffffffffffffffffffffffffffffffffffff'
    ].join('\n')
    
    setParticipants(sampleAddresses)
    setWinnerCount(3)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
      {/* Participant Addresses Input */}
      <div>
        <label htmlFor="participants" className="block text-lg sm:text-xl font-black text-[#00d4ff] mb-4 uppercase tracking-wide">
          PARTICIPANT WALLET ADDRESSES
        </label>
        <textarea
          id="participants"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder="Enter wallet addresses, one per line:&#10;0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6&#10;0x1234567890123456789012345678901234567890&#10;..."
          className="w-full h-40 sm:h-48 lg:h-56 px-6 py-4 font-mono text-lg border-4 border-black bg-white text-black placeholder-gray-500 resize-none focus:outline-none focus:border-[#00d4ff] transition-colors"
          disabled={isProcessing}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-3 sm:space-y-0">
          <p className="text-lg font-black text-[#00d4ff]">
            {participants.split('\n').filter(addr => addr.trim()).length} PARTICIPANTS
          </p>
          <button
            type="button"
            onClick={handleSampleData}
            className="px-6 py-3 bg-[#ffbe0b] text-black font-black text-lg border-4 border-black hover:bg-[#ffbe0b]/90 transition-colors"
            disabled={isProcessing}
          >
            LOAD SAMPLE DATA
          </button>
        </div>
      </div>

      {/* Winner Count Input */}
      <div>
        <label htmlFor="winnerCount" className="block text-lg sm:text-xl font-black text-[#00d4ff] mb-4 uppercase tracking-wide">
          NUMBER OF WINNERS
        </label>
        <input
          type="number"
          id="winnerCount"
          value={winnerCount}
          onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
          min="1"
          max="1000"
          className="w-full px-6 py-4 font-mono text-lg border-4 border-black bg-white text-black focus:outline-none focus:border-[#00d4ff] transition-colors"
          disabled={isProcessing}
        />
        <p className="text-lg font-black text-[#00d4ff] mt-3">
          Select between 1 and {Math.min(1000, participants.split('\n').filter(addr => addr.trim()).length)} winners
        </p>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-[#ff006e] border-4 border-black p-6">
          <h4 className="text-white font-black text-xl mb-4 uppercase tracking-wide">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-white space-y-2 font-bold text-lg">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center pt-6">
        <button
          type="submit"
          disabled={isProcessing}
          className="px-12 py-6 bg-[#ff006e] text-white font-black text-2xl border-4 border-black hover:bg-[#ff006e]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
              <span>PROCESSING SELECTION...</span>
            </div>
          ) : (
            'SELECT WINNERS VERIFIABLY'
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-[#00d4ff] border-4 border-black p-8">
        <h4 className="text-black font-black text-xl mb-6 uppercase tracking-wide">How it works:</h4>
        <ul className="text-black text-lg space-y-3 font-bold">
          <li>• Enter participant wallet addresses (one per line)</li>
          <li>• Specify the number of winners to select</li>
          <li>• Our system uses blockchain-based VRF for provably random selection</li>
          <li>• Results are verifiable on-chain for complete transparency</li>
        </ul>
      </div>
    </form>
  )
}
