const fs = require('fs');
const path = require('path');
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(e.name)) continue;
      files.push(...walk(full));
    } else if (full.endsWith('.jsx')) {
      files.push(full);
    }
  }
  return files;
}
const files = walk(path.join(process.cwd(), 'src'));
const bad = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (/React\.createElement/.test(content) && !/import\s+React(?:\s*,\s*\{[^}]*\})?\s+from\s+['\"]react['\"]/.test(content)) {
    bad.push(file);
  }
}
console.log(`${bad.length} files without React import`);
if (bad.length) {
  console.log(bad.join('\n'));
}
