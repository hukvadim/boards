// Збирає TASKS.md з усіх папок у C:\Projects → boards.json для index.html.
// node build.mjs [папка-з-проєктами]
import fs from 'node:fs';
import path from 'node:path';

export function parse(md, id) {
  const board = { id, title: id, columns: [] };
  for (const line of md.split(/\r?\n/)) {
    let m;
    if ((m = line.match(/^# (.+)/))) board.title = m[1].trim();
    else if ((m = line.match(/^## (.+)/))) board.columns.push({ title: m[1].trim(), cards: [] });
    else if ((m = line.match(/^\s*- \[( |x)\] (.+)/i)) && board.columns.length) {
      const [title, ...rest] = m[2].split(' — ');
      board.columns.at(-1).cards.push({ title: title.trim(), note: rest.join(' — ').trim(), done: m[1] !== ' ' });
    }
  }
  return board;
}

const root = path.resolve(process.argv[2] ?? '..');
if (process.argv[1].endsWith('build.mjs')) {
  const boards = fs.readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'TASKS.md')))
    .map((d) => {
      const file = path.join(root, d.name, 'TASKS.md');
      return { ...parse(fs.readFileSync(file, 'utf8'), d.name), updated: fs.statSync(file).mtime.toISOString() };
    });
  fs.writeFileSync(new URL('./boards.json', import.meta.url), JSON.stringify({ built: new Date().toISOString(), boards }, null, 2));
  console.log(`boards.json: ${boards.map((b) => b.title).join(', ') || 'нема TASKS.md'}`);
}
