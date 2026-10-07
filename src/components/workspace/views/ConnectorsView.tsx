import { BookOpen, GitFork } from 'lucide-react';

export function ConnectorsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Connectors</h1>
        </div>
        <div className="flex items-center space-x-3">
          <a 
            href="#" 
            className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-1.5" /> Docs
          </a>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 text-sm rounded-lg transition-colors font-medium">
            All connectors
          </button>
        </div>
      </div>

      {/* Project connections Section */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Project connections</h2>
        <p className="text-xs text-zinc-400 mb-6">The following services are connected to your project.</p>

        {/* Empty State Card */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl h-80 flex flex-col items-center justify-center shadow-sm">
          <div className="w-10 h-10 rounded-full bg-zinc-800/70 border border-zinc-700/50 flex items-center justify-center mb-4">
            <GitFork className="w-4 h-4 text-zinc-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">No connections yet</h3>
          <p className="text-xs text-zinc-400">Ask Lovable if you need help adding one.</p>
        </div>
      </div>
    </div>
  );
}
