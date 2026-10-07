import { ChevronRight, LayoutGrid, Settings, Folder, Code2, ArrowUpRight } from 'lucide-react';

export function OverviewView() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Grid Cards Layout */}
      <div className="grid grid-cols-1 gap-4">
          {/* Emails */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] flex justify-between items-center cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
             <div>
                <h3 className="text-base font-semibold text-white mb-1">Emails</h3>
                <p className="text-sm text-zinc-400">Send branded emails from your domain</p>
             </div>
             <ChevronRight className="w-5 h-5 text-zinc-500" />
          </div>

          {/* Database */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] cursor-pointer hover:bg-[#1f1f1f] transition-all relative overflow-hidden shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-base font-semibold text-white mb-1">Database</h3>
                   <p className="text-sm text-zinc-400">View tables and edit data</p>
                </div>
                <div className="flex items-center text-sm text-zinc-400">
                   17 tables <ChevronRight className="w-4 h-4 ml-1" />
                </div>
             </div>
             <div className="space-y-1">
                {['agent_applications', 'agent_earnings', 'agent_team_members', 'agents'].map(tbl => (
                   <div key={tbl} className="flex justify-between items-center py-2 px-3 rounded-md bg-[#1a1a1a] hover:bg-zinc-800/50 mb-1">
                      <div className="flex items-center text-sm text-zinc-300 font-medium">
                         <LayoutGrid className="w-4 h-4 mr-3 text-zinc-500" /> {tbl}
                      </div>
                      <span className="text-xs text-zinc-500">0 rows</span>
                   </div>
                ))}
             </div>
             {/* Gradient overlay and View all button */}
             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#161616] to-transparent flex items-end justify-center pb-4">
                <button className="bg-[#2a2a2a] hover:bg-[#333333] text-zinc-200 text-xs px-4 py-1.5 rounded-full border border-zinc-700/50 transition-colors shadow-md font-medium z-10">
                   View all
                </button>
             </div>
          </div>

          {/* Users */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-base font-semibold text-white mb-1">Users</h3>
                   <p className="text-sm text-zinc-400">View user data and configure how users sign up</p>
                </div>
                <div className="flex items-center text-sm text-zinc-400">
                   2 Signups <ChevronRight className="w-4 h-4 ml-1" />
                </div>
             </div>
             <div className="bg-[#1a1a1a] rounded-lg p-3 flex items-center text-sm text-zinc-300 font-medium border border-zinc-800/50 hover:bg-zinc-800/50">
                <Settings className="w-4 h-4 mr-3 text-zinc-500" /> Auth settings
             </div>
          </div>

          {/* Storage */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-base font-semibold text-white mb-1">Storage</h3>
                   <p className="text-sm text-zinc-400">View and manage files, images, and documents</p>
                </div>
                <div className="flex items-center text-sm text-zinc-400">
                   1 Bucket <ChevronRight className="w-4 h-4 ml-1" />
                </div>
             </div>
             <div className="bg-[#1a1a1a] rounded-lg p-3 flex items-center text-sm text-zinc-300 font-medium border border-zinc-800/50 hover:bg-zinc-800/50">
                <Folder className="w-4 h-4 mr-3 text-zinc-500" /> deal-images
             </div>
          </div>

          {/* Secrets */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] flex justify-between items-center cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
             <div>
                <h3 className="text-base font-semibold text-white mb-1">Secrets</h3>
                <p className="text-sm text-zinc-400">Store and manage environment variables securely</p>
             </div>
             <ChevronRight className="w-5 h-5 text-zinc-500" />
          </div>

          {/* Edge functions */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-base font-semibold text-white mb-1">Edge functions</h3>
                   <p className="text-sm text-zinc-400">Configure functions executed in your app</p>
                </div>
                <div className="flex items-center text-sm text-zinc-400">
                   1 Function
                </div>
             </div>
             <div className="bg-[#1a1a1a] rounded-lg p-3 flex items-center text-sm text-zinc-300 font-medium border border-zinc-800/50 hover:bg-zinc-800/50">
                <Code2 className="w-4 h-4 mr-3 text-zinc-500" /> import-thailand-locations
             </div>
          </div>

          {/* Logs */}
          <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#161616] flex justify-between items-center cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
             <div>
                <h3 className="text-base font-semibold text-white mb-1">Logs</h3>
                <p className="text-sm text-zinc-400">Monitor application logs to debug issues</p>
             </div>
             <ChevronRight className="w-5 h-5 text-zinc-500" />
          </div>

          {/* Bottom Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-2">
             <button className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-transparent hover:bg-zinc-900/50 transition-colors shadow-sm text-zinc-200 font-medium text-sm">
                Advanced settings <ChevronRight className="w-4 h-4 text-zinc-500" />
             </button>
             <button className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-transparent hover:bg-zinc-900/50 transition-colors shadow-sm text-zinc-200 font-medium text-sm">
                Cloud & AI usage <ArrowUpRight className="w-4 h-4 text-zinc-500" />
             </button>
          </div>
      </div>
    </div>
  );
}
