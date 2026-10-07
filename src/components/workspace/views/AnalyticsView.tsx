import { LineChart, ChevronDown } from 'lucide-react';

export function AnalyticsView() {
  const stats = [
    { label: 'Visits', value: '0', active: true },
    { label: 'Page views', value: '0', active: false },
    { label: 'Views per visit', value: '0', active: false },
    { label: 'Visit duration', value: '0s', active: false },
    { label: 'Bounce rate', value: '0%', active: false },
  ];

  const detailCards = [
    { title: 'Source', metric: 'Visits' },
    { title: 'Page', metric: 'Visits' },
    { title: 'Device', metric: 'Visits' },
    { title: 'Country', metric: 'Visits' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <button className="flex items-center bg-[#1a1a1a] border border-zinc-800 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
          Last 7 days <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
        </button>
      </div>

      {/* Main Chart Area */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl mb-4 overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800/80">
          {stats.map((stat, idx) => (
            <div 
              key={stat.label} 
              className={`flex-1 p-4 cursor-pointer transition-colors ${stat.active ? 'bg-[#1e1e1e] border-b-2 border-transparent' : 'hover:bg-[#1a1a1a]'}`}
              style={stat.active ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' } : {}}
            >
              <p className="text-xs text-zinc-500 font-medium mb-1">{stat.label}</p>
              <p className="text-xl font-semibold text-zinc-100">{stat.value}</p>
            </div>
          ))}
        </div>
        
        {/* Empty State Chart */}
        <div className="h-96 flex flex-col items-center justify-center bg-[#161616]">
          <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
            <LineChart className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Publish your app to start tracking visits</h3>
          <p className="text-sm text-zinc-400 mb-6">Share your app with a live URL to see its traffic here.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            Publish
          </button>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 gap-4">
        {detailCards.map((card) => (
          <div key={card.title} className="bg-[#161616] border border-zinc-800/80 rounded-xl p-5 shadow-sm h-32 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-zinc-100">{card.title}</h4>
              <span className="text-xs text-zinc-500 font-medium">{card.metric}</span>
            </div>
            <p className="text-sm text-zinc-500">No data found for this time period.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
