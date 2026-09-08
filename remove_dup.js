const fs = require('fs');
const path = 'src/components/admin/AgentHubClient.tsx';
let code = fs.readFileSync(path, 'utf8');

const tabDiv = `<div className="flex gap-2 px-5 py-3 bg-white border-b border-gray-100">`;
const firstIndex = code.indexOf(tabDiv);
const secondIndex = code.indexOf(tabDiv, firstIndex + 1);

if (secondIndex !== -1 && secondIndex < firstIndex + 1500) {
  // Find the end of the second block (next div)
  const nextDiv = code.indexOf('<div className="p-5 overflow-y-auto flex-1', secondIndex);
  if (nextDiv !== -1) {
    code = code.substring(0, secondIndex) + code.substring(nextDiv);
    fs.writeFileSync(path, code);
    console.log("Removed duplicate!");
  }
}
