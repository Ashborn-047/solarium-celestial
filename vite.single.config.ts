import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

function inlineTexturesPlugin(): Plugin {
  return {
    name: 'inline-textures-plugin',
    enforce: 'pre',
    transform(code, id) {
      if (!code.includes('/textures/')) return null;

      let count = 0;
      const transformed = code.replace(/['"]\/textures\/([^'"]+)['"]/g, (match, relPath) => {
        const fullPath = path.resolve('public/textures', relPath);
        if (fs.existsSync(fullPath)) {
          count++;
          const ext = path.extname(fullPath).toLowerCase();
          const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
          const b64 = fs.readFileSync(fullPath).toString('base64');
          return `"data:${mime};base64,${b64}"`;
        }
        return match;
      });

      if (count > 0) {
        console.log(`[inline-textures] Inlined ${count} textures in ${path.basename(id)}`);
        return { code: transformed, map: null };
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [inlineTexturesPlugin(), react(), glsl(), viteSingleFile()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist/single',
    rollupOptions: {
      input: {
        'black-hole': fileURLToPath(new URL('./single/black-hole.html', import.meta.url)),
        'solar-system': fileURLToPath(new URL('./single/solar-system.html', import.meta.url)),
        bodies: fileURLToPath(new URL('./single/bodies.html', import.meta.url)),
      },
    },
  },
});
