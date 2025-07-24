import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env variables into import.meta.env
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      'process.env': env // Optional, if you need process.env compatibility
    },
    optimizeDeps: {
      include: ['crypto-js']
    },
    server: {
      port: 5173,
      proxy: {
        '/socket.io': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          ws: true
        }
      }
    }
  };
});
