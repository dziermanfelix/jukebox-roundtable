import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { globalServerPort } from '../common/api';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  return defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': env,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@common': path.resolve(__dirname, '../common'),
        '@utils': path.resolve(__dirname, '../utils'),
      },
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
