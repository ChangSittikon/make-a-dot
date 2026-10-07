import { FileSpreadsheet, Loader2, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLive } from '../useLive';

type CapTableStats = {
  splits: number;
  members: number;
  projects: number;
  simulations: number;
};

export function CapTableView() {
  const [stats, setStats] = useState<CapTableStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/workspace/cap-table');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const { isConnected } = useLive('database', (event) => {
    const models = ['RevShareSplit', 'RevShareSplitMember', 'RevShareAndSplit', 'ProjectSimulation'];
    if (models.includes(event.data?.model)) {
      fetchStats();
    }
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-white">Cap Table Engine</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Configure equity split rules and simulation variables.</p>
        </div>
        <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
          <Settings className="w-4 h-4 mr-2" /> Global Rules
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Total Revenue Splits" value={stats?.splits || 0} />
            <StatCard label="Total Stakeholders" value={stats?.members || 0} />
            <StatCard label="Active Projects" value={stats?.projects || 0} />
            <StatCard label="Simulations Run" value={stats?.simulations || 0} />
          </div>

          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20">
             <FileSpreadsheet className="w-10 h-10 text-zinc-600 mb-3" />
             <p className="text-zinc-400 text-sm">Select a project or split template to configure logic.</p>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#161616] border border-zinc-800/80 p-5 rounded-xl">
      <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
