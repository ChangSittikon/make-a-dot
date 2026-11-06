'use client';
import { useState } from 'react';
import UniversalProfileCard from './UniversalProfileCard';

export default function AdminTierPreview({ user, stats }: { user: any; stats: any }) {
  const [previewRole, setPreviewRole] = useState(user.role);

  // For demo, if they choose a role, we override the user object passed down
  const overriddenUser = { ...user, role: previewRole };

  return (
    <div className="space-y-4 font-prompt">
      {/* Admin Switcher: คุมโทน Swiss Style ขาว-ดำ-แดง */}
      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <i className="fa-solid fa-sliders text-brand-red"></i> โหมดผู้ดูแลระบบ: พรีวิวการ์ดแต่ละระดับ
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { role: 'USER', label: 'Tier 1: Creator' },
            { role: 'PROFESSIONAL', label: 'Tier 2: Pro' },
            { role: 'GUARANTOR', label: 'Tier 3: Guarantor' },
            { role: 'DIRECTOR', label: 'Tier 4: Director' },
            { role: 'ADMIN', label: 'Tier 5: Admin' },
          ].map((item) => {
            const isActive = previewRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => setPreviewRole(item.role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render the Card with overridden user */}
      <UniversalProfileCard user={overriddenUser} stats={stats} />
    </div>
  );
}
