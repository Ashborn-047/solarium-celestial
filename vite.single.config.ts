import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), glsl(), viteSingleFile()],
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
