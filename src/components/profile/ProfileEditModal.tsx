'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileEditModal({ user, onClose }: { user: any, onClose: () => void }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [previewImage, setPreviewImage] = useState(user.image || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        onClose();
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <img src={previewImage || `https://ui-avatars.com/api/?name=${name || 'User'}&background=f3f4f6&color=374151`} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover" />
              <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-camera text-white text-lg mb-1"></i>
                <span className="text-[9px] text-white font-medium">เปลี่ยนรูป</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-colors" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">เบอร์โทรศัพท์</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-colors" 
            />
          </div>
          
          <button type="submit" disabled={isSaving} className="w-full bg-brand-red text-white font-bold text-sm py-3 rounded-xl mt-4 hover:bg-red-600 transition-colors disabled:opacity-50">
            {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : "บันทึกข้อมูล"}
          </button>
        </form>
      </div>
    </div>
  );
}
