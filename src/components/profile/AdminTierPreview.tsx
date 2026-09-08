'use client';
import { useState } from 'react';
import UniversalProfileCard from './UniversalProfileCard';

export default function AdminTierPreview({ user, stats }: { user: any, stats: any }) {
  const [previewRole, setPreviewRole] = useState(user.role);

  // For demo, if they choose a role, we override the user object passed down
  const overriddenUser = { ...user, role: previewRole };

  return (
    <div className="space-y-6">
      {/* Admin Switcher */}
      <div className="bg-gray-100 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <i className="fa-solid fa-screwdriver-wrench"></i> โหมดผู้ดูแลระบบ: พรีวิวการ์ด
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollable-content">
          <button 
            onClick={() => setPreviewRole('USER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${previewRole === 'USER' ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-white dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'}`}
          >
            Tier 1
          </button>
          <button 
            onClick={() => setPreviewRole('PROFESSIONAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${previewRole === 'PROFESSIONAL' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'}`}
          >
            Tier 2
          </button>
          <button 
            onClick={() => setPreviewRole('GUARANTOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${previewRole === 'GUARANTOR' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'}`}
          >
            Tier 3
          </button>
          <button 
            onClick={() => setPreviewRole('DIRECTOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${previewRole === 'DIRECTOR' ? 'bg-yellow-600 text-white' : 'bg-white dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'}`}
          >
            Tier 4
          </button>
          <button 
            onClick={() => setPreviewRole('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${previewRole === 'ADMIN' ? 'bg-[#FF1A1A] text-white' : 'bg-white dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'}`}
          >
            Tier 5
          </button>
        </div>
      </div>

      {/* Render the Card with overridden user */}
      <UniversalProfileCard user={overriddenUser} stats={stats} />
    </div>
  );
}
