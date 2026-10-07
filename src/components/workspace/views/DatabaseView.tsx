import { LayoutGrid, DatabaseZap, ShieldCheck, Download } from 'lucide-react';

export function DatabaseView() {
  const dbTables = [
    { name: 'taxonomy', rows: 12, desc: '12 สายงานและอุตสาหกรรม' },
    { name: 'bounty_quests', rows: 5, desc: 'โจทย์ปัญหาที่รอการแก้' },
    { name: 'negotiations', rows: 8, desc: 'ประวัติการเจรจา' },
    { name: 'agents', rows: 15, desc: 'ข้อมูล AI Agents' },
    { name: 'deals', rows: 32, desc: 'ดีลและข้อเสนอ' },
    { name: 'profiles', rows: 12, desc: 'โปรไฟล์ผู้ใช้งาน' },
    { name: 'user_wallets', rows: 12, desc: 'กระเป๋าเงินเหรียญในระบบ' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Database</h1>
          <p className="text-sm text-zinc-400">View and manage the structural data stored in your app.</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
             <DatabaseZap className="w-4 h-4 mr-2" /> Optimize
           </button>
           <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
             <ShieldCheck className="w-4 h-4 mr-2" /> RLS policies
           </button>
           <button className="flex items-center bg-zinc-900/50 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 text-sm rounded-md transition-colors shadow-sm">
             <Download className="w-4 h-4 mr-2" /> Backups
           </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-xl p-5 mb-8 flex justify-between items-center shadow-sm">
         <div className="flex space-x-16">
           <div>
             <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Number of requests</p>
             <p className="text-2xl font-semibold text-zinc-100">45</p>
           </div>
           <div>
             <p className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Database hours</p>
             <p className="text-2xl font-semibold text-zinc-100">0 h</p>
           </div>
         </div>
         <div className="text-xs text-zinc-500">Data is shown for the last 7 days</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         {dbTables.map((table) => (
           <div key={table.name} className="flex items-center p-4 rounded-xl border border-zinc-800/60 bg-[#161616] hover:bg-[#1f1f1f] cursor-pointer transition-all hover:border-zinc-700 group shadow-sm">
             <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center mr-4 group-hover:bg-zinc-700/50 transition-colors shrink-0">
               <LayoutGrid className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300" />
             </div>
             <div>
               <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors mb-0.5">{table.name}</h4>
               <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{table.rows} rows — {table.desc}</p>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}
