import { Play } from 'lucide-react';

export function SQLEditorView() {
  return (
    <div className="max-w-5xl mx-auto pb-12 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">SQL editor</h1>
          <p className="text-sm text-zinc-400">Run SQL queries and commands against your Cloud database.</p>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-[300px] mb-6">
        {/* Editor Area (Mockup) */}
        <div className="flex-1 flex bg-[#161616] pt-4 px-4 font-mono text-sm relative">
          <div className="w-8 text-right text-zinc-500 pr-4 select-none border-r border-zinc-800/80 h-full">
            1
          </div>
          <div className="flex-1 pl-4">
            <div className="bg-[#1e1e1e] text-zinc-400 px-2 py-0.5 rounded-sm w-full opacity-60">
              -- Write SQL here -- Tip: Press Ctrl + Enter to run
            </div>
          </div>
        </div>

        {/* Editor Toolbar */}
        <div className="bg-[#161616] border-t border-zinc-800/80 px-4 py-3 flex justify-between items-center">
          <button className="bg-transparent border border-zinc-700/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 px-3 py-1.5 text-xs rounded-md transition-colors">
            Format SQL
          </button>
          <div className="flex space-x-2">
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-4 py-1.5 text-xs rounded-md transition-colors font-medium">
              Clear
            </button>
            <button className="flex items-center bg-zinc-200 hover:bg-white text-zinc-900 px-4 py-1.5 text-xs rounded-md transition-colors font-semibold">
              <Play className="w-3.5 h-3.5 mr-1.5 fill-zinc-900" /> Run
            </button>
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl shadow-sm flex flex-col h-64 relative">
        {/* Results Header */}
        <div className="px-6 py-4">
          <h3 className="text-[15px] font-semibold text-white">Results</h3>
        </div>

        {/* Results Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-8">
          <Play className="w-8 h-8 text-zinc-500 mb-4" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-white mb-1">No results yet</h3>
          <p className="text-sm text-zinc-400">Run a query to get started.</p>
        </div>
      </div>
    </div>
  );
}
