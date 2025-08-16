# ProvablyFairLaunchpad

A verifiably fair and transparent selection mechanism for giveaways, raffles, and whitelist selections. Built with blockchain technology using dcipher VRF for provably random selections.

## Overview

The ProvablyFairLaunchpad solves the persistent problem of community distrust around giveaways, raffles, and whitelist selections for high-demand NFT mints or token sales. These processes are often opaque, leading to accusations of favoritism or insider allocation. This tool directly solves that problem by providing a verifiably fair and transparent selection mechanism.

## Features

- **Verifiable Randomness**: Uses dcipher VRF for provably random selections
- **Transparent Results**: All selections are verifiable on-chain
- **Flexible Selection**: Support for 2-10,000 participants and 1-1,000 winners
- **Audit Trail**: Complete transaction history and randomness seeds
- **Access Control**: Owner and requester can cancel selections
- **Gas Efficient**: Optimized for cost-effective operations

## Smart Contract Architecture

### Core Components

- **ProvablyFairLaunchpad**: Main contract for managing selections
- **RandomnessSender**: Interface with dcipher VRF system
- **Selection Management**: Complete lifecycle management of selection requests

### Key Functions

- `requestSelection(participants, winnerCount)`: Request a new random selection
- `fulfillRandomness(requestId, randomness)`: Callback for VRF results
- `getWinners(selectionId)`: Retrieve winners for completed selections
- `verifyFairness(selectionId, expectedWinners)`: Verify selection fairness
- `cancelSelection(selectionId)`: Cancel pending selections

## Installation & Setup

### Prerequisites

- Foundry (forge, cast, anvil)
- Node.js 18+ (for frontend)
- Git

### Smart Contract Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dcipher-launchpad/contracts
```

2. Install dependencies:
```bash
forge install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the contracts:
```bash
forge build
```

5. Run tests:
```bash
forge test
forge test --fuzz-runs 1000
forge test --invariant-runs 256
```

### Deployment

1. Deploy to local network:
```bash
anvil
# In another terminal
forge script script/DeployProvablyFairLaunchpad.s.sol --rpc-url http://localhost:8545 --broadcast
```

2. Deploy to testnet:
```bash
forge script script/DeployProvablyFairLaunchpad.s.sol --rpc-url <testnet-rpc> --broadcast --verify
```

3. Deploy to mainnet:
```bash
forge script script/DeployProvablyFairLaunchpad.s.sol --rpc-url <mainnet-rpc> --broadcast --verify --gas-estimate-multiplier 120
```

## Frontend Application

The frontend provides a clean interface for conducting verifiably random selections.

### Features

- **Input Panel**: Text area for participant wallet addresses
- **Selection Parameters**: Number input for winner count
- **Results Display**: Clear output with winning addresses
- **Verification Links**: Direct links to blockchain explorers
- **Selection History**: Complete audit trail of all selections

### Setup

1. Navigate to the frontend directory:
```bash
cd ../dcipher-launchpad-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Usage

### Conducting a Selection

1. **Input Participants**: Paste a list of wallet addresses (one per line)
2. **Set Winner Count**: Specify how many winners to select
3. **Execute Selection**: Click "Select Winners Verifiably"
4. **View Results**: See the selected winners and verification data
5. **Verify Fairness**: Use the provided links to verify on-chain

### Verification

Each selection provides:
- **Transaction Hash**: On-chain proof of the selection
- **Randomness Seed**: VRF output for verification
- **Etherscan Links**: Direct verification on blockchain explorers
- **Copy Functions**: Easy copying of results and data

## Testing

### Unit Tests

```bash
forge test --match-test test_
```

### Fuzz Tests

```bash
forge test --match-test testFuzz_
```

### Invariant Tests

```bash
forge test --match-test invariant_
```

### Coverage

```bash
forge coverage
```

## Security Features

- **Reentrancy Protection**: Built-in protection against reentrancy attacks
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive validation of all inputs
- **Error Handling**: Custom error types for clear failure modes
- **Gas Optimization**: Efficient operations to minimize costs

## Gas Optimization

- **Efficient Storage**: Optimized data structures
- **Batch Operations**: Support for large participant lists
- **Minimal External Calls**: Reduced gas consumption
- **Smart Contract Design**: Efficient algorithms for winner selection

## Network Support

- **Ethereum Mainnet**: Full production support
- **Ethereum Testnets**: Sepolia, Goerli support
- **Layer 2 Networks**: Compatible with L2 solutions
- **Local Development**: Anvil support for testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the test files for examples

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced selection algorithms
- [ ] Integration with more VRF providers
- [ ] Mobile application
- [ ] API for third-party integrations
- [ ] Advanced analytics and reporting
