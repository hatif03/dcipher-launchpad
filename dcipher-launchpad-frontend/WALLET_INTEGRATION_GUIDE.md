# Wallet Integration Guide

This document explains how the wallet connection system works in the DCipher Launchpad frontend and how to use it.

## Architecture Overview

The wallet integration uses a modern stack of Web3 libraries:

- **RainbowKit**: Provides the wallet connection UI and modal
- **Wagmi**: Handles blockchain interactions and state management
- **Viem**: Low-level Ethereum library for type safety
- **TanStack React Query**: Manages server state and caching

## File Structure

```
app/
├── components/
│   ├── providers.tsx          # Main provider wrapper
│   ├── wallet-connect.tsx     # Wallet connection button
│   ├── network-status.tsx     # Network switching UI
│   └── wallet-status.tsx      # Wallet status display
├── config/
│   ├── wagmi.ts               # Wagmi configuration
│   └── rainbowkit.ts          # RainbowKit configuration
├── hooks/
│   ├── use-wallet.ts          # Wallet connection state
│   ├── use-contract.ts        # Contract interactions
│   └── use-selections.ts      # Selection management
└── layout.tsx                 # App root with providers
```

## Setup Requirements

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2. Supported Networks

Currently supports:
- **Base Sepolia** (Chain ID: 84532) - Testnet

## How It Works

### 1. Provider Setup

The `Providers` component wraps the entire app with:

```tsx
<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider {...rainbowKitConfig}>
      {children}
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

### 2. Wallet Connection

Users can connect using:
- MetaMask
- WalletConnect
- Injected wallets

### 3. Network Management

- Automatic network detection
- Network switching prompts
- Support for Base Sepolia

## Usage Examples

### Basic Wallet Connection

```tsx
import { WalletConnect } from './components/wallet-connect'

function Header() {
  return (
    <header>
      <WalletConnect />
    </header>
  )
}
```

### Using Wallet State

```tsx
import { useWallet } from './hooks/use-wallet'

function MyComponent() {
  const { 
    isConnected, 
    address, 
    balance, 
    isOnSupportedNetwork 
  } = useWallet()
  
  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }
  
  if (!isOnSupportedNetwork) {
    return <div>Please switch to Base Sepolia</div>
  }
  
  return (
    <div>
      <p>Connected: {address}</p>
      <p>Balance: {balance} ETH</p>
    </div>
  )
}
```

### Contract Interactions

```tsx
import { useContract } from './hooks/use-contract'
import { parseEther } from 'viem'

function ContractInteraction() {
  const { 
    requestSelection, 
    isRequestingSelection, 
    contractBalance 
  } = useContract()
  
  const handleSelection = async () => {
    try {
      await requestSelection({
        participants: ['0x...', '0x...'],
        winnerCount: BigInt(1),
        value: parseEther('0.001')
      })
    } catch (error) {
      console.error('Selection failed:', error)
    }
  }
  
  return (
    <button 
      onClick={handleSelection}
      disabled={isRequestingSelection}
    >
      {isRequestingSelection ? 'Processing...' : 'Request Selection'}
    </button>
  )
}
```

### Network Status

```tsx
import { NetworkStatus } from './components/network-status'

function App() {
  return (
    <div>
      <NetworkStatus />
      {/* Your app content */}
    </div>
  )
}
```

## State Management

### TanStack React Query

The app uses React Query for:
- Caching wallet information
- Managing contract state
- Optimistic updates
- Background refetching

### Query Keys

- `['wallet', address]` - Wallet information
- `['selection', id]` - Individual selections
- `['selections']` - All selections
- `['contractBalance']` - Contract balance

## Error Handling

### Common Issues

1. **Wrong Network**
   - Shows network switching prompt
   - One-click network switching

2. **Wallet Not Connected**
   - Displays connection button
   - Shows helpful messages

3. **Contract Errors**
   - Transaction failure handling
   - User-friendly error messages

### Error Boundaries

Consider implementing error boundaries for:
- Wallet connection failures
- Contract interaction errors
- Network issues

## Testing

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Connect a wallet (MetaMask recommended)

3. Switch to Base Sepolia network

4. Test contract interactions

### Production

1. Build the app:
   ```bash
   npm run build
   ```

2. Test on staging environment

3. Verify wallet connections work

## Security Considerations

### Environment Variables

- Never commit `.env.local` files
- Use different project IDs for dev/staging/prod
- Rotate WalletConnect project IDs regularly

### Contract Interactions

- Validate user inputs
- Check network compatibility
- Handle transaction failures gracefully

### User Experience

- Show loading states
- Provide clear error messages
- Guide users through wallet setup

## Troubleshooting

### Wallet Won't Connect

1. Check WalletConnect project ID
2. Verify network support
3. Clear browser cache
4. Check console for errors

### Contract Calls Failing

1. Ensure correct network
2. Check user balance
3. Verify contract address
4. Review transaction parameters

### Build Errors

1. Check TypeScript types
2. Verify dependency versions
3. Clear node_modules and reinstall
4. Check import statements

## Future Enhancements

### Planned Features

- Multi-chain support
- Transaction history
- Gas estimation
- Batch operations
- Mobile wallet support

### Integration Points

- Connect with existing components
- Add more contract functions
- Implement event listeners
- Add transaction monitoring

## Support

For issues related to:
- **Wallet Connection**: Check RainbowKit documentation
- **Blockchain Interactions**: Review Wagmi documentation
- **State Management**: Consult TanStack React Query docs
- **Contract Integration**: Verify ABI and contract state
