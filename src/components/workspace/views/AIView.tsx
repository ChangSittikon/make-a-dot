import { ChevronDown, RefreshCw, Zap, Sparkles, List, ArrowUpRight } from 'lucide-react';

export function AIView() {
  const stats = [
    { label: 'Credits used', value: '0' },
    { label: 'AI requests', value: '0' },
    { label: 'Success rate', value: '-' },
    { label: 'Avg. time', value: '-' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">AI</h1>
          <p className="text-sm text-zinc-400">Monitor your app's AI activity: what's running, its performance and cost</p>
        </div>
        <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors font-medium">
          All AI models
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm font-medium">
          Last 24 hours <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
        </button>
        <button className="flex items-center justify-center bg-transparent border border-zinc-700/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 w-8 h-8 rounded-md transition-colors shadow-sm">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Upgrade Banner */}
      <div className="bg-[#2a1b41]/40 border border-[#4d2d7a] rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
        <div className="flex items-start">
          <Sparkles className="w-4 h-4 text-purple-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-purple-200 mb-0.5">Free plan shows the last 24 hours of logs</h3>
            <p className="text-xs text-purple-400/80">Upgrade to see up to 90 days</p>
          </div>
        </div>
        <button className="flex items-center bg-violet-500 hover:bg-violet-600 text-white px-4 py-1.5 text-xs rounded-full transition-colors font-medium shadow-sm">
          <Zap className="w-3.5 h-3.5 mr-1.5 fill-white" /> Upgrade
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#161616] border border-zinc-800/80 rounded-xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-zinc-400 mb-2">{stat.label}</h4>
            <p className="text-xl font-semibold text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* AI Activity Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-4">AI activity</h2>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-80">
          {/* Table Header */}
          <div className="grid grid-cols-5 px-6 py-4 border-b border-zinc-800/40 text-[13px] font-medium text-zinc-400 bg-[#1a1a1a]/50 text-center">
            <div className="text-left">Run name</div>
            <div>Model</div>
            <div>Credits</div>
            <div>Time</div>
            <div className="text-right">Requests</div>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center bg-[#161616]">
            <List className="w-8 h-8 text-zinc-500 mb-4" strokeWidth={1.5} />
            <h3 className="text-base font-semibold text-white mb-1">No activity</h3>
            <p className="text-sm text-zinc-400">Nothing happened in this time range.</p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="max-w-[450px]">
        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-transparent hover:bg-zinc-900/50 transition-colors shadow-sm text-zinc-200 font-medium text-sm">
          Set a limit for your AI credits <ArrowUpRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
    </div>
  );
}
