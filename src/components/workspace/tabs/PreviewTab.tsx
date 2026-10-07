"use client";

import { Smartphone, RotateCcw, ExternalLink } from 'lucide-react';


export function PreviewTab() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 overflow-hidden">
      {/* Device Toolbar */}
      <div className="flex items-center justify-between w-full max-w-[430px] mb-4">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Smartphone className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Mobile Preview</span>
        </div>
        <div className="flex items-center space-x-2">
          <button   className="w-8 h-8 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Reload">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button   className="w-8 h-8 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white" title="Open in new tab">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Device Frame */}
      <div className="relative w-full max-w-[430px] h-[800px] bg-black rounded-[3rem] border-[14px] border-zinc-900 shadow-2xl overflow-hidden shrink-0 ring-1 ring-white/10">
        {/* Dynamic Island Notch Mock */}
        <div className="absolute top-0 inset-x-0 h-[30px] flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-[30px] bg-zinc-900 rounded-b-3xl"></div>
        </div>

        {/* The actual App Preview */}
        <iframe 
          src="/" 
          className="w-full h-full bg-white border-none"
          title="App Preview"
        />
      </div>
    </div>
  );
}
