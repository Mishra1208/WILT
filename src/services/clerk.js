// Clerk Authentication Configuration
//
// The publishable key should come from environment variables. Set it in
// Vercel → Project → Settings → Environment Variables:
//   VITE_CLERK_PUBLISHABLE_KEY = pk_live_...   (Production)
//   VITE_CLERK_PUBLISHABLE_KEY = pk_test_...   (Preview / local development)
//
// A pk_test_ key runs Clerk in Development mode (the "Development mode" badge,
// low user limits, shared dev OAuth credentials) — that's what pilot testers saw.
// Last-resort fallback (development instance) so the site never white-screens if
// the env var is missing. Production must override it with a pk_live_ key.
const DEV_FALLBACK_KEY = 'pk_test_bXV0dWFsLWJ1bGxkb2ctNTUyNC5jbGVyay5hY2NvdW50cy5kZXYk';

export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  DEV_FALLBACK_KEY;

export const isClerkConfigured = () =>
  typeof CLERK_PUBLISHABLE_KEY === 'string' && CLERK_PUBLISHABLE_KEY.startsWith('pk_');

export const isClerkDevelopmentKey = () =>
  typeof CLERK_PUBLISHABLE_KEY === 'string' && CLERK_PUBLISHABLE_KEY.startsWith('pk_test_');

if (import.meta.env.PROD) {
  if (isClerkDevelopmentKey()) {
    console.warn('[WILT] This production build is using a Clerk DEVELOPMENT key (pk_test_). Switch to your pk_live_ key in Vercel.');
  }
}
