# Wallet Connection Setup

This project uses RainbowKit, Wagmi, and Viem for wallet connection functionality.

## Required Setup

### 1. WalletConnect Project ID

To enable WalletConnect functionality, you need to get a Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/):

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID

### 2. Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# WalletConnect Project ID (get one from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Custom RPC URLs
# NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 3. Supported Networks

The application currently supports:
- **Base Sepolia** (Testnet)

## Features

### Wallet Connection
- Connect with MetaMask, WalletConnect, and other injected wallets
- Automatic network detection and switching
- Balance display
- Account information

### Contract Integration
- Read contract state using TanStack React Query
- Write contract functions with transaction tracking
- Automatic state updates and cache invalidation

### Network Management
- Automatic network switching to supported chains
- Network status warnings
- One-click network switching

## Usage

### Basic Wallet Connection
```tsx
import { WalletConnect } from './components/wallet-connect'

// Use in your component
<WalletConnect />
```

### Contract Interactions
```tsx
import { useContract } from './hooks/use-contract'

function MyComponent() {
  const { 
    requestSelection, 
    isRequestingSelection, 
    contractBalance 
  } = useContract()
  
  // Use the contract functions
}
```

### Wallet Status
```tsx
import { useWallet } from './hooks/use-wallet'

function MyComponent() {
  const { 
    isConnected, 
    address, 
    balance, 
    isOnSupportedNetwork 
  } = useWallet()
  
  // Use wallet information
}
```

## Troubleshooting

### Wallet Not Connecting
1. Ensure you have a WalletConnect Project ID set
2. Check that you're on a supported network (Base Sepolia)
3. Try refreshing the page
4. Check browser console for errors

### Wrong Network
- The app will automatically show a network switching prompt
- Click "Switch to Base Sepolia" to change networks
- Ensure your wallet supports Base Sepolia

### Contract Calls Failing
1. Verify you're connected to the correct network
2. Check that you have sufficient balance for gas fees
3. Ensure the contract address is correct
4. Check the browser console for detailed error messages
