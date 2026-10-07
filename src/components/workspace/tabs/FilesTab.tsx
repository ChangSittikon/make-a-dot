"use client";

import { useEffect, useState } from 'react';
import { Search, Plus, File } from 'lucide-react';


import { FileNode } from '../types';
import { FileTree } from '../components/FileTree';

export function FilesTab() {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch('/api/fs/tree');
        const data = await res.json();
        if (data.tree) setTree(data.tree);
      } catch (error) {
        console.error("Failed to load file tree", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Left Sidebar: File Explorer */}
      <div className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-900/50">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-300">Files</span>
        </div>
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-zinc-500" />
            <input 
              placeholder="Search files..." 
              className="pl-8 h-8 bg-zinc-950 border-zinc-800 text-sm text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {loading ? (
            <div className="text-xs text-zinc-500 p-2">Loading files...</div>
          ) : (
             <FileTree nodes={tree} onSelectFile={() => {}} />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
        <div className="flex flex-col items-center max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50 shadow-inner">
            <File className="w-8 h-8 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-200 mb-2">No files or collections selected</h3>
            <p className="text-sm text-zinc-500 mb-6">Select a file from the sidebar to view its details, or create a new collection to organize your assets.</p>
          </div>
          <div className="flex space-x-3">
            <button  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Upload files
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
              Create collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
