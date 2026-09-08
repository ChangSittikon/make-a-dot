const fs = require('fs');

let code = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

const bottomSectionNew = `
      {/* 2. System Health / Monitoring */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 mb-2 px-1">System Health</h3>
        {loadingHealth ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex justify-center">
            <i className="fa-solid fa-spinner fa-spin text-blue-500"></i>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {healthMetrics.map((m: any, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className={\`w-2 h-2 rounded-full \${m.status === 'ok' ? 'bg-green-500' : 'bg-amber-500'}\`}></div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{m.name}</span>
                </div>
                <p className="text-sm font-black text-gray-900">{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Tech News / Updates */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">Tech Updates</h3>
          <button 
            onClick={fetchTechUpdates}
            disabled={loadingUpdates}
            className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition flex items-center gap-1 disabled:opacity-50"
          >
            <i className={\`fa-solid fa-rotate \${loadingUpdates ? 'fa-spin' : ''}\`}></i>
            รีเฟรชอัปเดต
          </button>
        </div>
        
        <div className="flex gap-2 px-1 mb-2">
          {(['tech', 'ai', 'others'] as const).map(tabKey => {
            const unreadCount = getUnreadCount(tabKey);
            return (
              <button 
                key={tabKey}
                onClick={() => { setActiveTab(tabKey); setExpandedUpdateId(null); }}
                className={\`text-[10px] font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1.5 \${
                  activeTab === tabKey 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }\`}
              >
                {techUpdates[tabKey]?.label}
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="space-y-2">
          {loadingUpdates ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex justify-center">
              <i className="fa-solid fa-spinner fa-spin text-blue-500"></i>
            </div>
          ) : techUpdates[activeTab]?.updates?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500">ไม่มีข่าวสารใหม่</p>
            </div>
          ) : (
            techUpdates[activeTab]?.updates?.map((update: any) => {
              const isUnread = update.importance?.isNew && !readUpdates.includes(update.id);
              return (
                <div 
                  key={update.id} 
                  className={\`bg-white rounded-2xl border \${isUnread ? 'border-red-300' : 'border-gray-200'} p-4 shadow-sm hover:border-blue-300 transition relative overflow-hidden\`}
                >
                  <div className="flex gap-3">
                    <div className={\`w-1.5 h-1.5 rounded-full \${isUnread ? 'bg-brand-red' : 'bg-gray-300'} mt-1.5 shrink-0 relative\`}>
                      {isUnread && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={\`font-bold text-xs \${isUnread ? 'text-gray-900' : 'text-gray-700'}\`}>{update.name} <span className="text-blue-600">{update.version}</span></h4>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed whitespace-pre-wrap">
                        {update.summary}
                      </p>
                      <a 
                        href={update.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markUpdateAsRead(update.id)}
                        className="text-[10px] text-blue-600 font-bold hover:underline mt-2 inline-block"
                      >
                        ดูรายละเอียด
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
`;

const insertIndex = code.indexOf('</div>\n    </div>\n  );\n}');
if (insertIndex !== -1) {
  code = code.substring(0, insertIndex) + bottomSectionNew + code.substring(insertIndex);
  fs.writeFileSync('src/components/admin/AgentHubClient.tsx', code, 'utf8');
  console.log('Patched');
} else {
  // Try another index
  const lastIndex = code.lastIndexOf('</div>');
  if (lastIndex !== -1) {
     code = code.substring(0, lastIndex) + bottomSectionNew + code.substring(lastIndex);
     fs.writeFileSync('src/components/admin/AgentHubClient.tsx', code, 'utf8');
     console.log('Patched via fallback');
  } else {
     console.log('Could not find insert index');
  }
}
