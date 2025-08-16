import { ProvablyFairLaunchpad } from './components/provably-fair-launchpad'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section - White Background */}
      <header className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Logo and Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight">
                DCIPHER
              </h1>
              <p className="text-lg sm:text-xl text-[#666666] font-bold mt-2">
                PROVABLY FAIR LAUNCHPAD
              </p>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              <a href="#features" className="text-black font-bold hover:text-[#ff006e] transition-colors">
                FEATURES
              </a>
              <a href="#how-it-works" className="text-black font-bold hover:text-[#00d4ff] transition-colors">
                HOW IT WORKS
              </a>
              <a href="#verification" className="text-black font-bold hover:text-[#06ffa5] transition-colors">
                VERIFICATION
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Two Large Color Blocks */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Left Block - Hot Pink */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="bg-[#ff006e] p-8 sm:p-10 lg:p-12 border-4 border-black">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-6 leading-tight">
              GO FROM ZERO TO WINNERS
            </h2>
            <p className="text-lg sm:text-xl text-black font-bold leading-relaxed">
              With DCipher, anyone can conduct verifiably fair selections for giveaways, raffles, 
              and whitelist selections. Just input your participants, specify winners, and get 
              blockchain-verified results. It's that simple.
            </p>
          </div>
          
          {/* Right Block - Electric Blue */}
          <div className="bg-[#00d4ff] p-8 sm:p-10 lg:p-12 border-4 border-black relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-6">
                PROVABLY RANDOM
              </h3>
              <p className="text-lg sm:text-xl text-black font-bold leading-relaxed">
                Our system uses advanced blockchain-based VRF technology to ensure complete 
                transparency and verifiable randomness. Every selection can be independently 
                verified on-chain.
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-[#ffbe0b] border-4 border-black"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-[#06ffa5] border-4 border-black"></div>
          </div>
        </div>

        {/* Main Component */}
        <ProvablyFairLaunchpad />
        
        {/* Footer */}
        <div className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <div className="bg-white border-4 border-black p-6 inline-block">
            <p className="text-lg sm:text-xl text-black font-bold">
              Powered by dcipher VRF technology for provably random selections
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
