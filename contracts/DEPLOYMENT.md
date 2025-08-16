# Deploying to Base Sepolia

This guide will walk you through deploying your `ProvablyFairLaunchpad` contract to Base Sepolia testnet.

## Prerequisites

1. **Wallet Setup**: A wallet with some Base Sepolia ETH
2. **Foundry**: Make sure Foundry is installed and working
3. **Environment Variables**: Set up your deployment configuration

## Step 1: Get Base Sepolia ETH

1. Visit the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. Connect your wallet
3. Request test ETH (you'll need some for gas fees)

## Step 2: Set Up Environment Variables

1. Copy `deploy.config` to `.env`:
   ```bash
   cp deploy.config .env
   ```

2. Edit `.env` and fill in your values:
   ```bash
   # Your wallet private key (without 0x prefix)
   PRIVATE_KEY=your_actual_private_key_here
   
   # Base Sepolia RPC URL
   RPC_URL=https://sepolia.base.org
   
   # Etherscan API key for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

## Step 3: Deploy the Contract

### Option A: Using the deployment script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option B: Using Foundry directly
```bash
# Deploy without verification
forge script script/DeployProvablyFairLaunchpad.s.sol:DeployProvablyFairLaunchpad \
    --rpc-url https://sepolia.base.org \
    --broadcast

# Deploy with verification (recommended)
forge script script/DeployProvablyFairLaunchpad.s.sol:DeployProvablyFairLaunchpad \
    --rpc-url https://sepolia.base.org \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --verifier-url https://api-sepolia.basescan.org/api
```

## Step 4: Verify Deployment

1. **Check the deployment output** for your contract address
2. **Verify on Base Sepolia Explorer**: [https://sepolia.basescan.org](https://sepolia.basescan.org)
3. **Test the contract** by calling some basic functions

## Step 5: Interact with Your Contract

Once deployed, you can:

1. **Request a selection** by calling `requestSelection()`
2. **Check selection status** using `getSelection()`
3. **Verify fairness** using `verifyFairness()`

## Important Notes

- **RandomnessSender**: The contract is configured to use the official Base Sepolia RandomnessSender at `0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e`
- **Gas Fees**: Base Sepolia has very low gas fees compared to Ethereum mainnet
- **Testnet**: This is a testnet, so tokens have no real value

## Troubleshooting

### Common Issues

1. **Insufficient ETH**: Make sure you have enough Base Sepolia ETH for gas
2. **Private Key Format**: Ensure your private key doesn't include the `0x` prefix
3. **RPC Issues**: If the default RPC is slow, try alternative providers:
   - Alchemy: `https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
   - Infura: `https://base-sepolia.infura.io/v3/YOUR_API_KEY`

### Getting Help

- [Base Documentation](https://docs.base.org/)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [Base Discord](https://discord.gg/base)

## Next Steps

After successful deployment:

1. **Test all functions** to ensure they work correctly
2. **Document your contract address** for future reference
3. **Consider upgrading** to Base mainnet when ready
4. **Set up monitoring** for your contract's activity
