import { BookOpen, ChevronDown } from 'lucide-react';

export function AgentIntegrationsView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Agent integrations</h1>
          <p className="text-sm text-zinc-400">Let AI assistants use your Lovable app</p>
        </div>
        <a 
          href="#" 
          className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <BookOpen className="w-4 h-4 mr-1.5" /> Docs
        </a>
      </div>

      {/* Overview Section */}
      <div className="mb-10">
        <h2 className="text-base font-semibold text-white mb-4">Overview</h2>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 space-y-6">
          {/* Row 1 */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800/60">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Use this app in Lovable chats</h3>
              <p className="text-xs text-zinc-400">Publish this app to make it available in Lovable chats.</p>
            </div>
            <button 
              disabled 
              className="bg-[#222222] text-zinc-500 border border-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-not-allowed"
            >
              Add to Lovable
            </button>
          </div>

          {/* Row 2 */}
          <div className="pb-6 border-b border-zinc-800/60">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Access is protected</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Sign-in enabled
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Your MCP requires sign-in, so only people signed in to your app can connect and view its data
            </p>
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Publish your app to make it work with AI assistants</h3>
              <p className="text-xs text-zinc-400">Once published, ChatGPT, Claude, and other AI assistants can connect to your app</p>
            </div>
            <button className="bg-white hover:bg-zinc-200 text-zinc-950 font-medium px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm">
              Publish app
            </button>
          </div>
        </div>
      </div>

      {/* Your MCP Section */}
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Your MCP</h2>
        <p className="text-xs text-zinc-400 mb-4">Find all information that you need on your MCP</p>

        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700/80 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white mb-0.5">MCP tools</h3>
              <p className="text-xs text-zinc-400">3 tools with unpublished changes</p>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
