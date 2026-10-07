import { ShieldCheck, Plus, ChevronDown, Folder } from 'lucide-react';

export function StorageView() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Storage</h1>
          <p className="text-sm text-zinc-400">View and manage the files stored in your app.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm font-medium">
            <ShieldCheck className="w-4 h-4 mr-2" /> RLS policies
          </button>
          <button className="flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm font-medium">
            <Plus className="w-4 h-4 mr-2" /> New bucket
          </button>
        </div>
      </div>

      {/* Upload size limit box */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl mb-6 shadow-sm p-6 max-w-4xl">
        <h3 className="text-[15px] font-semibold text-white mb-1">Upload size limit</h3>
        <p className="text-[13px] text-zinc-400 mb-4">Largest file any bucket can accept. Default is 2 GB. Maximum is 5 GB.</p>
        
        <div className="flex items-center space-x-3">
          {/* Input field */}
          <div className="relative">
            <input 
              type="text" 
              defaultValue="2" 
              className="w-24 px-3 py-1.5 bg-[#1a1a1a] border border-zinc-700 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-zinc-500"
            />
          </div>
          
          {/* Dropdown field */}
          <button className="flex items-center justify-between w-20 px-3 py-1.5 bg-[#1a1a1a] border border-zinc-700 rounded-md text-sm text-zinc-200 hover:bg-zinc-800 transition-colors">
            GB <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
          
          {/* Save button */}
          <button className="px-4 py-1.5 bg-[#1a1a1a] border border-zinc-700 rounded-md text-sm text-zinc-300 font-medium hover:bg-zinc-800 transition-colors opacity-70 cursor-not-allowed">
            Save
          </button>
        </div>
      </div>

      {/* Bucket List */}
      <div className="max-w-[500px]">
        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-xl p-4 flex items-center cursor-pointer hover:bg-[#1f1f1f] transition-all shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/80 flex items-center justify-center mr-4 shrink-0">
            <Folder className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <div className="flex items-center mb-0.5">
              <h4 className="text-sm font-semibold text-zinc-200 mr-2">deal-images</h4>
              <span className="bg-[#3e2417] text-[#ff8c5a] border border-[#ff8c5a]/20 text-[10px] font-semibold px-1.5 py-0.5 rounded-sm tracking-wide">
                Public
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Updated Dec 14, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
