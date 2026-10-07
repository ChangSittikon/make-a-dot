import { LayoutGrid, DatabaseZap, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLive } from '../useLive';

type TableStat = {
  name: string;
  rows: number;
  desc: string;
};

export function DatabaseView() {
  const [dbTables, setDbTables] = useState<TableStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/workspace/database');
      if (res.ok) {
        const data = await res.json();
        setDbTables(data.tables || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const { isConnected } = useLive('database', () => {
    fetchTables(); // Refetch on any database event
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-white">Database</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
          <p className="text-sm text-zinc-400">View and manage the structural data stored in your app.</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
             <DatabaseZap className="w-4 h-4 mr-2" /> Optimize
           </button>
           <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
             <ShieldCheck className="w-4 h-4 mr-2" /> RLS policies
           </button>
           <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
             <Download className="w-4 h-4 mr-2" /> Backups
           </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-xl p-5 mb-8 flex justify-between items-center shadow-sm">
         <div className="flex space-x-16">
           <div>
             <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Total Tables</p>
             <p className="text-2xl font-semibold text-zinc-100">{loading ? '-' : dbTables.length}</p>
           </div>
           <div>
             <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Database Engine</p>
             <p className="text-2xl font-semibold text-zinc-100">SQLite</p>
           </div>
         </div>
         <div className="text-xs text-zinc-500">Live data from dev.db</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
           {dbTables.map((table) => (
             <div key={table.name} className="flex items-center p-4 rounded-xl border border-zinc-800/60 bg-[#161616] hover:bg-[#1f1f1f] cursor-pointer transition-all hover:border-zinc-700 group shadow-sm">
               <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center mr-4 group-hover:bg-zinc-700/50 transition-colors shrink-0">
                 <LayoutGrid className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300" />
               </div>
               <div>
                 <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors mb-0.5">{table.name}</h4>
                 <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{table.rows} rows • {table.desc}</p>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
