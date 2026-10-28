import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In `npm run dev` there are no Vercel functions, so serve /api/mint-news
// from the same code the Vercel function uses.
const devApi = () => ({
  name: 'wilt-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/mint-news', async (_req, res) => {
      try {
        const { getMintNews } = await server.ssrLoadModule('/server/mintFeed.js');
        const data = await getMintNews();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } catch (err) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: String(err), stories: [] }));
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), devApi()],
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
          if (id.includes('/gsap/')) return 'vendor-motion';
          return undefined;
        }
      }
    }
  }
});
