import { Settings, ChevronDown, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLive } from '../useLive';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  trustScore: number | null;
};

export function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUsersCount, setActiveUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/workspace/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setActiveUsersCount(data.activeUsers || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { isConnected } = useLive('database', (event) => {
    if (event.data?.model === 'User' || event.data?.model === 'Account' || event.data?.model === 'Session') {
      fetchUsers();
    }
  });

  const chartDays = ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7'];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-white">Users</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {isConnected ? 'Live' : 'Polling'}
            </span>
          </div>
          <p className="text-sm text-zinc-400">Manage users and view signups over time.</p>
        </div>
        <button className="flex items-center bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm font-medium">
          <Settings className="w-4 h-4 mr-2 text-zinc-400" /> Auth settings
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-xl mb-8 overflow-hidden shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-white">Signups (Total: {activeUsersCount})</h3>
          <button className="flex items-center bg-[#1a1a1a] border border-zinc-800 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
            Last 7 days <ChevronDown className="w-4 h-4 ml-2 text-zinc-500" />
          </button>
        </div>
        
        {/* Mock Chart Area */}
        <div className="relative h-48 w-full">
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[11px] text-zinc-600 font-medium">
            <span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
          </div>
          <div className="absolute left-6 right-0 top-0 bottom-6 flex flex-col justify-between">
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
            <div className="border-t border-zinc-800/40 w-full h-0"></div>
          </div>
          <div className="absolute left-6 right-0 bottom-0 flex justify-between text-[11px] text-zinc-500 font-medium px-4">
            {chartDays.map(day => <span key={day}>{day}</span>)}
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
          <div className="col-span-5">Name / Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Trust Score</div>
          <div className="col-span-3">Joined Date</div>
        </div>

        {/* Table Rows */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col max-h-[500px] overflow-y-auto">
            {users.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No users found</div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors items-center text-sm">
                  <div className="col-span-5 flex items-center font-medium text-zinc-200 truncate pr-2">
                    {user.image ? (
                      <img src={user.image} alt="" className="w-6 h-6 rounded-full mr-3 shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-3 shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <span className="truncate">{user.name || user.email}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="bg-[#2a2a2a] text-zinc-300 border border-zinc-700/50 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-2 text-zinc-400">
                    {user.trustScore ?? '-'}
                  </div>
                  <div className="col-span-3 text-zinc-400 truncate">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Table Footer / Pagination */}
        <div className="px-6 py-3 bg-[#1a1a1a] flex justify-between items-center text-[13px] text-zinc-400 border-t border-zinc-800/80">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              Rows per page <span className="text-zinc-200 font-medium ml-2 mr-1">100</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div>
              <span className="text-zinc-200 font-medium">1</span> - <span className="text-zinc-200 font-medium">{users.length}</span> of <span className="text-zinc-200 font-medium">{users.length}</span> items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
