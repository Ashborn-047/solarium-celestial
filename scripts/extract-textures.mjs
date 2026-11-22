/**
 * extract-textures.mjs — Extract base64 data URIs from legacy/solar-bodies.html
 * into public/textures/<group>/<name>.<ext>
 *
 * Locates the IMG object by regex (not line number).
 * Preserves color-space metadata in a companion textures-meta.json.
 *
 * Color-space table (from legacy):
 *   linear (NoColorSpace): earth_n, earth_r, mercury_b, venus_b, mars_b, sun
 *   sRGB: everything else
 *
 * Run: node scripts/extract-textures.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const LEGACY = 'legacy/solar-bodies.html';
const OUT = 'public/textures';

const LINEAR_KEYS = new Set([
  'earth_n', 'earth_r', 'mercury_b', 'venus_b', 'mars_b', 'sun',
]);

const GROUP_MAP = {
  sun: 'sun',
  mercury: 'planets', mercury_b: 'planets',
  venus: 'planets', venus_b: 'planets',
  earth: 'planets', earth_n: 'planets', earth_r: 'planets',
  earth_l: 'planets', earth_c: 'planets',
  mars: 'planets', mars_b: 'planets',
  jupiter: 'planets',
  saturn: 'planets', saturn_ring: 'planets',
  uranus: 'planets', uranus_ring: 'planets',
  neptune: 'planets',
  pluto: 'planets',
};

function run() {
  if (!existsSync(LEGACY)) {
    console.log('legacy/solar-bodies.html not found — skipping.');
    console.log('Textures must be extracted locally before committing.');
    process.exit(0);
  }

  const html = readFileSync(LEGACY, 'utf-8');

  // Find the IMG object via regex
  const imgMatch = html.match(/const\s+IMG\s*=\s*\{([\s\S]*?)\};/);
  if (!imgMatch) {
    console.error('Could not find IMG object in legacy file.');
    process.exit(1);
  }

  // Extract key-value pairs: "key": "data:image/...;base64,..."
  const pairRe = /"([^"]+)"\s*:\s*"(data:image\/(jpeg|png);base64,([^"]*))/g;
  const meta = {};
  let count = 0;
  let match;

  while ((match = pairRe.exec(imgMatch[1])) !== null) {
    const [, key, , ext, b64] = match;
    const fileExt = ext === 'jpeg' ? 'jpg' : 'png';
    const group = GROUP_MAP[key] || 'moons';
    const outDir = join(OUT, group);
    const outPath = join(outDir, `${key}.${fileExt}`);

    mkdirSync(outDir, { recursive: true });

    const buf = Buffer.from(b64, 'base64');
    writeFileSync(outPath, buf);

    meta[key] = {
      path: `/${outPath.replace(/\\/g, '/')}`,
      colorSpace: LINEAR_KEYS.has(key) ? 'linear' : 'srgb',
      ext: fileExt,
      bytes: buf.length,
    };

    count++;
    console.log(`  ✓ ${key} → ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  // Write metadata
  const metaPath = join(OUT, 'textures-meta.json');
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  console.log(`\nExtracted ${count} textures.`);
  console.log(`Metadata: ${metaPath}`);
}

run();
