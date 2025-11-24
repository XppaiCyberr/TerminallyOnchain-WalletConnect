import Header from "./components/Header";
import GmTool from "./components/GmTool";
import FaucetTool from "./components/FaucetTool";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-emerald-950/20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-400 font-mono text-xs sm:text-sm">$ ./gm.sh --all-chains</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent px-4">
            terminally_onchain
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto font-mono px-4">
            &gt; Send GM across <span className="text-emerald-400">multiple chains</span> and request <span className="text-blue-400">ETH</span> from the faucet
          </p>
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500 font-mono px-4">
            <span className="text-emerald-500">●</span>
            <span>Base</span>
            <span className="text-emerald-500">●</span>
            <span>Ethereum</span>
            <span className="text-emerald-500">●</span>
            <span>Optimism</span>
            <span className="text-emerald-500">●</span>
            <span>Arbitrum</span>
          </div>
        </div>

        {/* GM Tool - Full Width */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <GmTool />
        </div>

        {/* Faucet Tool - Full Width */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <FaucetTool />
        </div>

        {/* Footer Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 text-center px-4">
          <div className="inline-block bg-zinc-900/50 border border-emerald-500/20 rounded-lg p-4 sm:p-6 md:p-8 max-w-2xl backdrop-blur-sm w-full sm:w-auto">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <span className="text-emerald-400 font-mono text-lg sm:text-xl md:text-2xl">$</span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-emerald-400 font-mono">
                ./init
              </h3>
            </div>
            <p className="text-zinc-400 mb-4 sm:mb-6 font-mono text-xs sm:text-sm leading-relaxed">
              Connect your wallet to start sending GMs across multiple chains and request ETH from the faucet.
              <span className="hidden sm:inline"><br /></span>
              <span className="sm:hidden"> </span>
              Each network maintains separate stats and streaks.
            </p>
            <div className="bg-black/50 border border-emerald-500/30 rounded p-3 sm:p-4 text-left font-mono text-[10px] sm:text-xs text-emerald-400">
              <div className="flex items-start gap-1.5 sm:gap-2">
                <span className="text-emerald-500 shrink-0">{'>'}</span>
                <span>Click <span className="text-white font-semibold">Connect Wallet</span> in the header</span>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 mt-1">
                <span className="text-emerald-500 shrink-0">{'>'}</span>
                <span>Select your network of choice</span>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 mt-1">
                <span className="text-emerald-500 shrink-0">{'>'}</span>
                <span>Send GM and maintain your streak</span>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 mt-1">
                <span className="text-blue-500 shrink-0">{'>'}</span>
                <span>Request ETH from <span className="text-blue-400">Base & Arbitrum</span> faucets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Terminal Line */}
        <div className="mt-8 sm:mt-12 text-center px-4">
          <div className="text-emerald-500/30 font-mono text-[10px] sm:text-xs overflow-hidden">
            <span className="hidden sm:inline">─────────────────────────────────────────────────────────</span>
            <span className="sm:hidden">───────────────────────────────────</span>
          </div>
          <div className="text-zinc-600 font-mono text-[10px] sm:text-xs mt-2">
            terminally onchain © 2025
          </div>
        </div>
      </main>
    </div>
  );
}
