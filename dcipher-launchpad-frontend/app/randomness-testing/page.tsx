'use client'

import { WalletConnect } from '../components/wallet-connect'
import { RandomnessVerification } from '../components/randomness-verification'
import Link from 'next/link'

export default function RandomnessTestingPage() {
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
                  RANDOMNESS TESTING & VERIFICATION
                </p>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                <Link href="/" className="text-sm text-black font-bold hover:text-[#ff006e] transition-colors">
                  HOME
                </Link>
                <Link href="/verification" className="text-sm text-black font-bold hover:text-[#ff006e] transition-colors">
                  VERIFICATION
                </Link>
                <Link href="/contract-status" className="text-sm text-black font-bold hover:text-[#00d4ff] transition-colors">
                  CONTRACT STATUS
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
            RANDOMNESS TESTING & VERIFICATION
          </h2>
          <p className="text-xl text-gray-700 font-bold max-w-4xl mx-auto">
            Test the dcipher VRF system, verify randomness, and understand how provably fair selections work
          </p>
        </div>

        {/* Randomness Verification Component */}
        <RandomnessVerification />

        {/* Additional Information */}
        <div className="mt-12 bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 text-center leading-tight">
            UNDERSTANDING PROVABLY FAIR RANDOMNESS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-black text-black mb-4">What is VRF?</h4>
              <p className="text-gray-700 mb-4">
                Verifiable Random Function (VRF) is a cryptographic primitive that provides 
                verifiable randomness. It generates random values that can be independently 
                verified by anyone, ensuring the randomness was not manipulated.
              </p>
              <p className="text-gray-700">
                In our system, dcipher VRF generates the randomness on-chain, making it 
                impossible for anyone (including the contract owner) to predict or manipulate 
                the results.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-black text-black mb-4">How Verification Works</h4>
              <p className="text-gray-700 mb-4">
                When you request randomness, the system generates a unique request ID and 
                sends it to the VRF network. Once the randomness is generated, you receive:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Request ID:</strong> Unique identifier for your randomness request</li>
                <li><strong>Randomness:</strong> The actual random value generated</li>
                <li><strong>Signature:</strong> Cryptographic proof of authenticity</li>
                <li><strong>Nonce:</strong> Additional entropy for security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-12 bg-white border-4 border-black p-8 sm:p-10 lg:p-12">
          <h3 className="text-3xl sm:text-4xl font-black text-black mb-8 text-center leading-tight">
            REAL-WORLD APPLICATIONS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff006e] border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-black text-black">🎯</span>
              </div>
              <h4 className="text-xl font-black text-black mb-3">Giveaways & Raffles</h4>
              <p className="text-gray-700">
                Fair selection of winners for promotional campaigns and contests
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00d4ff] border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-black text-black">📋</span>
              </div>
              <h4 className="text-xl font-black text-black mb-3">Whitelist Selection</h4>
              <p className="text-gray-700">
                Random selection for NFT drops and token sales
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#06ffa5] border-4 border-black mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-black text-black">🎲</span>
              </div>
              <h4 className="text-xl font-black text-black mb-3">Gaming & Gambling</h4>
              <p className="text-gray-700">
                Provably fair random outcomes for games and betting
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-block bg-[#06ffa5] text-black font-bold py-4 px-8 border-4 border-black hover:bg-[#1affb0] transition-colors"
          >
            ← BACK TO LAUNCHPAD
          </Link>
        </div>
      </div>
    </main>
  )
}
