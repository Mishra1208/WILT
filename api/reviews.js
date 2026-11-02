import { listReviews, submitReview } from '../server/reviews.js';

// GET  /api/reviews  approved reviews (cached at the CDN for 5 minutes)
// POST /api/reviews  { name, college, rating, review, userId } saved as "not approved yet"
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await listReviews();
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
      const result = await submitReview(body, ip);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(result.status).json(result.body);
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'Reviews are unavailable right now.', reviews: [] });
  }
}
