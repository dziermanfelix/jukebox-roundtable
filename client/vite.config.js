import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { globalServerPort } from '../common/api';
import path from 'path';

export default ({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  return defineConfig({
    plugins: [react()],
    define: {
      'process.env': env,
    },
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
};
