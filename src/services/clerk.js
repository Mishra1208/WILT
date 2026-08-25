// Clerk Authentication Configuration
export const CLERK_PUBLISHABLE_KEY = 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
  'pk_test_bXV0dWFsLWJ1bGxkb2ctNTUyNC5jbGVyay5hY2NvdW50cy5kZXYk';

export const isClerkConfigured = () => {
  return typeof CLERK_PUBLISHABLE_KEY === 'string' && CLERK_PUBLISHABLE_KEY.startsWith('pk_');
};
