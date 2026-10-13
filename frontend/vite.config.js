import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const localApiUrl = env.VITE_LOCAL_API_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: localApiUrl,
          changeOrigin: true
        },
        '/uploads': {
          target: localApiUrl,
          changeOrigin: true
        }
      }
    }
  };
});
