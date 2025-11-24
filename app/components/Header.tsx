export default function Header() {
  return (
    <header className="w-full border-b border-emerald-500/20 bg-black/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="font-mono text-emerald-400 text-sm">$</div>
            <h1 className="text-xl font-bold font-mono text-emerald-400">
              terminally_onchain
            </h1>
          </div>
          <appkit-button />
        </div>
      </div>
    </header>
  );
}

