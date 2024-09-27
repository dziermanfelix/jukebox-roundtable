import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { serverPort } from '../global/api';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${serverPort}/api`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
