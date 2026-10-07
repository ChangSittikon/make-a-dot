"use client";

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode2, FileJson, FileText, FileImage } from 'lucide-react';
import { FileNode } from '../types';

interface FileTreeProps {
  nodes: FileNode[];
  onSelectFile: (path: string) => void;
  selectedPath?: string;
}

export function FileTree({ nodes, onSelectFile, selectedPath }: FileTreeProps) {
  return (
    <div className="w-full">
      {nodes.map((node) => (
        <FileTreeNode 
          key={node.path} 
          node={node} 
          onSelectFile={onSelectFile} 
          selectedPath={selectedPath} 
        />
      ))}
    </div>
  );
}

function FileTreeNode({ node, onSelectFile, selectedPath }: { node: FileNode; onSelectFile: (path: string) => void; selectedPath?: string; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedPath === node.path;
  
  const handleToggle = () => {
    if (node.type === 'directory') {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.js')) return <FileCode2 className="w-4 h-4 text-blue-400" />;
    if (name.endsWith('.json')) return <FileJson className="w-4 h-4 text-yellow-400" />;
    if (name.endsWith('.md')) return <FileText className="w-4 h-4 text-zinc-400" />;
    if (name.match(/\\.(jpg|jpeg|png|gif|svg)$/)) return <FileImage className="w-4 h-4 text-green-400" />;
    return <FileText className="w-4 h-4 text-zinc-400" />;
  };

  return (
    <div className="w-full">
      <div 
        onClick={handleToggle}
        className={`flex items-center py-1 px-2 cursor-pointer rounded-md text-sm transition-colors ${
          isSelected ? 'bg-blue-600/20 text-blue-300' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
        }`}
      >
        <span className="w-4 h-4 mr-1 flex items-center justify-center">
          {node.type === 'directory' ? (
            isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : null}
        </span>
        
        <span className="w-4 h-4 mr-2 flex items-center justify-center">
          {node.type === 'directory' ? (
             <Folder className={`w-4 h-4 ${isOpen ? 'text-blue-400' : 'text-zinc-500'}`} />
          ) : (
            getFileIcon(node.name)
          )}
        </span>
        
        <span className="truncate">{node.name}</span>
      </div>

      {node.type === 'directory' && isOpen && node.children && (
        <div className="ml-4 border-l border-zinc-800/50 pl-1">
          {node.children.map((childNode) => (
            <FileTreeNode 
              key={childNode.path} 
              node={childNode} 
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
