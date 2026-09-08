'use client';

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton({ session }: { session: any }) {
  if (session?.user) {
    // Get tier number based on role
    const getTier = (role: string) => {
      switch (role) {
        case 'ADMIN': return 'Tier 5';
        case 'DIRECTOR': return 'Tier 4';
        case 'GUARANTOR': return 'Tier 3';
        case 'PROFESSIONAL': return 'Tier 2';
        default: return 'Tier 1';
      }
    };
    
    const role = session.user.role || 'USER';
    const tier = getTier(role);

    return (
      <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-gray-50 pr-1 pl-3 py-1 rounded-full border border-gray-100">
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-gray-900 leading-none">{session.user.name?.split(' ')[0]}</span>
          <span className="text-[8px] font-bold text-brand-red leading-none mt-0.5">{tier}</span>
        </div>
        {session.user.image ? (
          <img src={session.user.image} alt="Avatar" className="w-7 h-7 rounded-full border border-gray-200 shadow-sm" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="fa-solid fa-user text-xs text-gray-500"></i>
          </div>
        )}
      </Link>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl shadow-sm transition-all"
    >
      <i className="fa-brands fa-google text-[#4285F4]"></i>
      Sign in with Google
    </button>
  );
}
