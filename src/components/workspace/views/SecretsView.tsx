import { Plus, Key } from 'lucide-react';

export function SecretsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Secrets</h1>
          <p className="text-sm text-zinc-400">Securely save sensitive information like API keys.</p>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm font-medium">
          <Plus className="w-4 h-4 mr-1" /> Add secret
        </button>
      </div>

      {/* Table / Empty State Container */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col h-96">
        {/* Table Header */}
        <div className="grid grid-cols-2 px-6 py-4 border-b border-zinc-800/40 text-sm font-medium text-zinc-400 bg-[#1a1a1a]/50">
          <div>Name</div>
          <div className="text-right">Created</div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#161616]">
          <Key className="w-6 h-6 text-zinc-500 mb-4" />
          <h3 className="text-base font-semibold text-white mb-1">No secrets yet</h3>
          <p className="text-sm text-zinc-400">Add a secret to store API keys and other sensitive values.</p>
        </div>
      </div>
    </div>
  );
}
