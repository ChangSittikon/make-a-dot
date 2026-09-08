const fs = require('fs');

function parseFrontmatter(fileContent) {
  const contentToMatch = fileContent.replace(/^\uFEFF/, '');
  const match = contentToMatch.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { attributes: {}, body: fileContent };
  const frontmatter = match[1];
  const attributes = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      attributes[key] = value;
    }
  });
  return { attributes, body: match[2].trim() };
}

const content = fs.readFileSync('.agents/rules/architecture.md', 'utf8');
console.log(JSON.stringify(parseFrontmatter(content), null, 2));
