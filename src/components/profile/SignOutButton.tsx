'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="mt-6 w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
    >
      <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
      ออกจากระบบ
    </button>
  );
}
