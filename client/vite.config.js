import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { globalServerPort } from '../global/api';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${globalServerPort}/api`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
