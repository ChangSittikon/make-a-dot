import { useState } from 'react';

export function SettingsKnowledgeView() {
  const [content, setContent] = useState('');

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-1">Knowledge</h1>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          Help the AI understand your project. Describe its purpose, target users, tech stack, APIs, database schema, and project-specific rules. Looking for instructions shared across projects?{' '}
          <a href="#" className="underline text-zinc-300 hover:text-white">Open workspace knowledge</a> or{' '}
          <a href="#" className="underline text-zinc-300 hover:text-white">learn more</a>.
        </p>
      </div>

      {/* Editor Card */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
        <div className="border border-zinc-800/80 rounded-xl p-4 bg-[#141414] focus-within:border-zinc-700 transition-colors mb-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your project, its tech stack, and any specific guidelines..."
            className="w-full h-80 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none resize-none leading-relaxed font-sans"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5">
          <button 
            type="button"
            onClick={() => setContent('')}
            className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            className="bg-zinc-200 hover:bg-white text-zinc-950 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
