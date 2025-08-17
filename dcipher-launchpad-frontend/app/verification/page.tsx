'use client'

import { WalletConnect } from '../components/wallet-connect'
import { WalletStatus } from '../components/wallet-status'
import Link from 'next/link'

export default function VerificationPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
                  DCIPHER
                </h1>
                <p className="text-base sm:text-lg text-[#666666] font-bold mt-1">
                  VERIFICATION & STATUS
                </p>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                <Link href="/" className="text-sm text-black font-bold hover:text-[#ff006e] transition-colors">
                  HOME
                </Link>
                <Link href="/contract-status" className="text-sm text-black font-bold hover:text-[#00d4ff] transition-colors">
                  CONTRACT STATUS
                </Link>
                <Link href="/randomness-testing" className="text-sm text-black font-bold hover:text-[#06ffa5] transition-colors">
                  RANDOMNESS TESTING
                </Link>
              </nav>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
            VERIFICATION & STATUS
          </h2>
          <p className="text-xl text-gray-700 font-bold max-w-3xl mx-auto">
            Verify your wallet connection, check network status, and monitor your selections
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 mb-12">
          <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 text-center leading-tight">
            WALLET CONNECTION STATUS
          </h3>
          <WalletStatus />
        </div>

        {/* How Verification Works */}
        <div className="bg-white border-4 border-black p-8 sm:p-10 lg:p-12 mb-12">
          <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 text-center leading-tight">
            HOW VERIFICATION WORKS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff006e] border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-black text-black">1</span>
              </div>
              <h4 className="text-xl font-black text-black mb-3">Connect Wallet</h4>
              <p className="text-gray-700">
                Connect your Web3 wallet to interact with the launchpad
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00d4ff] border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-black text-black">2</span>
              </div>
              <h4 className="text-xl font-black text-black mb-3">Make Selection</h4>
              <p className="text-gray-700">
                Input participants and specify how many winners you want
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#06ffa5] border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-black text-black">3</span>
              </div>
              <h4 className="text-xl font-black text-black mb-3">Verify Results</h4>
              <p className="text-gray-700">
                Check the blockchain for provably fair results
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-[#ff006e] text-black font-bold py-4 px-8 border-4 border-black hover:bg-[#ff1a7a] transition-colors"
          >
            ← BACK TO LAUNCHPAD
          </Link>
        </div>
      </div>
    </main>
  )
}
