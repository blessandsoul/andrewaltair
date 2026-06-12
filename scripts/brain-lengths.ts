import { BRAINS } from '../src/lib/brains';
import { brainBlock } from '../src/lib/brains/brainBlock';
const rows = Object.keys(BRAINS).map((id) => ({ id, full: brainBlock(id, 'full').length, trim: brainBlock(id, 'trim').length }));
rows.sort((a, b) => b.full - a.full);
for (const r of rows) console.log(`${r.full}\t${r.trim}\t${r.id}`);
