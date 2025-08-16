#!/bin/bash

# Deploy ProvablyFairLaunchpad to Base Sepolia
# Make sure you have:
# 1. A .env file with your PRIVATE_KEY
# 2. Some Base Sepolia ETH in your wallet
# 3. Foundry installed

echo "🚀 Deploying ProvablyFairLaunchpad to Base Sepolia..."

# Load environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env file"
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
