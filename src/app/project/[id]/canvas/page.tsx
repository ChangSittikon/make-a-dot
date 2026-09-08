'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DonutChart from '@/components/shared/DonutChart';

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [splitType, setSplitType] = useState('REVENUE_SHARE');
  const [breakevenEnabled, setBreakevenEnabled] = useState(false);
  const [breakevenAmount, setBreakevenAmount] = useState('0'); // In Baht for UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modal State
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({ label: '', category: 'LABOR', value: '1000', icon: 'fa-solid fa-star' });

  const handleAddResource = async () => {
    if (!newResource.label.trim()) {
      alert('กรุณาระบุชื่อทรัพยากร (เช่น ห้องตัด, แรงงาน, กล้อง)');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}/canvas/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contributorId: project.ownerId, // Just default to owner for demo
          label: newResource.label.trim(),
          category: newResource.category,
          icon: newResource.icon,
          equivalentValueSatang: parseInt(newResource.value) * 100
        })
      });
      if (res.ok) {
        setShowResourceModal(false);
        setNewResource({ label: '', category: 'LABOR', value: '1000', icon: 'fa-solid fa-star' });
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCanvas = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}/canvas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: canvas.status,
          splitType,
          hasBreakeven: breakevenEnabled,
          breakevenAmountSatang: parseInt(breakevenAmount) * 100
        })
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectRes, canvasRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/projects/${id}/canvas`)
        ]);

        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
        }

        if (canvasRes.ok) {
          const canvasData = await canvasRes.json();
          setCanvas(canvasData);
          setSplitType(canvasData.splitType);
          setBreakevenEnabled(canvasData.hasBreakeven);
          setBreakevenAmount((canvasData.breakevenAmountSatang / 100).toString());
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const updateCanvasStatus = async (newStatus: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}/canvas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedCanvas = await res.json();
        setCanvas(updatedCanvas);
        router.refresh();
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-prompt">กำลังโหลด...</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center font-prompt text-red-500">ไม่พบโปรเจกต์</div>;
  }

  const status = canvas?.status || 'DRAFT';
  const isReadOnly = status === 'SIGNED';

  // Prepare Donut Chart Segments from Project Members
  const colors = ['#FF1A1A', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
  const segments = project.members?.map((member: any, idx: number) => ({
    label: member.user?.name || member.role,
    percentage: member.equityPercentage / 100, // basis points to %
    color: colors[idx % colors.length]
  })) || [];

  const resources = canvas?.resources || [];

  return (
    <div className="min-h-screen bg-gray-50 font-prompt pb-24">
      <div className="max-w-xl mx-auto bg-white min-h-screen shadow-sm">
        <header className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <Link href={`/project/${id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">แคนวาสข้อตกลงร่วม</h1>
            <p className="text-xs text-gray-500">{project.title}</p>
          </div>
        </header>

        <main className="p-4 space-y-8 mt-2">
          {/* Split Type Selector */}
          <section>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['REVENUE_SHARE', 'FLAT_FEE', 'HYBRID'].map((type) => (
                <button
                  key={type}
                  onClick={() => { setSplitType(type); setHasUnsavedChanges(true); }}
                  disabled={isReadOnly}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${splitType === type ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </section>

          {/* Interactive Donut Chart */}
          {segments.length > 0 && (
             <section className="py-4">
               <DonutChart segments={segments} />
             </section>
          )}

          {/* Resource Badges */}
          <section>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-gray-900">Resource Contributions</h3>
               {!isReadOnly && (
                 <button onClick={() => setShowResourceModal(true)} className="text-xs text-[#FF1A1A] font-bold px-2 py-1 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                   + เพิ่มทรัพยากร
                 </button>
               )}
            </div>
            
            {resources.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                ยังไม่มีการระบุทรัพยากร
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {resources.map((res: any) => (
                  <div key={res.id} className="p-3 border border-gray-100 rounded-[14px] bg-gray-50">
                    <div className="text-2xl mb-2">{res.icon ? <i className={res.icon}></i> : '📦'}</div>
                    <p className="font-semibold text-gray-900 text-sm">{res.label}</p>
                    <p className="text-xs text-gray-500 mb-2">{res.category}</p>
                    <p className="font-bold text-[#FF1A1A] text-sm">฿{(res.equivalentValueSatang / 100).toLocaleString('th-TH')}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Breakeven Section */}
          <section className="border border-gray-200 rounded-[14px] p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Breakeven Threshold</h3>
                <p className="text-xs text-gray-500">Require initial cost recovery</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={breakevenEnabled} onChange={(e) => { setBreakevenEnabled(e.target.checked); setHasUnsavedChanges(true); }} disabled={isReadOnly} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF1A1A]"></div>
              </label>
            </div>
            {breakevenEnabled && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">฿</span>
                <input
                  type="number"
                  value={breakevenAmount}
                  onChange={(e) => { setBreakevenAmount(e.target.value); setHasUnsavedChanges(true); }}
                  disabled={isReadOnly}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF1A1A]/20 focus:border-[#FF1A1A]"
                />
              </div>
            )}
          </section>

          {/* Smart Summary */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Smart Summary</h3>
            <textarea
              readOnly
              className="w-full bg-gray-50 border border-gray-200 rounded-[14px] p-4 text-sm text-gray-700 min-h-[100px] resize-none focus:outline-none"
              value={canvas?.smartSummary || `This agreement establishes a ${splitType.replace('_', ' ')} model.\n${breakevenEnabled ? `\nSubject to a breakeven threshold of ฿${Number(breakevenAmount).toLocaleString('th-TH')}.` : ''}`}
            />
          </section>

        </main>

        {/* Action Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 max-w-xl mx-auto flex items-center justify-center gap-3">
          {status === 'DRAFT' && (
            hasUnsavedChanges ? (
              <button 
                onClick={handleSaveCanvas}
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-[14px] shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
              </button>
            ) : (
              <button 
                onClick={() => updateCanvasStatus('PROPOSED')}
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-[14px] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังยื่น...' : 'ยื่นข้อเสนอ'}
              </button>
            )
          )}
          
          {status === 'PROPOSED' && (
            <>
              <button 
                 onClick={() => updateCanvasStatus('COUNTERED')}
                 disabled={isSubmitting}
                 className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-[14px] transition-colors disabled:opacity-50"
              >
                ยื่นข้อเสนอใหม่
              </button>
              <button 
                 onClick={() => updateCanvasStatus('SIGNED')}
                 disabled={isSubmitting}
                 className="flex-1 py-4 bg-[#FF1A1A] hover:bg-[#e61717] text-white font-bold rounded-[14px] shadow-lg shadow-red-500/30 transition-all disabled:opacity-50"
              >
                ยอมรับ (Digital Handshake)
              </button>
            </>
          )}

          {status === 'SIGNED' && (
            <div className="w-full py-4 bg-emerald-50 text-emerald-600 font-bold rounded-[14px] flex items-center justify-center gap-2 border border-emerald-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ลงลายเซ็นแล้ว
            </div>
          )}
        </div>
      </div>

      {/* Add Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">เพิ่มทรัพยากร</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">ชื่อทรัพยากร</label>
                <input type="text" className="w-full border rounded-lg p-2 text-sm" value={newResource.label} onChange={e => setNewResource({...newResource, label: e.target.value})} placeholder="เช่น ห้องอัด, แรงงาน, กล้อง" />
              </div>
              <div>
                <label className="text-xs text-gray-500">หมวดหมู่</label>
                <select className="w-full border rounded-lg p-2 text-sm" value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value})}>
                  <option value="EQUIPMENT">อุปกรณ์ (Equipment)</option>
                  <option value="LABOR">แรงงาน (Labor)</option>
                  <option value="CASH">เงินสด (Cash)</option>
                  <option value="VENUE">สถานที่ (Venue)</option>
                  <option value="IP">ทรัพย์สินทางปัญญา (IP)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">มูลค่าเทียบเท่า (บาท)</label>
                <input type="number" className="w-full border rounded-lg p-2 text-sm" value={newResource.value} onChange={e => setNewResource({...newResource, value: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500">ไอคอน (FontAwesome class)</label>
                <input type="text" className="w-full border rounded-lg p-2 text-sm" value={newResource.icon} onChange={e => setNewResource({...newResource, icon: e.target.value})} placeholder="fa-solid fa-camera" />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowResourceModal(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-medium text-sm">ยกเลิก</button>
              <button onClick={handleAddResource} disabled={isSubmitting} className="flex-1 py-2 bg-[#FF1A1A] text-white rounded-lg font-medium text-sm">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

