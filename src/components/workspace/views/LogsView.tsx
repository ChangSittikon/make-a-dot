import { Search, ChevronDown, RefreshCw, Download, Copy, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLive } from '../useLive';

type AgentLog = {
  id: string;
  action: string;
  decisionType: string;
  createdAt: string;
};

export function LogsView() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/workspace/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const { isConnected } = useLive('database', (event) => {
    if (event.data?.model === 'AgentLog') {
      fetchLogs();
    }
  });

  return (
    <div className="max-w-7xl mx-auto pb-12 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold text-white">Logs</h1>
          <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {isConnected ? 'Live' : 'Polling'}
          </span>
        </div>
        <p className="text-sm text-zinc-400">Debug errors and track activity in your app.</p>
      </div>

      {/* Toolbar - Row 1 (Search & Filters) */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search events" 
            className="pl-9 pr-4 py-1.5 bg-transparent border border-zinc-700/80 rounded-md text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-64 transition-colors"
          />
        </div>
        
        <button className="flex items-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
          Edge logs <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
        </button>

        <button className="flex items-center bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
          Last hour <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
        </button>

        <button onClick={fetchLogs} className="flex items-center justify-center bg-transparent border border-zinc-700/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 w-8 h-8 rounded-md transition-colors shadow-sm">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Logs Container */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
        
        {/* Toolbar - Row 2 (Actions) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40">
          <div className="flex space-x-2">
            <button className="flex items-center bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1 text-xs rounded-md transition-colors font-medium">
              <Download className="w-3.5 h-3.5 mr-1.5 text-zinc-400" /> Download
            </button>
            <button className="flex items-center bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1 text-xs rounded-md transition-colors font-medium">
              <Copy className="w-3.5 h-3.5 mr-1.5 text-zinc-400" /> Copy
            </button>
          </div>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1 text-xs rounded-md transition-colors font-medium">
            Status
          </button>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-[#1a1a1a]/50">
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-[#1a1a1a]/50 py-2">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No logs found</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center px-4 py-1.5 hover:bg-zinc-800/50 cursor-pointer transition-colors group">
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0 group-hover:text-zinc-300 transition-colors" />
                  <div className="font-mono text-[11px] md:text-xs flex items-center w-full truncate">
                    <span className="text-zinc-400 mr-3 shrink-0">{new Date(log.createdAt).toLocaleString()}</span>
                    <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold mr-3 shrink-0">{log.decisionType}</span>
                    <span className="text-zinc-400 truncate">
                      {log.action} | {log.id}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/40 bg-[#161616]">
          <span className="text-sm text-zinc-500 font-medium">{logs.length} logs found</span>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-4 py-1.5 text-xs rounded-md transition-colors font-medium">
            Show more
          </button>
        </div>

      </div>
    </div>
  );
}
