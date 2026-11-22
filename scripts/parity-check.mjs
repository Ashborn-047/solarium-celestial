import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const parityDir = path.resolve(rootDir, 'docs', 'parity');

if (!fs.existsSync(parityDir)) {
  fs.mkdirSync(parityDir, { recursive: true });
}

const tests = [
  {
    name: 'black-hole',
    legacyUrl: (base) => `${base}/legacy/gargantua-black-hole.html?freeze=1`,
    modernRoute: '/black-hole?freeze=1',
  },
  {
    name: 'solar-system',
    legacyUrl: (base) => `${base}/legacy/solar-system.html?freeze=1`,
    modernRoute: '/solar-system?freeze=1',
  },
  {
    name: 'solar-bodies',
    legacyUrl: (base) => `${base}/legacy/solar-bodies.html?freeze=1`,
    modernRoute: '/bodies?freeze=1',
  },
];

const viewports = [
  { label: 'desktop', width: 1280, height: 800 },
  { label: 'mobile', width: 390, height: 844 },
];

async function run() {
  console.log('Starting Vite local server...');
  const server = await createServer({
    root: rootDir,
    appType: 'spa',
    server: { port: 5174 },
  });
  await server.listen();
  const baseUrl = 'http://localhost:5174';
  console.log(`Vite listening at ${baseUrl}`);

  console.log('Launching Chromium with SwiftShader...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--no-sandbox',
      '--disable-web-security',
    ],
  });

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const test of tests) {
      console.log(`Capturing ${test.name} [${vp.label}] legacy...`);
      try {
        await page.goto(test.legacyUrl(baseUrl), { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);
        const legacyFile = path.join(parityDir, `${test.name}-${vp.label}-legacy.png`);
        await page.screenshot({ path: legacyFile, timeout: 60000 });
        console.log(`  -> Saved ${legacyFile}`);
      } catch (err) {
        console.warn(`  ! Failed legacy ${test.name}:`, err.message);
      }

      console.log(`Capturing ${test.name} [${vp.label}] modern...`);
      try {
        await page.goto(`${baseUrl}${test.modernRoute}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);
        const modernFile = path.join(parityDir, `${test.name}-${vp.label}-modern.png`);
        await page.screenshot({ path: modernFile, timeout: 60000 });
        console.log(`  -> Saved ${modernFile}`);
      } catch (err) {
        console.warn(`  ! Failed modern ${test.name}:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();
  await server.close();
  console.log('Parity check completed! Screenshots saved to docs/parity/');
}

run().catch((err) => {
  console.error('Parity check failed:', err);
  process.exit(1);
});
