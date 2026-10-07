import { Search, ChevronDown, RefreshCw, Download, Copy, ChevronRight } from 'lucide-react';

export function LogsView() {
  const mockLogs = [
    { time: '07 Oct 18:33:14', method: 'GET', status: '101', url: 'https://cnydsrebputqbfgdmmuw.supabase.co/realtime/v1/websocket?apikey=REDACTED&vsn=2.0.0 | Mozilla/5.0 (Windows NT 1...' },
    { time: '07 Oct 18:25:03', method: 'GET', status: '200', url: 'https://cnydsrebputqbfgdmmuw.supabase.co/storage/v1/bucket | lovable' },
    { time: '07 Oct 18:19:52', method: 'GET', status: '200', url: 'https://cnydsrebputqbfgdmmuw.supabase.co/storage/v1/bucket | lovable' },
    { time: '07 Oct 18:19:34', method: 'GET', status: '101', url: 'https://cnydsrebputqbfgdmmuw.supabase.co/realtime/v1/websocket?apikey=REDACTED&vsn=2.0.0 | Mozilla/5.0 (Windows NT 1...' },
    { time: '07 Oct 18:13:48', method: 'GET', status: '200', url: 'https://cnydsrebputqbfgdmmuw.supabase.co/storage/v1/bucket | lovable' },
    { time: '07 Oct 18:05:25', method: 'GET', status: '200', url: 'https://cnydsrebputqbfgdmmuw.supabase.co/storage/v1/bucket | lovable' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Logs</h1>
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

        <button className="flex items-center justify-center bg-transparent border border-zinc-700/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 w-8 h-8 rounded-md transition-colors shadow-sm">
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
        <div className="flex-1 overflow-y-auto bg-[#1a1a1a]/50 py-2">
          {mockLogs.map((log, idx) => (
            <div key={idx} className="flex items-center px-4 py-1.5 hover:bg-zinc-800/50 cursor-pointer transition-colors group">
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0 group-hover:text-zinc-300 transition-colors" />
              <div className="font-mono text-[11px] md:text-xs flex items-center w-full truncate">
                <span className="text-zinc-400 mr-3 shrink-0">{log.time}</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold mr-3 shrink-0">LOG</span>
                <span className="text-zinc-400 truncate">
                  {log.method} | {log.status} | {log.url}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/40 bg-[#161616]">
          <span className="text-sm text-zinc-500 font-medium">6 logs found</span>
          <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-4 py-1.5 text-xs rounded-md transition-colors font-medium">
            Show more
          </button>
        </div>

      </div>
    </div>
  );
}
