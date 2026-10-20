import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
  },
  build: {
    rollupOptions: {
      output: {
        // Separate long-lived vendor chunks: they download in parallel and stay
        // cached in students' browsers across WILT deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
          if (id.includes('@clerk')) return 'vendor-auth';
          if (id.includes('@supabase')) return 'vendor-db';
          return undefined;
        }
      }
    }
  }
});
