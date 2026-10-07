import { ChevronLeft, ChevronRight, BookOpen, GitBranch, CheckCircle2, RefreshCw, Copy, Check, Info, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

type GitStatus = {
  branch?: string;
  changes?: { status: string; file: string }[];
  commits?: { hash: string; message: string; time: string; author: string }[];
  remotes?: string[];
  error?: string;
};

export function SettingsGitView() {
  const [viewMode, setViewMode] = useState<'overview' | 'connected'>('overview');
  const [cloneProtocol, setCloneProtocol] = useState<'HTTPS' | 'SSH' | 'GitHub CLI'>('HTTPS');
  const [copied, setCopied] = useState(false);
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGitStatus = async () => {
    if (!gitStatus) setLoading(true);
    try {
      const res = await fetch('/api/workspace/git');
      const data = await res.json();
      setGitStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitStatus();
    
    // Poll every 5 seconds for git updates
    const intervalId = setInterval(() => {
      fetchGitStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCopy = () => {
    const cloneCommands = {
      'HTTPS': gitStatus?.remotes?.[0] ? `git clone ${gitStatus.remotes[0]}` : 'git clone https://...',
      'SSH': 'git clone git@github.com:...',
      'GitHub CLI': 'gh repo clone ...'
    };
    navigator.clipboard.writeText(cloneCommands[cloneProtocol]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'overview') {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Git</h1>
            <p className="text-xs text-zinc-400 mb-4">
              Host this project's code in your own repository.
            </p>
          </div>
        </div>

        <div 
          onClick={() => setViewMode('connected')}
          className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 mb-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Local Git Repository</h3>
              <p className="text-xs text-zinc-400">View current local git status and history</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setViewMode('overview')}
          className="flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1 text-zinc-500" /> Git
        </button>
      </div>

      <div>
        <h2 className="text-base font-semibold text-white mb-3">Repository connection</h2>
        
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-800/60">
          <div className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 block mb-2">Remote</span>
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-semibold text-zinc-200">
                  {gitStatus?.remotes?.[0] || 'No remote found'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <span className="text-xs text-zinc-500 block mb-2">Branch</span>
                <button className="flex items-center bg-[#1a1a1a] border border-zinc-700/80 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors">
                  <GitBranch className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                  {gitStatus?.branch || 'unknown'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 flex items-center justify-between bg-[#141414]">
            <div className="flex items-start space-x-3">
              {gitStatus?.changes?.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-semibold text-white mb-0.5">
                  {gitStatus?.changes?.length === 0 ? 'Working tree clean' : `${gitStatus?.changes?.length || 0} uncommitted changes`}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1">Live from local file system</p>
              </div>
            </div>

            <button onClick={fetchGitStatus} className="flex items-center text-xs text-zinc-300 hover:text-white border border-zinc-700/80 px-3 py-1.5 rounded-lg bg-zinc-900/60 transition-colors">
              {loading ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1.5 text-zinc-400" />} Re-check
            </button>
          </div>
        </div>
      </div>

      {gitStatus?.commits && gitStatus.commits.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white mb-2">Recent Commits</h3>
          <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
            {gitStatus.commits.map((commit, idx) => (
              <div key={commit.hash} className={`px-4 py-3 flex items-center justify-between ${idx !== gitStatus.commits!.length - 1 ? 'border-b border-zinc-800/40' : ''}`}>
                <div>
                  <div className="text-sm text-zinc-200 font-medium">{commit.message}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{commit.author} • {commit.time}</div>
                </div>
                <div className="font-mono text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">
                  {commit.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
