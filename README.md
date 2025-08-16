# DCipher Launchpad

A provably fair launchpad platform built with Solidity smart contracts and a modern Next.js frontend.

## 🚀 Overview

DCipher Launchpad is a decentralized platform that provides provably fair token launches with transparent randomness generation and verifiable fairness mechanisms. The platform combines blockchain technology with cryptographic proofs to ensure trust and transparency in token launches.

## 🏗️ Architecture

The project consists of two main components:

- **Smart Contracts** (`/contracts`): Solidity contracts for the launchpad functionality
- **Frontend** (`/dcipher-launchpad-frontend`): Next.js web application for user interaction

## 📁 Project Structure

```
dcipher-launchpad/
├── contracts/                    # Smart contract source code
│   ├── src/                     # Main contract files
│   ├── script/                  # Deployment scripts
│   ├── test/                    # Test files
│   ├── lib/                     # Dependencies (Foundry, OpenZeppelin, etc.)
│   └── foundry.toml            # Foundry configuration
├── dcipher-launchpad-frontend/  # Next.js frontend application
│   ├── app/                     # Next.js 13+ app directory
│   ├── components/              # React components
│   ├── public/                  # Static assets
│   └── package.json            # Frontend dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🛠️ Smart Contracts

### Core Contracts

- **`ProvablyFairLaunchpad.sol`**: Main launchpad contract with fairness mechanisms
- **`Counter.sol`**: Example contract for testing purposes

### Dependencies

- **Foundry**: Development framework for Ethereum smart contracts
- **OpenZeppelin**: Secure smart contract libraries
- **Randomness Solidity**: Custom randomness generation library

### Key Features

- Provably fair token launches
- Transparent randomness generation
- Verifiable fairness proofs
- Secure smart contract architecture

## 🎨 Frontend

### Technology Stack

- **Next.js 13+**: React framework with app directory
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Component-based UI library

### Components

- **`provably-fair-launchpad.tsx`**: Main launchpad interface
- **`selection-form.tsx`**: User input forms
- **`results-display.tsx`**: Results and verification display

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Foundry (for smart contract development)
- Git

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
   forge script DeployProvablyFairLaunchpad --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
   ```

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd dcipher-launchpad-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts
forge test
```

### Frontend Tests

```bash
cd dcipher-launchpad-frontend
npm test
```

## 📚 Documentation

- **Smart Contracts**: See individual contract files for detailed documentation
- **Frontend**: Component documentation in respective `.tsx` files
- **Deployment**: Check `contracts/DEPLOYMENT.md` for deployment instructions

## 🔒 Security

- All smart contracts are thoroughly tested
- OpenZeppelin libraries provide battle-tested security
- Provably fair mechanisms ensure transparency
- Regular security audits recommended

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

## 🔮 Roadmap

- [ ] Enhanced randomness verification
- [ ] Multi-chain support
- [ ] Advanced launchpad features
- [ ] Mobile application
- [ ] Integration with major DEXs

---

**Note**: This is a development project. Always test thoroughly before deploying to mainnet.
