import { Clock, RefreshCw } from 'lucide-react';

export function JobsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Jobs</h1>
          <p className="text-sm text-zinc-400">View and manage scheduled jobs for this project.</p>
        </div>
        <button className="flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors font-medium">
          <RefreshCw className="w-3.5 h-3.5 mr-2" /> Refresh
        </button>
      </div>

      {/* Empty State Centered */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <Clock className="w-6 h-6 text-zinc-500 mb-4" />
        <h3 className="text-base font-semibold text-white mb-1">No scheduled jobs yet</h3>
        <p className="text-sm text-zinc-400">Jobs appear when your app schedules recurring work.</p>
      </div>
    </div>
  );
}
