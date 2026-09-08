const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

const modalStr = `      {/* Doc Preview Modal */}
      {previewDoc && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0">
                  <i className="fa-regular fa-file-lines text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none mb-1 line-clamp-1">{previewDoc.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-none font-mono">{previewDoc.filename}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="w-8 h-8 flex shrink-0 items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="max-w-2xl mx-auto">
                <pre className="text-[13px] text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {previewDoc.content || 'ไม่มีข้อมูล (No content)'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Logs Modal */}`;

content = content.replace('      {/* View Logs Modal */}', modalStr);
fs.writeFileSync('src/components/admin/AgentHubClient.tsx', content);
