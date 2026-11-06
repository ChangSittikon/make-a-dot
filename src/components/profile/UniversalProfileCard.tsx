'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditModal from './ProfileEditModal';

export default function UniversalProfileCard({ user, stats }: { user: any; stats: any }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const EditButton = () => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditModalOpen(true);
      }}
      className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200"
      aria-label="แก้ไขโปรไฟล์"
    >
      <i className="fa-solid fa-pen text-[10px]"></i>
    </button>
  );

  const renderTier1User = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 relative overflow-hidden group">
      <EditButton />

      <div className="flex items-center gap-4 relative z-10">
        <img
          src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=f3f4f6&color=111827`}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-xs"
        />
        <div>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block border border-gray-200">
            Tier 1: Idea Creator
          </span>
          <h2 className="text-2xl font-black text-gray-900 leading-none">{user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
        <Link
          href="/profile/projects/manage"
          className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">โปรเจกต์ของฉัน</p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {stats.ownedProjects} <span className="text-sm font-medium text-gray-400">งาน</span>
          </p>
        </Link>
        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-center text-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-arrow-up text-brand-red mb-1"></i>
          <p className="text-xs font-bold text-gray-700">อัปเกรดเป็น<br />ผู้เชี่ยวชาญ</p>
        </div>
      </div>
    </div>
  );

  const renderTier2Professional = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 relative overflow-hidden group">
      <EditButton />

      <div className="flex items-center gap-4 relative z-10">
        <img
          src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=f3f4f6&color=111827`}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-2 border-gray-200 shadow-xs"
        />
        <div>
          <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
            Tier 2: Professional
          </span>
          <h2 className="text-2xl font-black text-gray-900 leading-none">{user.name}</h2>
          <p className="text-sm text-gray-700 font-medium mt-1 flex items-center gap-1.5">
            <i className="fa-solid fa-briefcase text-brand-red"></i>
            <span>พร้อมร่วมงาน</span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
        <Link
          href="/profile/projects/manage"
          className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">โปรเจกต์ที่เข้าร่วม</p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {stats.joinedProjects} <span className="text-sm font-medium text-gray-400">งาน</span>
          </p>
        </Link>
        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-center text-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-shield-halved text-gray-800 mb-1"></i>
          <p className="text-xs font-bold text-gray-700">ยืนยันตัวตนเพื่อ<br />เป็นผู้ค้ำประกัน</p>
        </div>
      </div>
    </div>
  );

  const renderTier3Guarantor = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200 relative overflow-hidden group hover:border-gray-900 transition-colors">
      <EditButton />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-4">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=f3f4f6&color=111827`}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-gray-200"
          />
          <div>
            <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-800 font-bold mt-0.5 flex items-center gap-1.5">
              <i className="fa-solid fa-certificate text-brand-red"></i> Tier 3: Guarantor
            </p>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-brand-red"></i>
              <span>ยืนยันตัวตนระดับนิติบุคคล</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Trust Score</p>
          <p className="text-3xl font-black text-gray-900 font-mono">
            {user.trustScore > 0 ? user.trustScore : 850}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">วงเงินค้ำประกันสะสม</p>
          <p className="text-2xl font-black text-gray-900 mt-1 font-mono">
            ฿{((stats.totalGuaranteedSatang || 0) / 100).toLocaleString('th-TH')}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-center text-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-crown text-gray-800 mb-1"></i>
          <p className="text-xs font-bold text-gray-600">อัปเกรดเป็น<br />Director</p>
        </div>
      </div>
    </div>
  );

  const renderTier4Director = () => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xs border border-gray-200 relative group">
      <EditButton />
      {/* Hero Banner: คลีน Swiss Style สีเทา/ดำ */}
      <div className="h-20 bg-gray-900 w-full relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="px-6 pb-6 relative z-10 -mt-10">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            <img
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=f3f4f6&color=111827`}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xs bg-white"
            />
            <div className="absolute bottom-0 right-0 bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              <i className="fa-solid fa-check text-[9px]"></i>
            </div>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-900 border border-gray-300 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
            <i className="fa-solid fa-crown text-brand-red"></i> Tier 4: Domain Director
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600 font-medium mt-1">
            {user.directorProfile?.title || 'ศูนย์กลางและผู้นำระดับประเทศ'}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">ตราประทับที่อนุมัติ</p>
            <p className="text-2xl font-black text-gray-900 mt-1 font-mono">
              {stats.endorsementsCount || 0} <span className="text-sm font-medium text-gray-400">โปรเจกต์</span>
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-center text-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-rotate-left text-gray-500 mb-1"></i>
            <p className="text-xs font-bold text-gray-600">กลับเป็น<br />User ปกติ</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTier5Admin = () => (
    <div className="bg-white rounded-3xl p-6 shadow-xs relative overflow-hidden border border-gray-200 group hover:border-gray-900 transition-colors">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-brand-red text-[10px] font-bold tracking-wide border border-red-200">
            <i className="fa-solid fa-shield-halved"></i>
            TIER 5 • SYSTEM ADMIN
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full flex items-center justify-center transition-colors border border-gray-200"
            >
              <i className="fa-solid fa-pen text-xs"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || 'Admin'} className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-user-shield text-2xl text-gray-800"></i>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name || 'ผู้ดูแลระบบ'}</h2>
            <p className="text-sm text-gray-500 mt-1">Full System Access</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center items-center text-center border border-gray-200 group-hover:border-gray-900 transition-colors">
            <i className="fa-solid fa-sliders text-brand-red mb-2 text-lg"></i>
            <p className="text-sm font-bold text-gray-900">เข้าสู่แผงควบคุมผู้ดูแลระบบ</p>
            <p className="text-xs text-gray-500 mt-1">แตะการ์ดนี้เพื่อตั้งค่า Flow & ระบบ</p>
          </div>
        </div>
      </div>
    </div>
  );

  const cardContent = (
    <div className={`transition-opacity duration-300 ${isUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      {user.role === 'ADMIN' && renderTier5Admin()}
      {user.role === 'DIRECTOR' && renderTier4Director()}
      {user.role === 'GUARANTOR' && renderTier3Guarantor()}
      {user.role === 'PROFESSIONAL' && renderTier2Professional()}
      {user.role === 'USER' && renderTier1User()}
    </div>
  );

  return (
    <>
      {(user.role === 'DIRECTOR' || user.role === 'ADMIN') ? (
        <Link href="/profile/settings" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
          {cardContent}
        </Link>
      ) : (
        <div className="block">
          {cardContent}
        </div>
      )}

      {isEditModalOpen && (
        <ProfileEditModal user={user} onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
}
