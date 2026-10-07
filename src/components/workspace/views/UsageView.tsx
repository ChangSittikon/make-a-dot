import { ChevronDown, Info, ArrowDown } from 'lucide-react';

export function UsageView() {
  const chartDays = ['Sep 8', 'Sep 11', 'Sep 14', 'Sep 17', 'Sep 20', 'Sep 23', 'Sep 26', 'Sep 29', 'Oct 2', 'Oct 5'];
  
  const legends = [
    { label: 'Database', color: 'bg-blue-600' },
    { label: 'Network', color: 'bg-blue-500' },
    { label: 'Storage', color: 'bg-purple-500' },
    { label: 'Compute', color: 'bg-pink-500' },
    { label: 'Realtime', color: 'bg-orange-500' },
    { label: 'AI', color: 'bg-rose-500' },
    { label: 'Connectors', color: 'bg-orange-600' },
  ];

  const categories = [
    { name: 'Network', color: 'bg-blue-500', desc: 'Data sent or received, such as API responses, downloads, uploads, images, and media.', usage: '<0.0001' },
    { name: 'Storage', color: 'bg-purple-500', desc: 'Uploaded or generated files, such as images, documents, and videos.', usage: '<0.0001' },
    { name: 'AI', color: 'bg-rose-500', desc: 'AI model requests made by deployed apps.', usage: '0' },
    { name: 'Compute', color: 'bg-pink-500', desc: 'App code running behind the scenes, such as processing payments or sending emails.', usage: '0', hasInfo: true },
    { name: 'Connectors', color: 'bg-orange-600', desc: 'Requests made through connected services.', usage: '0' },
    { name: 'Database', color: 'bg-blue-600', desc: 'Stores and works with app data, such as users, orders, and messages.', usage: '0', 
      subitems: [
        { name: 'Database server', desc: 'Reads and saves app data.', usage: '0' },
        { name: 'Database storage', desc: 'App data stored in the database, such as users, orders, messages, and other records.', usage: '0' },
      ]
    },
    { name: 'Realtime', color: 'bg-orange-500', desc: 'Live updates, such as chat messages, notifications, or collaborative changes.', usage: '0' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Usage</h1>
        <p className="text-sm text-zinc-400">Run credit usage for this project.</p>
      </div>

      {/* Chart Box */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl mb-8 overflow-hidden shadow-sm flex flex-col shrink-0">
        {/* Box Header */}
        <div className="flex justify-between items-start p-6">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">&lt;0.0001 run credits</h2>
            <p className="text-sm text-zinc-400">in last 30 days</p>
          </div>
          <button className="flex items-center bg-[#1a1a1a] border border-zinc-800 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
            Last 30 days <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
          </button>
        </div>

        {/* Chart Area */}
        <div className="relative h-48 w-full px-6">
          {/* Y-axis Labels */}
          <div className="absolute left-6 top-0 bottom-6 flex flex-col justify-between text-[11px] text-zinc-600 font-medium">
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>

          {/* X-axis Labels */}
          <div className="absolute left-14 right-6 bottom-0 flex justify-between text-[11px] text-zinc-500 font-medium pb-2 border-b border-zinc-800/80">
            {chartDays.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          
          {/* Mock Chart lines */}
          <div className="absolute left-14 right-6 bottom-6 flex justify-between px-1">
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-blue-500/80 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-purple-500/50 rounded-full"></div>
             <div className="w-4 h-0.5 bg-transparent rounded-full"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
          {legends.map((legend) => (
            <div key={legend.label} className="flex items-center text-xs font-semibold text-zinc-200">
              <span className={`w-2 h-2 rounded-full ${legend.color} mr-2`}></span>
              {legend.label}
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-[#161616] flex items-center text-zinc-400 text-sm">
          <Info className="w-4 h-4 mr-2" /> Run credit usage may not appear immediately.
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="px-2">
        {/* Header */}
        <div className="flex justify-between items-center text-[13px] font-medium text-zinc-500 mb-2 pb-2 border-b border-zinc-800/80">
          <div>Category</div>
          <div className="flex items-center">Usage <ArrowDown className="w-3.5 h-3.5 ml-1" /></div>
        </div>

        {/* Items */}
        <div className="flex flex-col">
          {categories.map((cat, idx) => (
            <div key={idx}>
              {/* Main Category */}
              <div className="flex justify-between items-start py-4 border-b border-zinc-800/40">
                <div className="flex items-start">
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.color} mt-2 mr-3 shrink-0`}></span>
                  <div>
                    <div className="flex items-center text-sm font-semibold text-zinc-200 mb-1">
                      {cat.name} 
                      {cat.hasInfo && <Info className="w-3.5 h-3.5 ml-1.5 text-zinc-500" />}
                    </div>
                    <p className="text-xs text-zinc-500 pr-4">{cat.desc}</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-zinc-200 whitespace-nowrap mt-1">
                  {cat.usage}
                </div>
              </div>

              {/* Sub items */}
              {cat.subitems && cat.subitems.map((sub, sIdx) => (
                <div key={sIdx} className="flex justify-between items-start py-4 border-b border-zinc-800/40 pl-8">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200 mb-1">{sub.name}</h4>
                    <p className="text-xs text-zinc-500 pr-4">{sub.desc}</p>
                  </div>
                  <div className="text-sm font-semibold text-zinc-200 whitespace-nowrap mt-1">
                    {sub.usage}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
