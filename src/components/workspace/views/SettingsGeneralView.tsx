import { Pencil, ArrowUpRight, Zap, Info, ChevronDown, X, AlertTriangle } from 'lucide-react';

export function SettingsGeneralView() {
  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-3 pt-2">
        <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-800/60 flex items-center justify-center text-purple-300 font-bold text-sm shadow-sm">
          ::
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">sme-x-card-deals</h1>
          <p className="text-xs text-zinc-400">
            Owned by Y1OaWwLZGQYqLMfp1kSgfJWSbXQ2 • Created Jul 13, 2025
          </p>
        </div>
      </div>

      {/* 1. Project details */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-2">Project details</h2>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 text-xs shadow-sm">
          <div className="flex items-center justify-between p-4">
            <span className="font-semibold text-white">Project name</span>
            <button className="flex items-center text-zinc-300 hover:text-white transition-colors">
              sme-x-card-deals <Pencil className="w-3 h-3 ml-1.5 text-zinc-500" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <span className="font-semibold text-white">URL subdomain</span>
            <button className="flex items-center text-zinc-300 hover:text-white transition-colors">
              sme-x-card-deals <Pencil className="w-3 h-3 ml-1.5 text-zinc-500" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <span className="font-semibold text-white">Owner</span>
            <a href="#" className="flex items-center text-zinc-300 hover:text-white underline underline-offset-2">
              Makoto <ArrowUpRight className="w-3 h-3 ml-1 text-zinc-500" />
            </a>
          </div>

          <div className="flex items-center justify-between p-4">
            <span className="font-semibold text-white">Messages count</span>
            <span className="text-zinc-400">77</span>
          </div>

          <div className="flex items-center justify-between p-4">
            <span className="font-semibold text-white">AI edits count</span>
            <span className="text-zinc-400">42</span>
          </div>

          <div className="flex items-center justify-between p-4">
            <span className="font-semibold text-white">Credit usage</span>
            <button className="flex items-center bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1 rounded-lg transition-colors font-medium">
              View usage <ArrowUpRight className="w-3 h-3 ml-1.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Project monitoring */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-2">Project monitoring</h2>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-white">Project monitoring</span>
                <span className="inline-flex items-center text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60">
                  <Zap className="w-2.5 h-2.5 mr-0.5 fill-zinc-300" /> Pro
                </span>
                <Info className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <a href="#" className="underline text-zinc-300 hover:text-white">Upgrade your plan</a> to regularly check your project for issues and improvements. Past checks and their credit usage are stored in your history.
              </p>
            </div>
            {/* Toggle Switch (OFF) */}
            <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer shrink-0">
              <div className="w-4 h-4 bg-zinc-400 rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Preview */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">Preview</h2>
        <p className="text-xs text-zinc-400 mb-2">Control how this project renders in the editor preview.</p>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="pr-4">
            <h3 className="text-xs font-semibold text-white mb-0.5">Live preview</h3>
            <p className="text-xs text-zinc-400">
              Run your app on a live dev server in the editor preview. When off, the preview shows the latest built version.
            </p>
          </div>
          {/* Toggle Switch (ON) */}
          <div className="w-10 h-6 bg-blue-600 rounded-full p-1 cursor-pointer shrink-0 flex justify-end">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* 4. Publishing */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">Publishing</h2>
        <p className="text-xs text-zinc-400 mb-2">Control how this project appears when published.</p>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 text-xs shadow-sm">
          {/* Project category */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Project category</div>
              <p className="text-zinc-400">Categorize your project to help others find it.</p>
            </div>
            <button className="flex items-center bg-[#1a1a1a] border border-zinc-700/80 text-zinc-400 px-3 py-1.5 rounded-lg">
              Select category <ChevronDown className="w-3.5 h-3.5 ml-2 text-zinc-500" />
            </button>
          </div>

          {/* Hide Lovable badge */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-white mb-0.5">
                Hide Lovable badge
                <span className="inline-flex items-center text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-1 py-0.2 rounded border border-zinc-700/60">
                  <Zap className="w-2.5 h-2.5 mr-0.5 fill-zinc-300" /> Pro
                </span>
              </div>
              <p className="text-zinc-400">
                <a href="#" className="underline text-zinc-300">Upgrade your plan</a> to remove the &quot;Edit with Lovable&quot; badge from your published work.
              </p>
            </div>
            <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer shrink-0">
              <div className="w-4 h-4 bg-zinc-400 rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Visitor analytics */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Visitor analytics</div>
              <p className="text-zinc-400">Collect visitor analytics for your published app.</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full p-1 cursor-pointer shrink-0 flex justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* AI app context */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-white mb-0.5">
                AI app context <Info className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <p className="text-zinc-400">Let Lovable use context from AI calls to help debug and improve your app.</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full p-1 cursor-pointer shrink-0 flex justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Auto-fix security issues */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Auto-fix security issues</div>
              <p className="text-zinc-400">Enable auto-fixing for basic scan issues that are low risk for this project.</p>
            </div>
            <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer shrink-0">
              <div className="w-4 h-4 bg-zinc-400 rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Trust center */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Trust center</div>
              <p className="text-zinc-400">Make Lovable-generated security observations publicly discoverable for this published project.</p>
            </div>
            <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer shrink-0">
              <div className="w-4 h-4 bg-zinc-400 rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Unpublish project */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Unpublish project</div>
              <p className="text-zinc-400">Your app&apos;s published URL will no longer be accessible to anyone.</p>
            </div>
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Unpublish
            </button>
          </div>
        </div>
      </div>

      {/* 5. Sharing */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">Sharing</h2>
        <p className="text-xs text-zinc-400 mb-2">Control how this project can be shared, copied, and embedded.</p>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 space-y-5 text-xs shadow-sm">
          {/* Project access */}
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-1.5 font-semibold text-white mb-0.5">
                Project access <Info className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <p className="text-zinc-400">
                Project visibility settings have moved to the &quot;Share&quot; menu. Open it to manage who can view and edit your project in the editor.
              </p>
            </div>
            <button className="flex items-center bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg font-medium shrink-0">
              Open share menu <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-zinc-400" />
            </button>
          </div>

          {/* Dismissible Notice */}
          <div className="p-3.5 rounded-xl bg-[#202020] border border-zinc-700/60 relative">
            <button className="absolute top-3 right-3 text-zinc-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
            <h4 className="font-semibold text-white mb-1">Public project visibility has been removed.</h4>
            <p className="text-zinc-400 leading-relaxed pr-6">
              Only workspace members can now view and edit this project. To manage project access, go to the &quot;Share&quot; menu. To let others copy your project, enable public remixing below.
            </p>
          </div>

          {/* Public remixing */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="font-semibold text-white mb-0.5">Public remixing</div>
              <p className="text-zinc-400">Allow anyone with the project link to copy and remix the latest version of the project.</p>
            </div>
            <div className="w-10 h-6 bg-zinc-800 rounded-full p-1 cursor-pointer shrink-0">
              <div className="w-4 h-4 bg-zinc-400 rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Cross-project sharing */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
            <div>
              <div className="font-semibold text-white mb-0.5">Cross-project sharing</div>
              <p className="text-zinc-400">Allow this project to read files from other projects and be visible to other projects in the workspace.</p>
            </div>
            <div className="w-10 h-6 bg-blue-600 rounded-full p-1 cursor-pointer shrink-0 flex justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Project actions */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">Project actions</h2>
        <p className="text-xs text-zinc-400 mb-2">Duplicate, move, or transfer this project.</p>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl divide-y divide-zinc-800/60 text-xs shadow-sm">
          {/* Remix */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Remix project</div>
              <p className="text-zinc-400">Duplicate this app in a new project.</p>
            </div>
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg font-medium">
              Remix
            </button>
          </div>

          {/* Move */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Move to workspace</div>
              <p className="text-zinc-400">Move this project to a different workspace.</p>
            </div>
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg font-medium">
              Move
            </button>
          </div>

          {/* Transfer */}
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold text-white mb-0.5">Transfer ownership</div>
              <p className="text-zinc-400">Transfer project ownership to another workspace member.</p>
            </div>
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg font-medium">
              Transfer
            </button>
          </div>

          {/* Migrate */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 font-semibold text-white mb-1">
                  Migrate to TanStack Start
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-zinc-700/60">
                    Advanced
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  TanStack Start is a web framework that enables server-side rendering and improved link previews. This optional migration uses credits.{' '}
                  <a href="#" className="underline text-white">Learn more about TanStack Start</a>
                </p>
              </div>
              <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg font-medium shrink-0 ml-4">
                Migrate
              </button>
            </div>
            <div className="flex items-center text-amber-500 gap-1.5 text-[11px] pt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>App upgrades typically cost 10-35 credits; yours may need a top-up partway.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Danger zone */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-2">Danger zone</h2>
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <div>
              <h3 className="font-semibold text-white mb-0.5">Delete project</h3>
              <p className="text-zinc-400">Permanently delete this project.</p>
            </div>
            <button className="text-rose-500 hover:text-rose-400 font-medium px-3.5 py-1.5 rounded-lg hover:bg-rose-950/30 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
