import { defineConfig } from 'vite';
import electron from 'vite-electron-plugin';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: 'build/dist',
  },
  plugins: [
    svgr({ exportAsDefault: true }),
    electron({
      include: ['electron'],
      outDir: 'build/dist-electron',
    }),
  ],
  server: {
    host: '0.0.0.0',
  },
});
