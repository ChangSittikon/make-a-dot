import Link from 'next/link';
import { BottomTabBar } from '@/components/shared/BottomTabBar';

export default function WalletPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-gray-50 dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
        
        {/* Header Tabs (Overview, Futures, Spot, Funding) */}
        <header className="px-5 py-4 flex gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e2329] transition-colors duration-300">
          <span className="text-brand-red font-bold">ภาพรวม (Overview)</span>
          <span>Escrow</span>
          <span>สัดส่วน</span>
          <span>ประวัติ</span>
        </header>

        <main className="flex-1 overflow-y-auto pb-6">
          
          {/* Balance Section */}
          <div className="px-5 py-6 space-y-2 bg-white dark:bg-[#1e2329] mb-2 transition-colors duration-300">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
              <span className="flex items-center gap-1">ยอดเงินประเมินรวม <i className="fa-regular fa-eye"></i></span>
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="flex items-end gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">฿124,500.00</h1>
              <span className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">THB <i className="fa-solid fa-caret-down text-[10px]"></i></span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              รายได้เดือนนี้ <span className="text-emerald-500 font-medium">+฿12,000 (10.5%)</span> <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between px-6 py-5 bg-white dark:bg-[#1e2329] mb-2 transition-colors duration-300">
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition-colors text-brand-red">
                <i className="fa-solid fa-arrow-down"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">เติมเงิน</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition-colors text-brand-red">
                <i className="fa-solid fa-arrow-up"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">ถอนเงิน</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition-colors text-brand-red">
                <i className="fa-solid fa-money-bill-transfer"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">โอนเข้าโปรเจกต์</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition-colors text-brand-red">
                <i className="fa-solid fa-file-invoice-dollar"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">รายการย้อนหลัง</span>
            </div>
          </div>

          {/* Balance Breakdown List */}
          <div className="mt-2 px-4 space-y-3">
            <div className="bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">สินทรัพย์ของคุณ</h3>
                <i className="fa-solid fa-bars text-gray-400 dark:text-gray-500"></i>
              </div>
              
              <div className="space-y-4">
                {/* Available Balance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <i className="fa-solid fa-wallet text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">เงินสดถอนได้ (Available)</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">พร้อมใช้งาน</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">฿24,500.00</p>
                  </div>
                </div>

                {/* Escrow Balance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">ล็อกในระบบ (Escrow)</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">โปรเจกต์ที่กำลังรัน</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">฿100,000.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equity & Split Agreements Section (Make a Dot specific) */}
          <div className="mt-4 px-4 space-y-3">
            <div className="bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">การตกลงสัดส่วน (Equity Splits)</h3>
                <Link href="#" className="text-xs text-brand-red font-medium">ดูทั้งหมด</Link>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-[#2b3139] rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">โปรเจกต์: เพลงประกอบภาพยนตร์ (Demo)</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">บทบาท: ผู้แต่งเนื้อร้อง</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] rounded font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 p-2 bg-white dark:bg-[#1e2329] rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="text-center w-1/3 border-r border-gray-100 dark:border-gray-700">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">สัดส่วนของคุณ</p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">30%</p>
                    </div>
                    <div className="text-center w-1/3 border-r border-gray-100 dark:border-gray-700">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">มูลค่ารวม (Escrow)</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-0.5">฿100,000</p>
                    </div>
                    <div className="text-center w-1/3">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">คาดการณ์รายได้</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-0.5">฿30,000</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-[#2b3139] rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">โปรเจกต์: Music Video Yuzu (Demo)</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">บทบาท: ผู้ค้ำประกัน (Guarantor)</p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[9px] rounded font-bold">IN PROGRESS</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 p-2 bg-white dark:bg-[#1e2329] rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="text-center w-1/3 border-r border-gray-100 dark:border-gray-700">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">สัดส่วนค้ำประกัน</p>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">15%</p>
                    </div>
                    <div className="text-center w-1/3 border-r border-gray-100 dark:border-gray-700">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">วงเงินค้ำประกัน</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-0.5">฿7,500</p>
                    </div>
                    <div className="text-center w-1/3">
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">ผลตอบแทน</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-0.5">฿1,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </main>

        <BottomTabBar />
      </div>
    </div>
  );
}
