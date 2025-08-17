import { ProvablyFairLaunchpad } from './components/provably-fair-launchpad'
import { WalletConnect } from './components/wallet-connect'
import { NetworkStatus } from './components/network-status'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section - Clean and Organized */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Logo and Navigation */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Logo Section */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-black tracking-tight">
                DCIPHER
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#666666] font-bold mt-1 sm:mt-2">
                PROVABLY FAIR LAUNCHPAD
              </p>
            </div>
            
            {/* Navigation and Wallet Connect */}
            <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
              {/* Navigation Links */}
              <nav className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6">
                <a href="/verification" className="text-sm lg:text-base text-black font-bold hover:text-[#ff006e] transition-colors duration-200 px-2 py-1">
                  VERIFICATION
                </a>
                <a href="/contract-status" className="text-sm lg:text-base text-black font-bold hover:text-[#00d4ff] transition-colors duration-200 px-2 py-1">
                  CONTRACT STATUS
                </a>
                <a href="/randomness-testing" className="text-sm lg:text-base text-black font-bold hover:text-[#06ffa5] transition-colors duration-200 px-2 py-1">
                  RANDOMNESS TESTING
                </a>
              </nav>
              
              {/* Wallet Connect Button */}
              <div className="w-full sm:w-auto">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Clean and Focused */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-8 leading-tight tracking-tight">
            CONDUCT VERIFIABLY FAIR SELECTIONS
          </h2>
          <div className="space-y-4">
            <p className="text-xl sm:text-2xl text-gray-700 font-bold leading-relaxed">
              Input participants, specify winners, and get blockchain-verified results.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 font-semibold leading-relaxed">
              Powered by dcipher VRF technology for true randomness.
            </p>
          </div>
        </div>

        {/* Network Status - Compact */}
        <div className="mb-8">
          <NetworkStatus />
        </div>
        
        {/* Main Launchpad Component - Clean and Simple */}
        <ProvablyFairLaunchpad />
        
        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white border-4 border-black p-6 inline-block">
            <p className="text-lg text-black font-bold">
              Powered by dcipher VRF technology for provably random selections
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-black border-t-4 border-white mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-white font-bold text-lg">
                © 2025 DCipher Launchpad. All rights reserved.
              </p>
            </div>
            
            {/* Developer Attribution */}
            <div className="text-center lg:text-right">
              <p className="text-white font-bold text-lg mb-2">
                Developed by
              </p>
              <a 
                href="https://github.com/hatif03" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white text-black font-black px-4 py-2 border-2 border-white hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>@hatif03</span>
              </a>
            </div>
          </div>
          
          {/* Additional Footer Info */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-white font-black text-lg mb-3">Technology</h4>
                <p className="text-gray-300 text-sm">
                  Built with Next.js, Tailwind CSS, and Web3 technologies
                </p>
              </div>
              <div>
                <h4 className="text-white font-black text-lg mb-3">Blockchain</h4>
                <p className="text-gray-300 text-sm">
                  Powered by dcipher VRF for provably fair randomness
                </p>
              </div>
              <div>
                <h4 className="text-white font-black text-lg mb-3">Open Source</h4>
                <p className="text-gray-300 text-sm">
                  Contributing to the future of decentralized applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
