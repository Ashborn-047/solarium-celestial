import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.resolve(rootDir, 'dist', 'single');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const entries = [
  { name: 'black-hole', input: 'single/black-hole.html' },
  { name: 'solar-system', input: 'single/solar-system.html' },
  { name: 'bodies', input: 'single/bodies.html' },
];

async function main() {
  console.log('Building standalone single-file HTML distributions...\n');

  for (const entry of entries) {
    const tempDir = path.resolve(outDir, `_temp_${entry.name}`);
    await build({
      configFile: path.resolve(rootDir, 'vite.single.config.ts'),
      build: {
        outDir: tempDir,
        emptyOutDir: true,
        rollupOptions: {
          input: path.resolve(rootDir, entry.input),
          output: {
            inlineDynamicImports: true,
          },
        },
      },
    });

    const srcFile = path.resolve(tempDir, entry.input);
    const destFile = path.resolve(outDir, `${entry.name}.html`);
    fs.copyFileSync(srcFile, destFile);
    fs.rmSync(tempDir, { recursive: true, force: true });

    const stats = fs.statSync(destFile);
    const mb = stats.size / (1024 * 1024);
    console.log(`\n✓ Generated ${entry.name}.html: ${mb.toFixed(2)} MB (${stats.size} bytes)`);
    if (mb > 16) {
      console.error(`❌ File ${entry.name}.html exceeds 16 MB limit!`);
      process.exit(1);
    }
  }

  console.log('\nTesting file:// URL opening in headless browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
  });

  const page = await browser.newPage();
  for (const entry of entries) {
    const filePath = path.resolve(outDir, `${entry.name}.html`);
    const fileUrl = `file:///${filePath.replace(/\\/g, '/')}?freeze=1`;
    console.log(`Checking file:// opening for ${entry.name}.html...`);
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    console.log(`  ✓ Successfully opened and rendered ${entry.name}.html`);
  }

  await browser.close();
  console.log('\nAll single-file builds successfully verified!');
}

main().catch((err) => {
  console.error('Build single failed:', err);
  process.exit(1);
});
