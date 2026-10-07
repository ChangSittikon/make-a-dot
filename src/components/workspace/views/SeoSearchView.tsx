import { Sparkles, RefreshCw, Zap, AlertTriangle, Lightbulb, Check, ChevronRight } from 'lucide-react';

export function SeoSearchView() {
  const auditItems = [
    {
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
      text: 'Page title and description are generic or placeholder',
      type: 'warning',
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />,
      text: 'Add a sitemap',
      type: 'suggestion',
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />,
      text: 'Social preview metadata uses scaffold defaults',
      type: 'suggestion',
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />,
      text: 'Product deals lack structured data markup',
      type: 'suggestion',
    },
    {
      icon: <Check className="w-4 h-4 text-emerald-500 shrink-0" />,
      text: 'Public pages have clear headings and content',
      type: 'success',
    },
    {
      icon: <Check className="w-4 h-4 text-emerald-500 shrink-0" />,
      text: 'Search acquisition not yet applicable',
      type: 'success',
    },
    {
      icon: <Check className="w-4 h-4 text-emerald-500 shrink-0" />,
      text: 'Crawler rules look good',
      type: 'success',
    },
    {
      icon: <Check className="w-4 h-4 text-emerald-500 shrink-0" />,
      text: 'Page basics are set',
      type: 'success',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Optimize search visibility</h1>
        <p className="text-sm text-zinc-400">Help people discover your project through search engines and AI assistants.</p>
      </div>

      {/* Top 2 Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Card 1: Research SEO with Lovable */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Research SEO with Lovable</h3>
              <span className="flex items-center text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700/60">
                <Sparkles className="w-3 h-3 text-purple-400 mr-1" /> Powered by Semrush
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Ask about your competitors, keywords, and what helps similar sites stand out in search.
            </p>

            <div className="space-y-2 mb-4">
              {[
                "Is interest in 'group buy' deals increasing?",
                "Is search interest for 'volume discounts' growing?",
                "What kinds of sites link to platforms offering promotional cards?"
              ].map((q, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-xl bg-[#202020] hover:bg-[#262626] border border-zinc-800/80 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button className="flex items-center text-xs text-zinc-400 hover:text-white transition-colors mt-2">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> New questions
          </button>
        </div>

        {/* Card 2: Get a custom domain */}
        <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-white">Get a custom domain</h3>
              <span className="inline-flex items-center text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60">
                <Zap className="w-2.5 h-2.5 mr-1 fill-zinc-300" /> Pro
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              A custom domain helps your site stand out and rank higher in search.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1e1e1e] text-zinc-200 border border-orange-500/50 shadow-sm">
                smexsupply.com
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1e1e1e] text-zinc-400 border border-zinc-800">
                smexdeals.com
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1e1e1e] text-zinc-400 border border-zinc-800">
                smexcard.com
              </span>
            </div>

            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Search domains
            </button>
          </div>

          <div className="text-xs text-zinc-400 pt-6">
            Already own a domain?{' '}
            <a href="#" className="underline font-semibold text-white hover:text-zinc-200">
              Manage domains
            </a>
          </div>
        </div>
      </div>

      {/* Middle Card: Your SEO & AI search review */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Your SEO &amp; AI search review</h3>
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-700/50">
                Out of date
              </span>
            </div>
            <p className="text-xs text-zinc-400">A few things to tidy up, but nothing critical.</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Scan again
            </button>
            <button className="bg-white hover:bg-zinc-200 text-zinc-950 font-medium px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm">
              Try to fix all
            </button>
          </div>
        </div>

        {/* Audit list */}
        <div className="divide-y divide-zinc-800/60 mb-4">
          {auditItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 hover:bg-zinc-800/30 px-2 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
          ))}
        </div>

        <p className="text-[11px] text-zinc-500">Publish your project to get more suggestions.</p>
      </div>

      {/* Bottom Card: How your site appears */}
      <div className="bg-[#161616] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">How your site appears</h3>
            <p className="text-xs text-zinc-400 mb-4">You can ask Lovable to edit this.</p>
            <div className="flex items-center gap-2">
              <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                Ask Lovable to edit details
              </button>
              <button className="bg-transparent border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                Ask Lovable to edit icon
              </button>
            </div>
          </div>

          {/* SERP Preview Box */}
          <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center text-[10px]">
                🎨
              </div>
              <span className="text-xs font-semibold text-indigo-400">sme-x-card-deals</span>
            </div>
            <p className="text-[11px] text-emerald-500 mb-1">sme-x-card-deals.lovable.app</p>
            <p className="text-xs text-zinc-400">Lovable Generated Project</p>
          </div>
        </div>
      </div>
    </div>
  );
}
