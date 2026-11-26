// Copies the seed data over the runtime DB so every run starts from a known state.
// Node script (not `cp`) so it also works on Windows.
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
copyFileSync(join(root, 'mock-api', 'db.seed.json'), join(root, 'mock-api', 'db.json'));
console.log('mock-api/db.json reset from db.seed.json');
