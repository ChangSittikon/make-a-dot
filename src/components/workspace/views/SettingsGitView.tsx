import { useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, GitBranch, RefreshCw, CheckCircle2, Copy, Check } from 'lucide-react';

export function SettingsGitView() {
  const [viewMode, setViewMode] = useState<'overview' | 'connected'>('connected');
  const [cloneProtocol, setCloneProtocol] = useState<'HTTPS' | 'SSH' | 'GitHub CLI'>('HTTPS');
  const [copied, setCopied] = useState(false);

  const cloneCommands = {
    'HTTPS': 'https://github.com/ChangSittikon/sme-x-card-deals.git',
    'SSH': 'git@github.com:ChangSittikon/sme-x-card-deals.git',
    'GitHub CLI': 'gh repo clone ChangSittikon/sme-x-card-deals',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCommands[cloneProtocol]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'overview') {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Git</h1>
            <p className="text-xs text-zinc-400 mb-4">
              Host this project&apos;s code in your own GitHub, GitLab, or Bitbucket repository.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
              Lovable keeps your project and repository in sync, both ways: edits made in Lovable are committed to your repo, and commits you push are pulled back into your project. Back up your code, review changes in pull requests, work locally in your IDE, and deploy anywhere.
            </p>
          </div>
          <a href="#" className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
            <BookOpen className="w-4 h-4 mr-1.5" /> Docs
          </a>
        </div>

        {/* GitHub Card */}
        <div 
          onClick={() => setViewMode('connected')}
          className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 mb-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">GitHub</h3>
              <p className="text-xs text-zinc-400">Two-way sync with your GitHub account or organization</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>

        <p className="text-[11px] text-zinc-500">
          This project syncs with GitHub. A project can use one Git provider at a time — disconnect it to switch.
        </p>
      </div>
    );
  }

  // Connected state
  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setViewMode('overview')}
          className="flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1 text-zinc-500" /> Git
        </button>
        <a href="#" className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
          <BookOpen className="w-4 h-4 mr-1.5" /> Docs
        </a>
      </div>

      {/* Repository connection section */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Repository connection</h2>
        
        {/* Connection status card */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-800/60">
          {/* Top Row: Repo & Branch */}
          <div className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 block mb-2">Repository</span>
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700/80 overflow-hidden flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                  CS
                </div>
                <span className="text-xs font-semibold text-zinc-200">ChangSittikon/sme-x-card-deals</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <span className="text-xs text-zinc-500 block mb-2">Branch</span>
                <button className="flex items-center bg-[#1a1a1a] border border-zinc-700/80 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors">
                  <GitBranch className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                  main
                  <ChevronRight className="w-3 h-3 ml-2 text-zinc-500 rotate-90" />
                </button>
              </div>

              <div className="pt-5">
                <span className="inline-flex items-center text-xs font-medium text-zinc-300 bg-[#1a1a1a] border border-zinc-700/80 px-2.5 py-1.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                  Connected
                  <ChevronRight className="w-3 h-3 ml-1 text-zinc-500 rotate-90" />
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Sync status */}
          <div className="p-5 flex items-center justify-between bg-[#141414]">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white mb-0.5">In sync with GitHub</h4>
                <p className="text-xs text-zinc-400">Lovable and GitHub are on the same commit.</p>
                <p className="text-[11px] text-zinc-500 mt-1">Last synced 20 minutes ago • Checked 7 seconds ago</p>
              </div>
            </div>

            <button className="flex items-center text-xs text-zinc-300 hover:text-white border border-zinc-700/80 px-3 py-1.5 rounded-lg bg-zinc-900/60 transition-colors">
              <RefreshCw className="w-3 h-3 mr-1.5 text-zinc-400" /> Re-check
            </button>
          </div>
        </div>
      </div>

      {/* Check for saved work button */}
      <div>
        <button className="w-full py-2.5 rounded-xl border border-zinc-800/80 bg-[#161616] hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-medium transition-colors shadow-sm">
          Check for saved Lovable work
        </button>
      </div>

      {/* Clone repository Section */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2">Clone repository</h3>
        
        {/* Protocol tabs */}
        <div className="flex items-center space-x-1.5 mb-3 bg-[#161616] border border-zinc-800/80 p-1 rounded-xl w-fit">
          {(['HTTPS', 'SSH', 'GitHub CLI'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setCloneProtocol(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                cloneProtocol === tab
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Command Box */}
        <div className="bg-[#141414] border border-zinc-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between font-mono text-xs text-zinc-300">
          <span className="truncate mr-4 select-all">{cloneCommands[cloneProtocol]}</span>
          <button 
            onClick={handleCopy}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            title="Copy command"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
