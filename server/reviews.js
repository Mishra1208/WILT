/**
 * WILT reviews, stored in a Google Sheet (no Supabase usage).
 *
 * The sheet is reached through a small Google Apps Script web app (see
 * docs/reviews-apps-script.gs). Its URL and a shared secret live in Vercel
 * environment variables, so students' browsers never see them:
 *   REVIEWS_SCRIPT_URL   the Apps Script "Web app" URL
 *   REVIEWS_SECRET       any long random string, same value in the script
 *
 * New reviews are saved with Approved = no. Only rows an owner marks "yes"
 * are shown on the site.
 */
import { validateContent } from '../src/services/moderation.js';

const scriptUrl = () => process.env.REVIEWS_SCRIPT_URL || '';
const secret = () => process.env.REVIEWS_SECRET || '';

export const isConfigured = () => Boolean(scriptUrl() && secret());

const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

// ---------- read (approved only), cached for a few minutes ----------

let cache = { at: 0, data: null };
const CACHE_MS = 5 * 60 * 1000;

export const listReviews = async () => {
  if (!isConfigured()) return { configured: false, reviews: [] };
  if (cache.data && Date.now() - cache.at < CACHE_MS) return cache.data;

  const res = await fetch(`${scriptUrl()}?secret=${encodeURIComponent(secret())}`, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Sheet returned ${res.status}`);
  const body = await res.json();
  const reviews = (body.reviews || [])
    .map((r) => ({
      id: String(r.id || r.timestamp || Math.random()),
      name: clean(r.name, 40) || 'WILT student',
      college: clean(r.college, 60),
      rating: Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5))),
      text: clean(r.review, 500),
      createdAt: r.timestamp || null
    }))
    .filter((r) => r.text)
    .sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));

  const data = { configured: true, reviews };
  cache = { at: Date.now(), data };
  return data;
};

// ---------- write (goes in unapproved) ----------

const recent = new Map(); // ip -> last submit time, simple spam brake

export const submitReview = async (input = {}, ip = 'unknown') => {
  if (!isConfigured()) return { status: 503, body: { error: 'Reviews are not switched on yet.' } };

  const last = recent.get(ip) || 0;
  if (Date.now() - last < 60 * 1000) {
    return { status: 429, body: { error: 'Please wait a minute before sending another review.' } };
  }

  const name = clean(input.name, 40);
  const college = clean(input.college, 60);
  const review = clean(input.review, 500);
  const rating = Math.round(Number(input.rating));
  const userId = clean(input.userId, 80);

  if (!name) return { status: 400, body: { error: 'Please add your name.' } };
  if (!(rating >= 1 && rating <= 5)) return { status: 400, body: { error: 'Please pick a star rating.' } };
  if (review.length < 20) return { status: 400, body: { error: 'Please write at least a sentence (20+ characters).' } };

  const check = validateContent(name, college, review);
  if (!check.isClean) return { status: 400, body: { error: check.reason || 'Please keep it respectful.' } };

  const res = await fetch(scriptUrl(), {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script reads e.postData.contents
    body: JSON.stringify({ secret: secret(), name, college, rating, review, userId })
  });
  if (!res.ok) return { status: 502, body: { error: 'Could not save your review right now. Please try again.' } };

  recent.set(ip, Date.now());
  return { status: 200, body: { ok: true } };
};
