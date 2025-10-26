import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
            changeOrigin: false,
            ws: true,
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                if (req.headers.host) {
                  proxyReq.setHeader('host', req.headers.host);
                }
              });
            },
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './client'),
          '@shared': path.resolve(__dirname, './shared'),
        }
      }
});
