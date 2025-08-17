export interface SelectionResult {
  id: string
  participants: string[]
  winnerCount: number
  winners: string[]
  timestamp: Date
  transactionHash?: string
  randomness?: string
  status: 'pending' | 'completed' | 'cancelled'
  requestId?: string
  completedAt?: Date
  cancelledAt?: Date
}
