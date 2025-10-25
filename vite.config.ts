import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      root: './client',
      build: {
        outDir: '../dist',
        emptyOutDir: true,
      },
      server: {
        port: 5000,
        host: '0.0.0.0',
        strictPort: true,
        allowedHosts: true,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.XAI_API_KEY),
        'process.env.XAI_API_KEY': JSON.stringify(env.XAI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './client'),
          '@shared': path.resolve(__dirname, './shared'),
        }
      }
    };
});
