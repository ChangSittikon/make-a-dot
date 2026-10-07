import { HelpCircle, Shield, ShieldCheck, Package, Download } from 'lucide-react';

export function SecurityView() {
  const dependencies = [
    { name: 'react-router-dom', version: '6.27.0', high: 1, medium: 5 },
    { name: 'recharts', version: '2.13.0', high: 1, medium: 3 },
    { name: '@lovable.dev/mcp-js', version: '3.0.5', high: 1, medium: 2 },
    { name: '@supabase/supabase-js', version: '2.87.1', high: 1, medium: 1 },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Security</h1>
        </div>
        <a 
          href="#" 
          className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-4 h-4 mr-1.5" /> Docs
        </a>
      </div>

      {/* Top 2 Scan Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Deep scan */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-white">Deep security scan</h3>
              <span className="bg-blue-950/80 text-blue-400 border border-blue-800/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              AI agents review all your code for issues specific to your app's logic, permissions, and data. Takes about 4 minutes. Includes everything in quick scan.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-500">Free • Not scanned yet</span>
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Run deep scan
            </button>
          </div>
        </div>

        {/* Quick scan */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-white">Quick security scan</h3>
              <span className="bg-zinc-800 text-zinc-400 border border-zinc-700/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Automatic
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Checks your code for common security issues and known misconfigurations. Runs automatically on every publish.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-zinc-500">Free • Last scan 5 minutes ago</span>
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Run quick scan
            </button>
          </div>
        </div>
      </div>

      {/* Middle Card: No issues found */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-10 flex flex-col items-center justify-center mb-6 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1">No issues found</h3>
        <p className="text-xs text-zinc-400 max-w-md text-center leading-relaxed">
          The last security scan didn't surface any issues. The scanner can't catch every possible risk.
        </p>
      </div>

      {/* Bottom Card: Project dependencies */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/70 border border-zinc-700/50 flex items-center justify-center">
              <Package className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Project dependencies</h3>
              <p className="text-xs text-zinc-400">53 packages • 44 known issues</p>
            </div>
          </div>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1 text-xs rounded-lg transition-colors font-medium">
            Hide
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
          Your project's third-party components that implement important functions so that your code does not have to do every little thing on its own.
        </p>

        {/* Dependencies Table */}
        <div className="border border-zinc-800/80 rounded-xl overflow-hidden mb-6">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-[#121212] text-xs font-medium text-zinc-500 border-b border-zinc-800/80">
            <div className="col-span-6">Dependency name</div>
            <div className="col-span-3">Version</div>
            <div className="col-span-3">Known issues</div>
          </div>

          <div className="divide-y divide-zinc-800/60 font-mono text-xs">
            {dependencies.map((dep) => (
              <div key={dep.name} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-zinc-800/30 transition-colors">
                <div className="col-span-6 font-semibold text-zinc-200">{dep.name}</div>
                <div className="col-span-3 text-zinc-400">{dep.version}</div>
                <div className="col-span-3 flex items-center gap-1.5 font-sans">
                  <span className="bg-amber-950/70 text-amber-500 border border-amber-800/50 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {dep.high} High
                  </span>
                  <span className="bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {dep.medium} Medium
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-white hover:bg-zinc-200 text-zinc-950 font-medium px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm">
            Try to fix all
          </button>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center">
            <Download className="w-3.5 h-3.5 mr-1.5 text-zinc-400" /> Download list
          </button>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors">
            Scan dependencies
          </button>
        </div>
      </div>
    </div>
  );
}
