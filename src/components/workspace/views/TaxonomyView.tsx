import { Network, DatabaseZap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLive } from '../useLive';

type TaxonomyStats = {
  industries: number;
  nodes: number;
  options: number;
  occupations: number;
  workTypes: number;
  skillTags: number;
};

type Industry = {
  id: string;
  name: string;
  order: number;
};

export function TaxonomyView() {
  const [stats, setStats] = useState<TaxonomyStats | null>(null);
  const [recent, setRecent] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaxonomy = async () => {
    try {
      const res = await fetch('/api/workspace/taxonomy');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecent(data.recentIndustries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const { isConnected } = useLive('database', (event) => {
    const models = ['Industry', 'Node', 'Option', 'Occupation', 'WorkType', 'SkillTag'];
    if (models.includes(event.data?.model)) {
      fetchTaxonomy();
    }
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-white">Taxonomy Manager</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Manage 12 industry sectors, tags, and AI classification rules.</p>
        </div>
        <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
          <DatabaseZap className="w-4 h-4 mr-2" /> Sync with Prisma Seed
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Industries" value={stats?.industries || 0} />
            <StatCard label="Nodes (Options)" value={(stats?.nodes || 0) + (stats?.options || 0)} />
            <StatCard label="Occupations" value={stats?.occupations || 0} />
            <StatCard label="Work Types" value={stats?.workTypes || 0} />
            <StatCard label="Skill Tags" value={stats?.skillTags || 0} />
          </div>

          <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-800/80 bg-[#1a1a1a]">
              <h3 className="text-sm font-semibold text-white">Top Industries</h3>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {recent.map((ind) => (
                <div key={ind.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                      <Network className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200">{ind.name}</h4>
                      <p className="text-xs text-zinc-500">Order: {ind.order}</p>
                    </div>
                  </div>
                  <button className="text-xs text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700 px-3 py-1.5 rounded-md transition-colors">
                    Manage Nodes
                  </button>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-sm">No industries found</div>
              )}
            </div>
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
