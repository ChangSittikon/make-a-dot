const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

const targetStr = '<p className={`text-[11px] font-medium text-gray-800 leading-relaxed whitespace-pre-wrap ${expandedUpdateId === update.id ? \'\' : \'line-clamp-2\'}`}>\n                          {update.summary}\n                        </p>';

const replacementStr = `{expandedUpdateId === update.id && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {(update.importance?.level === 'Critical' || update.importance?.level === 'high') && (
                              <div className="bg-red-50 text-red-600 text-[10px] p-2 rounded-lg mb-2 font-medium flex items-start gap-1.5 border border-red-100">
                                <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                                เอเจนต์แนะนำให้อัปเกรดด่วนเพื่อความปลอดภัยและประสิทธิภาพของระบบ
                              </div>
                            )}
                            <p className="text-[11px] font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {update.summary}
                            </p>
                          </div>
                        )}`;

code = code.replace(targetStr, replacementStr);
code = code.replace(/update\.importance\?\.level === 'high'/g, "update.importance?.level === 'Critical' || update.importance?.level === 'high'");

// Remove the mb-2 from the div above it so the layout is tighter when collapsed
code = code.replace('<div className="flex items-center justify-between mt-1 mb-2">', '<div className="flex items-center justify-between mt-1">');

fs.writeFileSync('src/components/admin/AgentHubClient.tsx', code);
console.log('done');
