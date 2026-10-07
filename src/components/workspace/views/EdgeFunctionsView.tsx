import { ChevronDown, Code2 } from 'lucide-react';

export function EdgeFunctionsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Edge functions</h1>
          <p className="text-sm text-zinc-400">Deploy edge functions to handle complex business logic with real-time analytics.</p>
        </div>
        <button className="flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
          Last hour <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/40 text-[13px] font-medium text-zinc-400 bg-[#1a1a1a]/50">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Invocations</div>
          <div className="col-span-2">Success rate</div>
          <div className="col-span-1 text-right whitespace-nowrap">Last updated</div>
        </div>

        {/* Table Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors items-center text-sm">
          <div className="col-span-5 flex items-center font-medium text-zinc-200 truncate pr-4">
            <Code2 className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <span className="truncate">import-thailand-locati...</span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-semibold px-2 py-0.5 rounded-sm">
              Active
            </span>
          </div>
          <div className="col-span-2 text-zinc-300">
            0
          </div>
          <div className="col-span-2 text-zinc-300">
            -
          </div>
          <div className="col-span-1 text-right text-zinc-400 whitespace-nowrap">
            Dec 14, 2025
          </div>
        </div>
      </div>
    </div>
  );
}
