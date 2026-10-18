// Кінець дня: зібрати дошки і викласти на GitHub Pages. node sync.mjs
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: import.meta.dirname });
run('node build.mjs');
run('git add -A');
if (execSync('git status --porcelain', { cwd: import.meta.dirname }).toString().trim()) {
  run(`git commit -m "update boards ${new Date().toISOString().slice(0, 16).replace('T', ' ')}"`);
  run('git push');
} else console.log('без змін');
