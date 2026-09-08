const fs = require('fs');

let content = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

content = content.replace(
  /<div className=\"(?:fixed|absolute) inset-0 z-\[?(?:50|60)\]? bg-black\/60 backdrop-blur-sm flex flex-col justify-end\">/g,
  `<div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>`
);

content = content.replace(
  /<div className=\"bg-white w-full rounded-t-3xl h-\[95%\] flex flex-col animate-slide-up\">/g,
  '<div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">'
);

content = content.replace(/        <\/div>\r?\n      \)\}/g, '          </div>\n        </div>\n      )}');

fs.writeFileSync('src/components/admin/AgentHubClient.tsx', content);
console.log('Done');
