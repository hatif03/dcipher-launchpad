import { Randomness } from 'randomness-js'
import { getAddress } from 'viem'

// Configuration for dcipher network
const DCIPHER_CONFIG = {
  // Base Sepolia network configuration
  network: 'base-sepolia',
  chainId: BigInt(84532), // Base Sepolia chain ID
  // The Randomness class will use the built-in BASE_SEPOLIA configuration
}

// Initialize randomness client (will be created when needed)
export let randomnessClient: Randomness | null = null

// Function to initialize the randomness client
export function initializeRandomnessClient(): Randomness {
  if (!randomnessClient) {
    try {
      // Create a proper provider for Base Sepolia
      // According to randomness-js docs, we need a provider with getNetwork and getSigner methods
      const provider = {
        getNetwork: async () => ({ chainId: BigInt(84532) }), // Base Sepolia
        getSigner: async () => ({
          getAddress: () => '0x0000000000000000000000000000000000000000', // Mock address
          signMessage: async (message: string) => {
            // Mock signature for development
            return `0x${Array.from({ length: 64 }, () => 
              Math.floor(Math.random() * 16).toString(16)
            ).join('')}`
          }
        }),
      } as any
      
      randomnessClient = Randomness.createBaseSepolia(provider)
    } catch (error) {
      console.error('Failed to initialize randomness client:', error)
      throw new Error('Failed to initialize randomness client')
    }
  }
  return randomnessClient
}

// Types for randomness operations
export interface RandomnessRequest {
  requestId: string
  status: 'pending' | 'fulfilled' | 'failed'
  randomness?: string
  error?: string
}

export interface SelectionRequest {
  participants: string[]
  winnerCount: number
  callbackGasLimit?: number
}

// Utility functions for randomness operations
export class RandomnessUtils {
  /**
   * Calculate the estimated cost for a randomness request
   */
  static async estimateRequestCost(callbackGasLimit: number = 200000): Promise<string> {
    try {
      if (!randomnessClient) {
        randomnessClient = initializeRandomnessClient()
      }
      
      const [cost] = await randomnessClient.calculateRequestPriceNative(BigInt(callbackGasLimit))
      return (Number(cost) / 1e18).toFixed(6) // Convert from wei to ETH
    } catch (error) {
      console.error('Failed to estimate request cost:', error)
      throw new Error('Failed to estimate request cost')
    }
  }

  /**
   * Verify randomness on-chain
   */
  static async verifyRandomnessOnChain(
    randomnessContract: string,
    signatureContract: string,
    signature: string,
    requestId: string,
    requester: string,
    schemeId: string
  ): Promise<boolean> {
    try {
      if (!randomnessClient) {
        randomnessClient = initializeRandomnessClient()
      }
      
      // This would call the Randomness.verify function from the smart contract
      // For now, returning true as placeholder
      return true
    } catch (error) {
      console.error('Failed to verify randomness:', error)
      return false
    }
  }

  /**
   * Generate a deterministic winner selection using randomness
   * This mimics the smart contract's _selectWinners function
   */
  static selectWinners(
    participants: string[],
    winnerCount: number,
    randomness: string
  ): string[] {
    if (winnerCount > participants.length) {
      throw new Error('Winner count cannot exceed participant count')
    }

    // Create a copy of participants array
    const shuffled = [...participants]
    const participantCount = shuffled.length

    // Fisher-Yates shuffle using randomness as seed
    for (let i = participantCount - 1; i > 0; i--) {
      // Generate deterministic random index using randomness + position
      const seed = randomness + i.toString()
      const hash = this.simpleHash(seed)
      const j = hash % (i + 1)
      
      // Swap elements
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Return first winnerCount participants
    return shuffled.slice(0, winnerCount)
  }

  /**
   * Simple hash function for deterministic shuffling
   * In production, this would use a more robust hashing algorithm
   */
  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Format randomness value for display
   */
  static formatRandomness(randomness: string): string {
    if (!randomness) return 'N/A'
    if (randomness.startsWith('0x')) {
      return randomness
    }
    return `0x${randomness}`
  }

  /**
   * Validate Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    try {
      getAddress(address)
      return true
    } catch {
      return false
    }
  }

  /**
   * Generate a unique selection ID
   */
  static generateSelectionId(): string {
    return `selection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Request randomness using the randomness-js library
   */
  static async requestRandomness(callbackGasLimit: number = 200000): Promise<RandomnessRequest> {
    try {
      if (!randomnessClient) {
        randomnessClient = initializeRandomnessClient()
      }

      const result = await randomnessClient.requestRandomness({
        callbackGasLimit: BigInt(callbackGasLimit),
        timeoutMs: 60000, // 1 minute timeout
        confirmations: 1,
        pollingIntervalMs: 500
      })

      return {
        requestId: result.requestID.toString(),
        status: 'fulfilled',
        randomness: result.randomness as string,
        error: undefined
      }
    } catch (error) {
      console.error('Failed to request randomness:', error)
      return {
        requestId: '',
        status: 'failed',
        randomness: undefined,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verify randomness using the randomness-js library
   */
  static async verifyRandomness(
    requestID: string,
    nonce: string,
    randomness: string,
    signature: string
  ): Promise<boolean> {
    try {
      if (!randomnessClient) {
        randomnessClient = initializeRandomnessClient()
      }

      const result = await randomnessClient.verify({
        requestID: BigInt(requestID),
        nonce: BigInt(nonce),
        randomness: randomness as `0x${string}`,
        signature: signature as `0x${string}`
      }, {
        shouldBlowUp: false // Return boolean instead of throwing
      })

      return result
    } catch (error) {
      console.error('Failed to verify randomness:', error)
      return false
    }
  }
}

// Export default instance
export default RandomnessUtils
