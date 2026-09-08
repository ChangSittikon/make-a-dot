const fs = require('fs');

const clientPath = 'C:/Users/CHANG-PCSONSAI/.gemini/antigravity/scratch/make-a-dot/src/components/admin/AgentHubClient.tsx';
let clientCode = fs.readFileSync(clientPath, 'utf8');

const patchPath = 'C:/Users/CHANG-PCSONSAI/.gemini/antigravity/brain/3e8975b1-d3a8-419a-a9e7-1c0cbb20e7f0/scratch/tech_updates_jsx.txt';
const patchCode = fs.readFileSync(patchPath, 'utf8');

// The patchCode contains {/* 2. System Health ... */} to {/* View Skills Modal */}
const startMarker = '{/* 2. System Health / Monitoring */}';
const endMarker = '{/* View Skills Modal */}'; // Need to be careful here
// Wait, the client code might have slightly different comments. Let's find exactly what to replace.

const startIdx = clientCode.indexOf('{/* 2. System Health / Monitoring */}');
const endIdx = clientCode.indexOf('{/* Add/Edit Rule Modal */}');

if (startIdx !== -1 && endIdx !== -1) {
  // In tech_updates_jsx, it ends with {/* View Skills Modal */}
  let replacement = patchCode.replace('{/* View Skills Modal */}', '').trim();
  replacement = replacement + '\n\n        ';
  
  clientCode = clientCode.substring(0, startIdx) + replacement + clientCode.substring(endIdx);
  fs.writeFileSync(clientPath, clientCode, 'utf8');
  console.log("Restored Tech Updates UI!");
} else {
  console.log("Could not find boundaries");
}
