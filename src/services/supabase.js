import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://itokltjrkzqmbbagjnme.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_hqJIezaDpWiy6kHjoabvEg_3_scOStB';

// Initialize Supabase Client
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

/**
 * Record weekly digest newsletter subscriber in Supabase
 */
export const subscribeToNewsletter = async (email) => {
  if (!email || !email.includes('@')) return { success: false, error: 'Invalid email' };

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.trim().toLowerCase(),
          source: 'wilt_footer_digest',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase newsletter subscription info:', error.message);
      // Fallback local storage save so no user signup is lost
      saveLocalNewsletter(email);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('Supabase newsletter catch:', err);
    saveLocalNewsletter(email);
    return { success: true, fallback: true };
  }
};

/**
 * Save user post / knowledge slate entry to Supabase
 */
export const savePostToSupabase = async (post) => {
  if (!post) return { success: false };

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          id: post.id,
          title: post.title,
          category: post.category,
          tags: post.tags,
          summary: post.summary,
          content: post.content,
          author_name: post.author?.name || 'Anonymous Scholar',
          author_handle: post.author?.username || 'scholar',
          author_avatar: post.author?.avatar || '',
          key_takeaways: post.keyTakeaways || [],
          terms: post.terms || [],
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.warn('Supabase post insert info:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Supabase post catch:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch all posts from Supabase
 */
export const fetchPostsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch posts info:', error.message);
      return [];
    }

    // Map Supabase snake_case fields to app model
    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      tags: row.tags || [row.category],
      summary: row.summary,
      content: row.content,
      readTime: '2 min read',
      createdAt: 'Recently',
      likes: 0,
      savedCount: 0,
      author: {
        name: row.author_name,
        username: row.author_handle,
        avatar: row.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        university: 'University Student',
        major: 'Finance & Tech'
      },
      keyTakeaways: row.key_takeaways || [],
      terms: row.terms || []
    }));
  } catch (err) {
    console.warn('Supabase fetch posts catch:', err);
    return [];
  }
};

// Local storage fallback for newsletter
const saveLocalNewsletter = (email) => {
  try {
    const key = 'wilt_local_newsletter_v1';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {}
};
