"use client";

import { useEffect, useState } from 'react';
import { Search, Download, Copy, Save } from 'lucide-react';
import Editor from '@monaco-editor/react';


import { FileNode } from '../types';
import { FileTree } from '../components/FileTree';

export function CodeTab() {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('// Select a file from the explorer to view code');
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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

  const handleSelectFile = async (path: string) => {
    setSelectedFile(path);
    setIsLoadingFile(true);
    try {
      const res = await fetch(`/api/fs/read?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.content) {
        setFileContent(data.content);
      } else {
        setFileContent('// Error loading file');
      }
    } catch (error) {
      console.error("Failed to read file", error);
      setFileContent('// Failed to fetch file content');
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Determine language for syntax highlighting
  const getLanguage = (filename: string) => {
    if (!filename) return 'typescript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#1e1e1e] text-zinc-300">
      {/* Left Sidebar: Minimal File Explorer */}
      <div className="w-64 border-r border-zinc-800/50 flex flex-col bg-[#181818]">
        <div className="p-2 border-b border-zinc-800/50">
           <div className="relative">
            <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-zinc-500" />
            <input 
              placeholder="Search code..." 
              className="pl-7 h-7 bg-[#252526] border-zinc-700/50 text-xs text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
          {loading ? (
            <div className="text-xs text-zinc-500 p-2">Loading...</div>
          ) : (
            <FileTree nodes={tree} onSelectFile={handleSelectFile} selectedPath={selectedFile || undefined} />
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Editor Tab Header */}
        <div className="h-9 border-b border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between px-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-400 font-medium">
              {selectedFile ? selectedFile : 'No file selected'}
            </span>
            {selectedFile && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-sm">Read only</span>}
          </div>
          
          <div className="flex items-center space-x-1">
             <button   className="h-6 w-6 rounded-md hover:bg-[#2d2d2d] text-zinc-400">
                <Copy className="h-3.5 w-3.5" />
             </button>
             <button   className="h-6 w-6 rounded-md hover:bg-[#2d2d2d] text-zinc-400">
                <Download className="h-3.5 w-3.5" />
             </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 relative">
          {isLoadingFile ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
               <span className="text-sm text-zinc-500">Loading code...</span>
            </div>
          ) : null}
          <Editor
            height="100%"
            language={getLanguage(selectedFile || '')}
            theme="vs-dark"
            value={fileContent}
            options={{
              readOnly: true,
              minimap: { enabled: true },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
