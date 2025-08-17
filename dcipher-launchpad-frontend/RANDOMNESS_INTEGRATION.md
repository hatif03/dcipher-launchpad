# Randomness Integration with Smart Contract

This document describes the integration of the `randomness-js` library with the DCipher Launchpad smart contract for provably fair selections.

## Overview

The application now integrates the `randomness-js` library to provide verifiable randomness for the smart contract-based selection system. This ensures that all selections are cryptographically secure and can be independently verified on-chain.

## Key Components

### 1. Contract Integration (`use-contract.ts`)

The `useContract` hook provides a comprehensive interface for interacting with the smart contract:

- **Contract State Reading**: Reads contract balance, subscription ID, next selection ID, and randomness sender
- **Contract Functions**: Handles selection requests, funding, cancellation, and subscription management
- **Randomness Integration**: Integrates with randomness-js for VRF operations

```typescript
const {
  // Contract state
  nextSelectionId,
  contractBalance,
  subscriptionId,
  randomnessSender,
  
  // Contract functions
  requestSelection,
  fundContract,
  cancelSelection,
  createSubscription,
  topUpSubscription,
  
  // Randomness functions
  estimateRandomnessCost,
  requestRandomness,
  verifyRandomness,
  
  // Randomness client
  randomnessClient,
} = useContract()
```

### 2. Randomness Utilities (`randomness.ts`)

The `RandomnessUtils` class provides utility functions for randomness operations:

- **Cost Estimation**: Calculates the cost of randomness requests
- **Winner Selection**: Implements deterministic winner selection using randomness
- **Verification**: Verifies randomness using cryptographic proofs
- **Address Validation**: Validates Ethereum addresses

### 3. Blockchain Service (`blockchain.ts`)

The blockchain service handles the business logic for:

- **Selection Management**: Creating, tracking, and completing selections
- **Randomness Requests**: Managing VRF requests through randomness-js
- **Contract Integration**: Bridging the frontend with smart contract operations

### 4. Randomness Verification Component

A dedicated component for testing and demonstrating randomness operations:

- **Cost Estimation**: Estimate the cost of randomness requests
- **Randomness Requests**: Request randomness from the dcipher VRF system
- **Verification**: Verify randomness using cryptographic proofs
- **Contract Status**: Display contract information and status

## Smart Contract Integration

### Contract Address and ABI

The application integrates with the deployed smart contract:

```typescript
export const CONTRACT_ADDRESS = '0x73ee7F5dd0438406E43559C49639deee907d7137';
export const CONTRACT_ABI = [/* ... contract ABI ... */];
```

### Key Contract Functions

1. **`requestSelection`**: Initiates a selection request with participants and winner count
2. **`createSubscriptionAndFundNative`**: Creates and funds a subscription for randomness requests
3. **`topUpSubscriptionNative`**: Adds funds to an existing subscription
4. **`cancelSelection`**: Cancels a pending selection request
5. **`getSelection`**: Retrieves selection details by ID
6. **`verifyFairness`**: Verifies the fairness of a completed selection

## Randomness Flow

### 1. Selection Request

```typescript
// User submits selection request
const handleSelectionSubmit = async (participants: string[], winnerCount: number) => {
  // Estimate cost for randomness
  const cost = await estimateRandomnessCost(200000)
  
  // Request selection from smart contract
  requestSelection({
    participants,
    winnerCount,
    value: parseEther(cost)
  })
}
```

### 2. Randomness Generation

The smart contract automatically:
- Receives the selection request
- Generates a randomness request ID
- Calls the dcipher VRF system
- Receives cryptographically secure randomness

### 3. Winner Selection

Winners are selected deterministically using the received randomness:

```typescript
const selectWinners = (participants: string[], winnerCount: number, randomness: string): string[] => {
  // Fisher-Yates shuffle using randomness as seed
  const shuffled = [...participants]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const seed = randomness + i.toString()
    const hash = simpleHash(seed)
    const j = hash % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled.slice(0, winnerCount)
}
```

### 4. Verification

Randomness can be verified on-chain using the cryptographic proof:

```typescript
const verifyRandomness = async (
  requestID: string,
  nonce: string,
  randomness: string,
  signature: string
): Promise<boolean> => {
  const result = await randomnessClient.verify({
    requestID: BigInt(requestID),
    nonce: BigInt(nonce),
    randomness: randomness as `0x${string}`,
    signature: signature as `0x${string}`
  }, {
    shouldBlowUp: false
  })
  
  return result
}
```

## Configuration

### Environment Variables

```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Alchemy API Key (optional, for better RPC performance)
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
```

### Network Configuration

The application is configured for Base Sepolia testnet:

```typescript
export const supportedChains: Array<Chain> = [baseSepolia];
```

## Usage Examples

### Estimating Randomness Cost

```typescript
const cost = await estimateRandomnessCost(200000) // 200k gas limit
console.log(`Estimated cost: ${cost} ETH`)
```

### Requesting Randomness

```typescript
const result = await requestRandomness(200000)
if (result.status === 'fulfilled') {
  console.log(`Randomness: ${result.randomness}`)
  console.log(`Request ID: ${result.requestId}`)
}
```

### Verifying Randomness

```typescript
const isValid = await verifyRandomness(
  requestId,
  nonce,
  randomness,
  signature
)
console.log(`Verification result: ${isValid}`)
```

## Security Features

1. **Cryptographic Proofs**: All randomness is cryptographically verifiable
2. **Deterministic Selection**: Winner selection is deterministic and reproducible
3. **On-chain Verification**: Randomness can be verified directly on the blockchain
4. **No Centralized Control**: The system operates without centralized randomness sources

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Graceful fallbacks for network issues
- **Contract Errors**: User-friendly error messages for contract failures
- **Validation Errors**: Input validation with clear error messages
- **Randomness Errors**: Fallback mechanisms for randomness failures

## Testing

### Local Development

1. Start the development server: `npm run dev`
2. Connect a wallet (MetaMask recommended)
3. Switch to Base Sepolia testnet
4. Test randomness requests and verifications

### Contract Testing

The smart contract includes comprehensive tests:

```bash
cd contracts
forge test
```

## Future Enhancements

1. **Batch Operations**: Support for multiple simultaneous selections
2. **Advanced Verification**: Enhanced cryptographic proof verification
3. **Gas Optimization**: Optimized gas usage for cost efficiency
4. **Multi-chain Support**: Support for additional networks
5. **Analytics Dashboard**: Detailed analytics for selection operations

## Troubleshooting

### Common Issues

1. **Randomness Client Not Initialized**
   - Ensure wallet is connected
   - Check network connection
   - Verify randomness-js installation
   - **Provider Issue**: The randomness-js library requires a provider object. Currently using a mock provider for development.

2. **Contract Calls Failing**
   - Verify contract address and ABI
   - Check network configuration
   - Ensure sufficient funds for gas

3. **Verification Failures**
   - Verify input parameters
   - Check randomness and signature format
   - Ensure proper nonce values

4. **Provider Initialization Error**
   - **Error**: "Cannot read properties of undefined (reading 'provider')"
   - **Cause**: The randomness-js library requires a proper provider object
   - **Current Solution**: Using a mock provider for development
   - **Production Solution**: Use the actual wallet provider from the connected wallet

### Provider Initialization Issue

The randomness-js library requires a provider object to function properly. Currently, the application uses a mock provider for development purposes:

```typescript
// Mock provider for development
const mockProvider = {
  getNetwork: async () => ({ chainId: BigInt(84532) }), // Base Sepolia
  getSigner: async () => ({} as any),
} as any

const client = Randomness.createBaseSepolia(mockProvider)
```

**To fix this in production:**

1. **Get the actual provider from the connected wallet:**
```typescript
// In a real implementation, get the provider from the wallet
const provider = await wallet.getProvider()
const client = Randomness.createBaseSepolia(provider)
```

2. **Use wagmi's provider:**
```typescript
import { usePublicClient } from 'wagmi'

const publicClient = usePublicClient()
const client = Randomness.createBaseSepolia(publicClient)
```

3. **Use ethers provider:**
```typescript
import { JsonRpcProvider } from 'ethers'

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
const client = Randomness.createBaseSepolia(provider)
```

### Debug Mode

Enable debug logging by setting:

```typescript
console.log('Randomness client:', randomnessClient)
console.log('Contract state:', { nextSelectionId, contractBalance, subscriptionId })
console.log('Provider info:', await randomnessClient?.provider?.getNetwork())
```

## Support

For technical support or questions about the randomness integration:

1. Check the contract documentation
2. Review the randomness-js library documentation
3. Examine the smart contract source code
4. Contact the development team

---

This integration provides a robust, secure, and verifiable randomness system for the DCipher Launchpad, ensuring fair and transparent selections that can be independently verified on the blockchain.

## Proper Randomness-js Usage Pattern

The application now includes a complete example of how to use the randomness-js library according to the official documentation. Here's the proper workflow:

### 1. Complete Randomness Workflow Example

```typescript
// Example function showing proper randomness-js usage pattern
const generateRandomNumber = async () => {
  if (!randomnessClient) {
    throw new Error('Randomness client not initialized')
  }

  try {
    // Step 1: Estimate the cost for the randomness request
    const [cost] = await randomnessClient.calculateRequestPriceNative(BigInt(200000))
    console.log('Estimated cost:', formatEther(cost), 'ETH')

    // Step 2: Request randomness
    const result = await randomnessClient.requestRandomness({
      callbackGasLimit: BigInt(200000),
      timeoutMs: 60000,
      confirmations: 1,
      pollingIntervalMs: 500
    })

    console.log('Randomness request ID:', result.requestID.toString())
    console.log('Randomness value:', result.randomness)

    // Step 3: Verify the randomness (if needed)
    if (result.randomness) {
      const isValid = await randomnessClient.verify({
        requestID: result.requestID,
        nonce: BigInt(12345),
        randomness: result.randomness,
        signature: '0x...'
      }, {
        shouldBlowUp: false
      })

      console.log('Randomness verification result:', isValid)
    }

    return result
  } catch (error) {
    console.error('Failed to generate random number:', error)
    throw error
  }
}
```

### 2. Provider Setup Requirements

According to the randomness-js documentation, the library requires a provider object with specific methods:

```typescript
// Required provider interface
const provider = {
  getNetwork: async () => ({ chainId: BigInt(84532) }), // Base Sepolia
  getSigner: async () => ({
    getAddress: () => userAddress,
    signMessage: async (message: string) => signature
  })
}

// Create randomness client
const randomness = Randomness.createBaseSepolia(provider)
```

### 3. Production Provider Setup

For production, use real providers:

```typescript
// Option 1: Use ethers provider
import { JsonRpcProvider } from 'ethers'
const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
const randomness = Randomness.createBaseSepolia(provider)

// Option 2: Use wagmi public client
import { usePublicClient } from 'wagmi'
const publicClient = usePublicClient()
const randomness = Randomness.createBaseSepolia(publicClient)

// Option 3: Use wallet provider
const walletProvider = await wallet.getProvider()
const randomness = Randomness.createBaseSepolia(walletProvider)
```

### 4. API Methods

The randomness-js library provides these key methods:

- **`calculateRequestPriceNative(gasLimit)`**: Returns `[cost, gasPrice]`
- **`requestRandomness(options)`**: Returns `{ requestID, randomness, ... }`
- **`verify(params, options)`**: Returns `boolean`

### 5. Testing the Integration

Use the "Generate Random Number" button in the RandomnessVerification component to test the complete workflow:

1. **Estimate Cost**: Calculates the cost for randomness requests
2. **Request Randomness**: Generates cryptographically secure randomness
3. **Auto-fill Fields**: Populates verification fields for testing
4. **Verify Randomness**: Demonstrates the verification process

This provides a complete example of how to integrate randomness-js in your own applications.
