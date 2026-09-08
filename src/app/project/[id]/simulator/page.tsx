'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type SimulationResult = {
  scenarioType: string;
  projectedRevenueSatang: number;
  escrowStatus: string;
  guarantorClaimed: boolean;
  impactSummary: string;
};

export default function ProjectSimulatorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);
  const [activeTab, setActiveTab] = useState('EXPECTED');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        if (data.simulations && data.simulations.length > 0) {
          setSimulations(data.simulations);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulations([]);
    try {
      // We will generate all 3 scenarios sequentially
      const scenarios = ['BEST_CASE', 'EXPECTED', 'WORST_CASE'];
      const results: SimulationResult[] = [];
      
      for (const scenario of scenarios) {
        const res = await fetch(`/api/projects/${projectId}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarioType: scenario })
        });
        if (res.ok) {
          const data = await res.json();
          results.push(data);
        }
        // Artificial delay for UI effect
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      setSimulations(results);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50"><div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div></div>;
  }

  if (!project) return <div>Project not found</div>;

  const getActiveSim = () => simulations.find(s => s.scenarioType === activeTab);
  const activeSim = getActiveSim();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <header className="px-5 py-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-md z-30">
          <Link href={`/project/${projectId}`} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="fa-solid fa-arrow-left text-gray-600"></i>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 truncate">Project Simulator</h1>
            <p className="text-xs text-gray-500 truncate">{project.title}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 scrollable-content bg-gray-50">
          
          <div className="p-5">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-5 shadow-lg relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-white font-bold mb-1">งบประมาณเริ่มต้น</h2>
              <p className="text-3xl font-black text-indigo-200">
                ฿{((project.budgetSatang || 0) / 100).toLocaleString('th-TH')}
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] text-white">
                  <i className="fa-solid fa-users mr-1"></i> {project.members?.length || 0} Members
                </span>
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] text-white">
                  <i className="fa-solid fa-shield mr-1"></i> Guarantor {project.guarantor ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {simulations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <i className="fa-solid fa-flask text-3xl text-gray-400"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">ยังไม่มีผลการจำลอง</h3>
                <p className="text-sm text-gray-500 mb-8">
                  กดปุ่มด้านล่างเพื่อรันระบบจำลอง Monte Carlo Scenario Analysis สำหรับโปรเจกต์นี้
                </p>
                <button 
                  onClick={handleSimulate}
                  disabled={simulating}
                  className="w-full bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                  {simulating ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> กำลังคำนวณ...</>
                  ) : (
                    <><i className="fa-solid fa-play"></i> เริ่มการจำลอง (Run Simulation)</>
                  )}
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                {/* Tabs */}
                <div className="flex bg-gray-200 p-1 rounded-xl mb-5">
                  <button onClick={() => setActiveTab('BEST_CASE')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'BEST_CASE' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>
                    ดีที่สุด (Best)
                  </button>
                  <button onClick={() => setActiveTab('EXPECTED')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'EXPECTED' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                    ตามคาด (Expected)
                  </button>
                  <button onClick={() => setActiveTab('WORST_CASE')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors ${activeTab === 'WORST_CASE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>
                    เลวร้ายสุด (Worst)
                  </button>
                </div>

                {activeSim && (
                  <div className={`p-5 rounded-3xl border-2 ${
                    activeTab === 'BEST_CASE' ? 'bg-green-50 border-green-200' :
                    activeTab === 'EXPECTED' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${
                          activeTab === 'BEST_CASE' ? 'text-green-600' : activeTab === 'EXPECTED' ? 'text-blue-600' : 'text-red-600'
                        }`}>รายได้ที่คาดหวัง</p>
                        <h3 className="text-2xl font-black text-gray-900">
                          ฿{(activeSim.projectedRevenueSatang / 100).toLocaleString('th-TH')}
                        </h3>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        activeTab === 'BEST_CASE' ? 'bg-green-100 text-green-600' : activeTab === 'EXPECTED' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <i className={`fa-solid ${activeTab === 'BEST_CASE' ? 'fa-arrow-trend-up' : activeTab === 'EXPECTED' ? 'fa-check' : 'fa-skull'}`}></i>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xs font-bold text-gray-600">สถานะ Escrow</span>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                          activeSim.escrowStatus === 'DISPUTED' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>{activeSim.escrowStatus}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                        <span className="text-xs font-bold text-gray-600">ค้ำประกัน (Guarantor)</span>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                          activeSim.guarantorClaimed ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                        }`}>{activeSim.guarantorClaimed ? 'ถูกยึดทรัพย์ชดเชย' : 'ปลอดภัย (ไม่ได้ใช้)'}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h4 className="text-xs font-bold text-gray-900 mb-2">สรุปผลกระทบ</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {activeSim.impactSummary}
                      </p>
                    </div>

                  </div>
                )}
                
                <div className="mt-8 text-center">
                  <button 
                    onClick={handleSimulate}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900 underline"
                  >
                    รันจำลองใหม่อีกครั้ง
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
