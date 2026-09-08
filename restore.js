const fs = require('fs');

const logPath = 'C:/Users/CHANG-PCSONSAI/.gemini/antigravity/brain/3e8975b1-d3a8-419a-a9e7-1c0cbb20e7f0/.system_generated/tasks/task-2952.log';
const logData = fs.readFileSync(logPath, 'utf8');

// The log file has line numbers "1: ", "2: ", ... and "> 16: "
const lines = logData.split('\n');
let sourceCodeLines = [];

for (const line of lines) {
  // Regex to match "123: " or "> 123: "
  const match = line.match(/^(?:>\s*)?\d+:\s(.*)$/);
  if (match) {
    sourceCodeLines.push(match[1]);
  }
}

fs.writeFileSync('src/components/admin/AgentHubClient.tsx', sourceCodeLines.join('\n'));
console.log("Restored from task-2952.log!");
