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
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Logo Section */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-black tracking-tight">
                DCIPHER
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#666666] font-bold mt-1 sm:mt-2">
                PROVABLY FAIR LAUNCHPAD
              </p>
            </div>
            
            {/* Navigation and Wallet Connect */}
            <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-6">
              {/* Navigation Links */}
              <nav className="flex items-center space-x-4 lg:space-x-6">
                <a href="/verification" className="text-sm lg:text-base text-black font-bold hover:text-[#ff006e] transition-colors duration-200">
                  VERIFICATION
                </a>
                <a href="/contract-status" className="text-sm lg:text-base text-black font-bold hover:text-[#00d4ff] transition-colors duration-200">
                  CONTRACT STATUS
                </a>
                <a href="/randomness-testing" className="text-sm lg:text-base text-black font-bold hover:text-[#06ffa5] transition-colors duration-200">
                  RANDOMNESS TESTING
                </a>
              </nav>
              
              {/* Wallet Connect Button */}
              <div className="w-full lg:w-auto">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Clean and Focused */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
            CONDUCT VERIFIABLY FAIR SELECTIONS
          </h2>
          <p className="text-xl sm:text-2xl text-gray-700 font-bold max-w-4xl mx-auto leading-relaxed">
            Input participants, specify winners, and get blockchain-verified results. 
            Powered by dcipher VRF technology for true randomness.
          </p>
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
    </main>
  )
}
