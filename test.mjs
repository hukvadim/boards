import assert from 'node:assert';
import { parse } from './build.mjs';

const b = parse('# Proj\n\n## В роботі\n- [ ] Задача (a.js) — зупинився: тут\n## Готово\n- [x] Зроблено\n- просто текст\n', 'p');
assert.equal(b.title, 'Proj');
assert.deepEqual(b.columns.map((c) => c.cards.length), [1, 1]);
assert.deepEqual(b.columns[0].cards[0], { title: 'Задача (a.js)', note: 'зупинився: тут', done: false });
assert.equal(b.columns[1].cards[0].done, true);
console.log('ok');
