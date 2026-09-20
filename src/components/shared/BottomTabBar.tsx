'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-[#1e2329] border-t border-gray-100 dark:border-gray-800 px-6 py-2.5 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none pb-7 sm:pb-2.5 mt-auto transition-colors duration-300">
      {/* Home Tab */}
      <Link href="/" className={`flex flex-col items-center gap-1.5 w-[20%] transition-colors ${pathname === '/' ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
        <div className="relative">
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={pathname === '/' ? 1.5 : 1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
        <span className={`text-[10px] tracking-wide ${pathname === '/' ? 'font-medium' : 'font-normal'}`}>หน้าหลัก</span>
      </Link>

      {/* Wallet Tab */}
      <Link href="/wallet" className={`flex flex-col items-center gap-1.5 w-[20%] transition-colors ${pathname.startsWith('/wallet') ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={pathname.startsWith('/wallet') ? 1.5 : 1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H4.5A2.25 2.25 0 002.25 12v6.75A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V12zm-9-2.25h.008v.008H12V9.75z" />
        </svg>
        <span className={`text-[10px] tracking-wide ${pathname.startsWith('/wallet') ? 'font-medium' : 'font-normal'}`}>กระเป๋าเงิน</span>
      </Link>
      
      {/* Board (Bounty Hub) Tab */}
      <Link href="/profile/bounty" className={`flex flex-col items-center gap-1.5 w-[20%] transition-colors ${pathname.startsWith('/profile/bounty') ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={pathname.startsWith('/profile/bounty') ? 1.5 : 1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
        <span className={`text-[10px] tracking-wide ${pathname.startsWith('/profile/bounty') ? 'font-medium' : 'font-normal'}`}>บอร์ด</span>
      </Link>
      
      {/* Explore Tab */}
      <Link href="/explore" className={`flex flex-col items-center gap-1.5 w-[20%] transition-colors ${pathname === '/explore' ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={pathname === '/explore' ? 1.5 : 1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
        </svg>
        <span className={`text-[10px] tracking-wide ${pathname === '/explore' ? 'font-medium' : 'font-normal'}`}>สำรวจ</span>
      </Link>
      {/* Admin Tab */}
      <Link href="/admin" className={`flex flex-col items-center gap-1.5 w-[20%] transition-colors ${pathname.startsWith('/admin') ? 'text-brand-red' : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={pathname.startsWith('/admin') ? 1.5 : 1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className={`text-[10px] tracking-wide ${pathname.startsWith('/admin') ? 'font-medium' : 'font-normal'}`}>ตั้งค่า</span>
      </Link>
    </div>
  );
}
