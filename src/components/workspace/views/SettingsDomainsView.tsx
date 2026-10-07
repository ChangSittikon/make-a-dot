import { BookOpen, Zap } from 'lucide-react';

export function SettingsDomainsView() {
  const suggestedDomains = [
    { name: 'smexsupply.com', highlighted: true },
    { name: 'smexdeals.com', highlighted: false },
    { name: 'smexcard.com', highlighted: false },
    { name: 'smexsupply.app', highlighted: false },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Domains</h1>
          <p className="text-sm text-zinc-400">Publish your project to custom domains.</p>
        </div>
        <a 
          href="#" 
          className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4 mr-1.5" /> Docs
        </a>
      </div>

      {/* Custom domains Section */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Custom domains</h2>
        <p className="text-xs text-zinc-400 mb-4">Connect or buy domains for this project</p>

        {/* Domains Card */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 shadow-sm divide-y divide-zinc-800/60">
          {/* Row 1: Buy new domain */}
          <div className="pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">Buy a new domain</h3>
                  <span className="inline-flex items-center text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60">
                    <Zap className="w-2.5 h-2.5 mr-0.5 fill-zinc-300" /> Pro
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Buy and automatically connect a new domain in Lovable.
                </p>
              </div>

              <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0">
                Buy new domain
              </button>
            </div>

            {/* Suggested domain pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestedDomains.map((d) => (
                <span
                  key={d.name}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    d.highlighted
                      ? 'bg-[#1c1c1c] text-zinc-200 border border-orange-500/70 shadow-sm'
                      : 'bg-[#1a1a1a] text-zinc-400 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Row 2: Connect existing domain */}
          <div className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">Connect existing domain</h3>
                  <span className="inline-flex items-center text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60">
                    <Zap className="w-2.5 h-2.5 mr-0.5 fill-zinc-300" /> Pro
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Connect a domain you own from Lovable or any other provider.
                </p>
              </div>

              <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0">
                Connect domain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
