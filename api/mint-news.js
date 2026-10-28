import { getMintNews } from '../server/mintFeed.js';

// GET /api/mint-news — every Mint story from the last 7 days, categorised.
// Vercel's CDN keeps the answer for 15 minutes, so Mint is asked at most
// a few times an hour no matter how many students open the page.
export default async function handler(req, res) {
  try {
    const data = await getMintNews();
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
    res.status(200).json(data);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Could not reach Mint right now', stories: [] });
  }
}
