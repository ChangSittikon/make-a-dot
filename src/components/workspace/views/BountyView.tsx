import { Target, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLive } from '../useLive';

type BountyStats = {
  quests: number;
  negotiations: number;
  disputes: number;
};

type Quest = {
  id: string;
  rawDescription: string;
  status: string;
};

export function BountyView() {
  const [stats, setStats] = useState<BountyStats | null>(null);
  const [recent, setRecent] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/workspace/bounties');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecent(data.recentQuests || []);
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
    const models = ['ProblemNode', 'BountyNegotiation', 'MatchMakingLog', 'UpgradeProposal', 'Dispute'];
    if (models.includes(event.data?.model)) {
      fetchStats();
    }
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-white">Bounty Command Center</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Monitor active quests, solver negotiations, and bounty payouts.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Quests" value={stats?.quests || 0} />
            <StatCard label="Active Negotiations" value={stats?.negotiations || 0} />
            <StatCard 
              label="Disputes" 
              value={stats?.disputes || 0} 
              alert={stats?.disputes ? stats.disputes > 0 : false} 
            />
          </div>

          <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-800/80 bg-[#1a1a1a]">
              <h3 className="text-sm font-semibold text-white">Recent Quests</h3>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {recent.map((quest) => (
                <div key={quest.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                      <Target className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 truncate w-64">{quest.rawDescription}</h4>
                      <p className="text-xs text-zinc-500">ID: {quest.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 bg-zinc-800 border border-zinc-700/50 rounded-md text-zinc-300">
                    {quest.status}
                  </span>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">No quests found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, alert = false }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className={`bg-[#161616] border ${alert ? 'border-red-900/50' : 'border-zinc-800/80'} p-5 rounded-xl relative overflow-hidden`}>
      {alert && <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />}
      <div className="flex justify-between items-start">
        <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
        {alert && <AlertCircle className="w-4 h-4 text-red-500" />}
      </div>
      <p className={`text-2xl font-semibold ${alert ? 'text-red-400' : 'text-zinc-100'}`}>{value}</p>
    </div>
  );
}
