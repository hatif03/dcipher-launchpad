'use client'

import { useState } from 'react'
import { SelectionForm } from './selection-form'
import { ResultsDisplay } from './results-display'
import { SelectionHistory } from './selection-history'

interface SelectionResult {
  id: string
  participants: string[]
  winnerCount: number
  winners: string[]
  timestamp: Date
  transactionHash?: string
  randomness?: string
}

export function ProvablyFairLaunchpad() {
  const [currentSelection, setCurrentSelection] = useState<SelectionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selections, setSelections] = useState<SelectionResult[]>([])

  const handleSelectionSubmit = async (participants: string[], winnerCount: number) => {
    setIsProcessing(true)
    
    try {
      // Simulate blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a mock selection result for demo purposes
      const result: SelectionResult = {
        id: `selection_${Date.now()}`,
        participants,
        winnerCount,
        winners: selectWinners(participants, winnerCount),
        timestamp: new Date(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        randomness: `0x${Math.random().toString(16).substr(2, 64)}`
      }
      
      setCurrentSelection(result)
      setSelections(prev => [result, ...prev])
    } catch (error) {
      console.error('Selection failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const selectWinners = (participants: string[], winnerCount: number): string[] => {
    // Simple random selection for demo purposes
    // In production, this would use the blockchain VRF
    const shuffled = [...participants].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, winnerCount)
  }

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      {/* Main Selection Interface */}
      <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-8 sm:mb-10 text-center leading-tight">
          CONDUCT A VERIFIABLY RANDOM SELECTION
        </h2>
        
        <SelectionForm 
          onSubmit={handleSelectionSubmit}
          isProcessing={isProcessing}
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

      {/* Selection History */}
      {selections.length > 0 && (
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 brutal-slide-in">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-8 sm:mb-10 leading-tight">
            SELECTION HISTORY
          </h3>
          <SelectionHistory selections={selections} />
        </div>
      )}
    </div>
  )
}
