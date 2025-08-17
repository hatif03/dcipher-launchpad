# Dcipher Launchpad

A provably fair launchpad platform built with Solidity smart contracts and a modern Next.js frontend, powered by dcipher's Verifiable Random Function (VRF) system.

## 🚀 Overview

DCipher Launchpad is a decentralized platform that provides provably fair token launches with transparent randomness generation and verifiable fairness mechanisms. The platform combines blockchain technology with cryptographic proofs to ensure trust and transparency in token launches, raffles, and whitelist selections.

## 🏗️ Architecture

The project consists of two main components:

- **Smart Contracts** (`/contracts`): Solidity contracts for the launchpad functionality and randomness integration
- **Frontend** (`/dcipher-launchpad-frontend`): Next.js web application for user interaction and randomness verification

## 🔄 How It Works

### 1. **Randomness Flow Architecture**

The application uses a sophisticated randomness generation system that ensures provable fairness:

```
User Request → Smart Contract → dcipher VRF → Blockchain Callback → Winner Selection → Verification
```

#### **Step-by-Step Process:**

1. **User Initiates Selection**: A user submits a list of participants and desired winner count
2. **Smart Contract Request**: The contract calls dcipher's VRF system to request randomness
3. **Randomness Generation**: dcipher's decentralized network generates cryptographically secure randomness
4. **Blockchain Callback**: The randomness is delivered back to the smart contract via `onRandomnessReceived()`
5. **Winner Selection**: Winners are selected using the Fisher-Yates shuffle algorithm with the random seed
6. **Verification**: Users can verify the fairness by checking the randomness and selection process

### 2. **Smart Contract Integration**

The `ProvablyFairLaunchpad` contract integrates with dcipher's VRF system through:

- **RandomnessReceiverBase**: Abstract contract that handles randomness callbacks
- **RandomnessSender**: Interface to dcipher's VRF service (deployed at `0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779` on Base Sepolia)
- **Direct Funding**: Users pay for randomness requests directly in ETH

### 3. **Frontend-Backend Communication**

The frontend communicates with the blockchain through:

- **Wallet Integration**: MetaMask and WalletConnect support
- **Contract Interaction**: Direct calls to deployed smart contracts
- **Randomness Verification**: Cryptographic proof verification using dcipher's libraries

## 📁 Project Structure

```
dcipher-launchpad/
├── contracts/                    # Smart contract source code
│   ├── src/                     # Main contract files
│   │   ├── ProvablyFairLaunchpad.sol    # Main launchpad contract
│   │   └── Counter.sol                  # Example contract
│   ├── script/                  # Deployment scripts
│   │   └── DeployProvablyFairLaunchpad.s.sol
│   ├── test/                    # Test files with mock randomness
│   ├── lib/                     # Dependencies (Foundry, dcipher VRF, etc.)
│   │   └── randomness-solidity/ # dcipher's randomness library
│   ├── deploy.config            # Deployment configuration
│   └── foundry.toml            # Foundry configuration
├── dcipher-launchpad-frontend/  # Next.js frontend application
│   ├── app/                     # Next.js 13+ app directory
│   │   ├── components/          # React components
│   │   │   ├── provably-fair-launchpad.tsx    # Main interface
│   │   │   ├── selection-form.tsx             # User input forms
│   │   │   ├── results-display.tsx            # Results display
│   │   │   ├── randomness-verification.tsx    # Randomness verification
│   │   │   └── wallet-connect.tsx             # Wallet integration
│   │   ├── services/            # Business logic
│   │   │   └── blockchain.ts    # Smart contract integration
│   │   ├── utils/               # Utility functions
│   │   │   └── randomness.ts    # Randomness utilities
│   │   └── hooks/               # Custom React hooks
│   ├── config/                  # Configuration files
│   └── package.json            # Frontend dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🛠️ Smart Contracts

### Core Contracts

- **`ProvablyFairLaunchpad.sol`**: Main launchpad contract that:
  - Manages selection requests and randomness
  - Integrates with dcipher VRF for provable randomness
  - Implements winner selection algorithms
  - Provides fairness verification mechanisms

### Key Smart Contract Features

#### **Randomness Integration**
```solidity
// Request randomness from dcipher VRF
(uint256 requestId, ) = _requestRandomnessPayInNative(DEFAULT_CALLBACK_GAS_LIMIT);

// Receive randomness callback
function onRandomnessReceived(uint256 requestId, bytes32 randomness) internal override {
    // Process randomness and select winners
    selection.winners = _selectWinners(selection.participants, selection.winnerCount, randomness);
}
```

#### **Winner Selection Algorithm**
- **Fisher-Yates Shuffle**: Uses the random seed to shuffle participants
- **Deterministic**: Same randomness always produces same results
- **Verifiable**: Results can be reproduced off-chain for verification

#### **Fairness Verification**
- **Cryptographic Proofs**: Randomness is cryptographically verifiable
- **Transparent Selection**: All selection criteria are public
- **Audit Trail**: Complete history of all selections and randomness

### Dependencies

- **Foundry**: Development framework for Ethereum smart contracts
- **dcipher VRF**: Decentralized randomness generation system
- **OpenZeppelin**: Secure smart contract libraries

## 🎨 Frontend

### Technology Stack

- **Next.js 13+**: React framework with app directory
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Viem**: Ethereum library for smart contract interaction
- **dcipher randomness-js**: JavaScript library for randomness verification

### Key Components

#### **Main Interface (`provably-fair-launchpad.tsx`)**
- Displays current selection status
- Shows randomness verification results
- Manages the complete user workflow

#### **Selection Form (`selection-form.tsx`)**
- User input for participants and winner count
- Validation and error handling
- Integration with smart contract functions

#### **Randomness Verification (`randomness-verification.tsx`)**
- Displays randomness proofs
- Allows users to verify fairness
- Shows cryptographic verification results

#### **Blockchain Service (`blockchain.ts`)**
- Manages smart contract interactions
- Handles randomness requests and responses
- Provides contract state management

## 🔐 Security & Fairness

### **Provable Randomness**
- **Decentralized**: No single entity controls randomness generation
- **Cryptographic**: Uses BLS signatures and zero-knowledge proofs
- **Verifiable**: All randomness can be cryptographically verified
- **Unpredictable**: Future randomness cannot be predicted from past values

### **Smart Contract Security**
- **Access Control**: Only authorized contracts can provide randomness
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Input Validation**: Comprehensive validation of all user inputs
- **Emergency Functions**: Owner can pause or recover stuck funds

### **Fairness Guarantees**
- **Transparent Selection**: All selection criteria are public
- **Deterministic Results**: Same inputs always produce same outputs
- **Verifiable Process**: Complete audit trail of all operations
- **No Manipulation**: Winners cannot be influenced by any party

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Foundry (for smart contract development)
- Git
- MetaMask or compatible wallet
- Base Sepolia testnet ETH

### Smart Contract Development

1. **Install Foundry**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Navigate to contracts directory**
   ```bash
   cd contracts
   ```

3. **Install dependencies**
   ```bash
   forge install
   ```

4. **Compile contracts**
   ```bash
   forge build
   ```

5. **Run tests**
   ```bash
   forge test
   ```

6. **Deploy contracts**
   ```bash
   # Set up environment variables
   cp deploy.config .env
   # Edit .env with your private key and RPC URL
   
   # Deploy to Base Sepolia
   forge script DeployProvablyFairLaunchpad --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY --broadcast
   ```

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd dcipher-launchpad-frontend
   ```

2. **Set up environment variables**
   ```bash
   cp ENVIRONMENT_SETUP.md .env.local
   # Edit .env.local with your configuration
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts
forge test
```

The test suite includes:
- **Unit Tests**: Individual function testing
- **Integration Tests**: End-to-end workflow testing
- **Fuzz Tests**: Randomized input testing
- **Invariant Tests**: State consistency verification

### Frontend Tests

```bash
cd dcipher-launchpad-frontend
npm test
```

## 🔧 Configuration

### Environment Variables

#### **Smart Contracts**
- `PRIVATE_KEY`: Your wallet private key for deployment
- `RPC_URL`: Base Sepolia RPC endpoint
- `ETHERSCAN_API_KEY`: For contract verification

#### **Frontend**
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- `NEXT_PUBLIC_ALCHEMY_KEY`: Alchemy API key for Base Sepolia
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Deployed contract address

### Network Configuration

- **Network**: Base Sepolia testnet
- **Chain ID**: 84532
- **Currency**: ETH
- **Block Explorer**: https://sepolia.basescan.org
- **dcipher VRF**: 0xf4e080Db4765C856c0af43e4A8C4e31aA3b48779

## 📚 Documentation

- **Smart Contracts**: See individual contract files for detailed documentation
- **Frontend**: Component documentation in respective `.tsx` files
- **Deployment**: Check `contracts/DEPLOYMENT.md` for deployment instructions
- **Environment Setup**: See `dcipher-launchpad-frontend/ENVIRONMENT_SETUP.md`
- **Wallet Integration**: See `dcipher-launchpad-frontend/WALLET_INTEGRATION_GUIDE.md`
- **Randomness Integration**: See `dcipher-launchpad-frontend/RANDOMNESS_INTEGRATION.md`

## 🔒 Security Considerations

- **Never commit private keys** or sensitive environment variables
- **Test thoroughly** on testnets before mainnet deployment
- **Verify contracts** on block explorers after deployment
- **Use hardware wallets** for production deployments
- **Regular security audits** are recommended

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation in each component
- Review the test files for usage examples
- Consult dcipher's documentation: https://docs.dcipher.network

## 🔮 Roadmap

- [ ] Enhanced randomness verification with multiple VRF providers
- [ ] Multi-chain support (Ethereum, Polygon, Arbitrum)
- [ ] Advanced launchpad features (tiered sales, time-based releases)
- [ ] Mobile application with React Native
- [ ] Integration with major DEXs and launchpad platforms
- [ ] Advanced analytics and reporting dashboard
- [ ] Community governance and DAO integration

---

**Note**: This is a development project. Always test thoroughly before deploying to mainnet. The randomness system provides provable fairness, but users should verify all results independently.
