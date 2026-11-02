import { defineConfig, loadEnv } from 'vite';
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

    // Same for /api/reviews (reads REVIEWS_SCRIPT_URL / REVIEWS_SECRET from your .env.local if set)
    server.middlewares.use('/api/reviews', async (req, res) => {
      const send = (status, body) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      };
      try {
        const reviews = await server.ssrLoadModule('/server/reviews.js');
        if (req.method === 'POST') {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          const result = await reviews.submitReview(JSON.parse(raw || '{}'), 'dev');
          return send(result.status, result.body);
        }
        return send(200, await reviews.listReviews());
      } catch (err) {
        return send(502, { error: String(err), reviews: [] });
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  // Make server-only secrets in .env.local visible to the dev API (not to the browser)
  const env = loadEnv(mode, process.cwd(), '');
  for (const k of ['REVIEWS_SCRIPT_URL', 'REVIEWS_SECRET']) if (env[k] && !process.env[k]) process.env[k] = env[k];
  return {
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
};
});
