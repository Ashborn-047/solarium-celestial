/**
 * check-lines.mjs — Fail if any file in src/ exceeds 200 lines.
 * Covers: .ts, .tsx, .css, .glsl, .json
 * ESLint max-lines only applies to .ts/.tsx; this script covers the rest too.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const MAX = 200;
const EXTS = new Set(['.ts', '.tsx', '.css', '.glsl', '.json']);
const failures = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (EXTS.has(extname(entry))) {
      const lines = readFileSync(full, 'utf-8').split('\n').length;
      if (lines > MAX) {
        failures.push({ file: full, lines });
      }
    }
  }
}

walk('src');

if (failures.length) {
  console.error(`\n❌ ${failures.length} file(s) exceed ${MAX} lines:\n`);
  for (const f of failures) {
    console.error(`  ${f.file}: ${f.lines} lines`);
  }
  process.exit(1);
} else {
  console.log(`✓ All files in src/ are within ${MAX} lines.`);
}
