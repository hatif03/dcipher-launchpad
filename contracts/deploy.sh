#!/bin/bash

# Deploy ProvablyFairLaunchpad to Base Sepolia
# Make sure you have:
# 1. A .env file with your PRIVATE_KEY (with 0x prefix)
# 2. Some Base Sepolia ETH in your wallet
# 3. Foundry installed
# 4. Etherscan API key for contract verification

echo "🚀 Deploying ProvablyFairLaunchpad to Base Sepolia..."

# Load environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env file"
    echo "📋 Make sure to include the 0x prefix in your private key"
    exit 1
fi

# Deploy using Foundry
forge script script/DeployProvablyFairLaunchpad.s.sol:DeployProvablyFairLaunchpad \
    --rpc-url https://sepolia.base.org \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --verifier etherscan

echo "✅ Deployment complete!"
echo "📋 Check the output above for your contract address"
