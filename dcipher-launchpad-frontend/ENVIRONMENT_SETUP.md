# Environment Setup Guide

## Prerequisites

**Important**: Before setting up the frontend, you must first deploy the `ProvablyFairLaunchpad` smart contract to Base Sepolia testnet. See the deployment guide in the `contracts/` folder.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### 1. WalletConnect Project ID
```bash
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

### 2. Alchemy API Key (for Base Sepolia RPC)
```bash
# Get from https://www.alchemy.com/
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key_here
```

### 3. Contract Address
```bash
# After deploying the contract, set the deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
```

## How to Get These Keys

### WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID

### Alchemy API Key
1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up or log in
3. Create a new app
4. Select "Base Sepolia" as the network
5. Copy the API Key

## Example .env.local File
```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=abc123def456ghi789

# Alchemy API Key for Base Sepolia
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key_here

# Contract Address (after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed contract address
```

## Important Notes

- **Never commit** `.env.local` files to version control
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- Restart your development server after adding environment variables
- If you don't have these keys, the app will fall back to default values but may have limited functionality

## Troubleshooting

### WalletConnect Issues
- Ensure your project ID is correct
- Check that your project is active on WalletConnect Cloud
- Verify the project supports the Base Sepolia network

### Alchemy Issues
- Ensure your API key is correct
- Check that your app is configured for Base Sepolia
- Verify your API key has the necessary permissions
