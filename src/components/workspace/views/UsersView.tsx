import { Settings, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export function UsersView() {
  const usersList = [
    { 
      email: 'saowaluk.te@gmail.com', 
      initial: 'S', 
      color: 'bg-purple-600',
      loginMethod: 'Email',
      lastSigned: 'Jun 30, 2026'
    },
    { 
      email: 'sittikon.th@gmail.com', 
      initial: 'S', 
      color: 'bg-blue-600',
      loginMethod: 'Email',
      lastSigned: 'Jan 14, 2026'
    }
  ];

  const chartDays = ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7'];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Users</h1>
          <p className="text-sm text-zinc-400">Manage users and view signups over time.</p>
        </div>
        <button className="flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm font-medium">
          <Settings className="w-4 h-4 mr-2 text-zinc-400" /> Auth settings
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl mb-8 overflow-hidden shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-white">Signups</h3>
          <button className="flex items-center bg-[#1a1a1a] border border-zinc-800 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
            Last 7 days <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
          </button>
        </div>
        
        {/* Mock Chart Area */}
        <div className="relative h-48 w-full">
          {/* Y-axis Labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] text-zinc-600 font-medium">
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>

          {/* Grid lines (horizontal) */}
          <div className="absolute left-6 right-0 top-0 bottom-6 flex flex-col justify-between">
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
          </div>

          {/* X-axis Labels */}
          <div className="absolute left-6 right-0 bottom-0 flex justify-between text-[11px] text-zinc-500 font-medium px-4">
            {chartDays.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <button className="bg-transparent border border-zinc-700 text-zinc-200 hover:bg-zinc-800 px-4 py-1.5 text-sm rounded-md transition-colors font-medium">
          Add user
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-1.5 bg-[#161616] border border-zinc-800/80 rounded-md text-sm text-zinc-300 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 w-64"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800/80 text-xs font-semibold text-zinc-400">
          <div className="col-span-6">Name</div>
          <div className="col-span-3">Login methods</div>
          <div className="col-span-3">Last signed in</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {usersList.map((user, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors items-center text-sm">
              <div className="col-span-6 flex items-center font-medium text-zinc-200">
                <div className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-white text-xs mr-3 shrink-0`}>
                  {user.initial}
                </div>
                {user.email}
              </div>
              <div className="col-span-3 flex items-center">
                <span className="bg-[#2a2a2a] text-zinc-300 border border-zinc-700/50 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {user.loginMethod}
                </span>
              </div>
              <div className="col-span-3 text-zinc-400">
                {user.lastSigned}
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-6 py-3 bg-[#1a1a1a] flex justify-between items-center text-[13px] text-zinc-400 border-t border-zinc-800/80">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              Rows per page <span className="text-zinc-200 font-medium ml-2 mr-1">10</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div>
              <span className="text-zinc-200 font-medium">1</span> - <span className="text-zinc-200 font-medium">2</span> of <span className="text-zinc-200 font-medium">2</span> items
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-zinc-200 font-medium mr-1">1</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-500 mr-1" /> of 1 page
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 text-zinc-600 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 text-zinc-600 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
