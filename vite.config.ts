import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This exposes the API_KEY to the client-side code to match your existing code structure
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});