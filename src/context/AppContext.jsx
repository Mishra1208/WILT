import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initStorage,
  getStoredPosts,
  savePost as storageSavePost,
  getStoredConcepts,
  saveConcept as storageSaveConcept,
  getStoredLeaderboard
} from '../services/storage';
import { 
  savePostToSupabase, 
  fetchPostsFromSupabase,
  saveConceptToSupabase,
  fetchConceptsFromSupabase,
  saveCommentToSupabase,
  saveAttachmentToSupabase
} from '../services/supabase';
import { getOrCreateGuestUser } from '../context/AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize storage seeds and fetch remote Supabase posts & concepts
  useEffect(() => {
    initStorage();
    
    // 1. Fetch remote posts from Supabase
    fetchPostsFromSupabase().then((remotePosts) => {
      if (remotePosts && remotePosts.length > 0) {
        setPosts((current) => {
          const merged = current.map((local) => {
            const remote = remotePosts.find((r) => r.id === local.id);
            if (!remote) return local;
            return {
              ...local,
              ...remote,
              attachments: (remote.attachments && remote.attachments.length > 0) ? remote.attachments : (local.attachments || []),
              comments: (remote.comments && remote.comments.length >= (local.comments || []).length) ? remote.comments : (local.comments || [])
            };
          });

          remotePosts.forEach((remote) => {
            if (!merged.some((m) => m.id === remote.id)) {
              merged.push(remote);
            }
          });

          return merged;
        });
      }
    });

    // 2. Fetch remote concepts from Supabase
    fetchConceptsFromSupabase().then((remoteConcepts) => {
      if (remoteConcepts && remoteConcepts.length > 0) {
        setConcepts((current) => {
          const merged = [...remoteConcepts];
          current.forEach((c) => {
            if (!merged.some((m) => m.term.toLowerCase() === c.term.toLowerCase())) {
              merged.push(c);
            }
          });
          return merged;
        });
      }
    });
  }, []);

  const getViewFromPath = () => {
    try {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase().trim();
      const validViews = [
        'notepad', 'discover', 'dictionary', 'quiz', 'knowledge-quest', 'quest',
        'leaderboard', 'revision', 'saved', 'about',
        'notifications', 'settings', 'privacy', 'terms', 'standards'
      ];
      if (path === 'knowledge-quest' || path === 'quest') return 'knowledge-quest';
      if (validViews.includes(path)) {
        return path;
      }
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page) {
        if (page === 'knowledge-quest' || page === 'quest') return 'knowledge-quest';
        if (validViews.includes(page)) return page;
      }
    } catch (e) {}
    return 'notepad';
  };

  const [currentView, setCurrentViewState] = useState(getViewFromPath);

  const setCurrentView = (newView, replace = false) => {
    const normalizedView = (newView === 'quest' || newView === 'knowledge-quest') ? 'knowledge-quest' : newView;
    setCurrentViewState(normalizedView);
    try {
      const targetPath = normalizedView === 'notepad' ? '/' : `/${normalizedView}`;
      if (window.location.pathname !== targetPath) {
        if (replace) {
          window.history.replaceState({ view: normalizedView }, '', targetPath);
        } else {
          window.history.pushState({ view: normalizedView }, '', targetPath);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handlePopState = () => {
      const view = getViewFromPath();
      setCurrentViewState(view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [posts, setPosts] = useState(() => getStoredPosts());
  const [concepts, setConcepts] = useState(() => getStoredConcepts());
  const [leaderboard, setLeaderboard] = useState(() => getStoredLeaderboard());

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isNewConceptModalOpen, setIsNewConceptModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [highlightSnippet, setHighlightSnippet] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  const createPost = (newPostData) => {
    const post = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      category: newPostData.category || "General Knowledge",
      tags: newPostData.tags || [newPostData.category],
      author: newPostData.author,
      readTime: `${Math.max(1, Math.ceil((newPostData.content?.length || 100) / 400))} min read`,
      createdAt: "Just now",
      timestamp: Date.now(),
      likes: 0,
      savedCount: 0,
      summary: newPostData.summary,
      content: newPostData.content,
      sourceUrl: newPostData.sourceUrl || "",
      sourceContext: newPostData.sourceContext || "",
      attachments: newPostData.attachments || [],
      keyTakeaways: newPostData.keyTakeaways || [],
      terms: newPostData.terms || []
    };

    const updated = storageSavePost(post);
    setPosts(updated);
    setIsNewPostModalOpen(false);

    // Save directly to Supabase cloud database
    savePostToSupabase(post);
    if (newPostData.attachments && newPostData.attachments.length > 0) {
      newPostData.attachments.forEach((att) => {
        saveAttachmentToSupabase(post.id, att);
      });
    }

    // If terms were extracted, ensure they exist in peer dictionary
    if (newPostData.terms && newPostData.terms.length > 0) {
      newPostData.terms.forEach(term => {
        const exists = concepts.some(c => c.term.toLowerCase() === term.toLowerCase());
        if (!exists) {
          const autoConcept = {
            id: `concept-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            term: term,
            category: newPostData.category,
            definition: `Core concept introduced in "${post.title}".`,
            plainExplanation: newPostData.summary || "Shared by peer community.",
            formula: "",
            examples: `Used in ${post.title}`,
            relatedPostId: post.id,
            contributor: newPostData.author?.username || "peer"
          };
          const updatedConcepts = storageSaveConcept(autoConcept);
          setConcepts(updatedConcepts);
        }
      });
    }

    return post;
  };

  const createConcept = (newConceptData) => {
    const concept = {
      id: `concept-${Date.now()}`,
      term: newConceptData.term,
      category: newConceptData.category || "General",
      definition: newConceptData.definition,
      plainExplanation: newConceptData.plainExplanation,
      formula: newConceptData.formula || "",
      examples: newConceptData.examples || "",
      relatedPostId: newConceptData.relatedPostId || null,
      contributor: newConceptData.contributor || "peer"
    };
    const updated = storageSaveConcept(concept);
    setConcepts(updated);
    setIsNewConceptModalOpen(false);

    // Save to Supabase cloud database
    saveConceptToSupabase(concept);
    return concept;
  };

  const toggleLike = (postId, user) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const hasLiked = user?.likedPosts?.includes(postId);
          return {
            ...p,
            likes: hasLiked ? Math.max(0, p.likes - 1) : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const addCommentToPost = (postId, commentText, currentUser) => {
    if (!commentText.trim()) return false;

    const activeUser = currentUser || getOrCreateGuestUser();
    let targetUpdatedPost = null;

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const currentComments = p.comments || [];
          const newComment = {
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            author: {
              name: `@${activeUser.username}`,
              username: activeUser.username,
              avatar: activeUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              role: activeUser.major || 'Student Scholar'
            },
            text: commentText.trim(),
            createdAt: 'Just now'
          };

          const updatedPost = {
            ...p,
            comments: [...currentComments, newComment]
          };

          targetUpdatedPost = updatedPost;

          if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updatedPost);
          }

          storageSavePost(updatedPost);
          savePostToSupabase(updatedPost);
          saveCommentToSupabase(postId, newComment);

          return updatedPost;
        }
        return p;
      })
    );

    if (targetUpdatedPost) {
      try {
        const bc = new BroadcastChannel('wilt_comments_channel');
        bc.postMessage({ type: 'SYNC_POST', post: targetUpdatedPost });
        bc.close();
      } catch (e) {}
    }

    return true;
  };

  // Cross-browser & real-time comment sync effect
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('wilt_comments_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'SYNC_POST' && event.data.post) {
          const syncedPost = event.data.post;
          setPosts((prev) =>
            prev.map((p) => (p.id === syncedPost.id ? syncedPost : p))
          );
          if (selectedPost && selectedPost.id === syncedPost.id) {
            setSelectedPost(syncedPost);
          }
        }
      };
    } catch (e) {}

    // Polling interval to sync comments from remote devices/browsers
    const intervalId = setInterval(() => {
      fetchPostsFromSupabase().then((remotePosts) => {
        if (remotePosts && remotePosts.length > 0) {
          setPosts((current) => {
            let hasChanges = false;
            const updatedList = current.map((localPost) => {
              const remote = remotePosts.find((r) => r.id === localPost.id);
              if (remote) {
                const localCommentsCount = (localPost.comments || []).length;
                const remoteComments = remote.comments || [];
                const mergedAttachments = (remote.attachments && remote.attachments.length > 0) ? remote.attachments : (localPost.attachments || []);

                if (remoteComments.length > localCommentsCount || (remote.attachments && remote.attachments.length > (localPost.attachments || []).length)) {
                  hasChanges = true;
                  const mergedPost = {
                    ...localPost,
                    ...remote,
                    attachments: mergedAttachments,
                    comments: remoteComments.length >= localCommentsCount ? remoteComments : (localPost.comments || [])
                  };
                  if (selectedPost && selectedPost.id === localPost.id) {
                    setSelectedPost(mergedPost);
                  }
                  return mergedPost;
                }
              }
              return localPost;
            });
            return hasChanges ? updatedList : current;
          });
        }
      });
    }, 3000);

    return () => {
      if (bc) bc.close();
      clearInterval(intervalId);
    };
  }, [selectedPost?.id]);

  const openPostDetail = (post, snippet = null) => {
    setSelectedPost(post);
    setHighlightSnippet(snippet);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setHighlightSnippet(null);
  };

  // Saved Items Management (Posts & News)
  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const raw = localStorage.getItem('wilt_saved_posts_v6');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedNewsArticles, setSavedNewsArticles] = useState(() => {
    try {
      const raw = localStorage.getItem('wilt_saved_news_v6');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleSavePost = (postId) => {
    setSavedPostIds((prev) => {
      const updated = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      localStorage.setItem('wilt_saved_posts_v6', JSON.stringify(updated));
      return updated;
    });
  };

  const isPostSaved = (postId) => savedPostIds.includes(postId);

  const toggleSaveNews = (article) => {
    setSavedNewsArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      const updated = exists ? prev.filter((a) => a.id !== article.id) : [...prev, article];
      localStorage.setItem('wilt_saved_news_v6', JSON.stringify(updated));
      return updated;
    });
  };

  const isNewsSaved = (articleId) => savedNewsArticles.some((a) => a.id === articleId);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        posts,
        setPosts,
        concepts,
        setConcepts,
        leaderboard,
        setLeaderboard,
        isNewPostModalOpen,
        setIsNewPostModalOpen,
        isNewConceptModalOpen,
        setIsNewConceptModalOpen,
        selectedPost,
        highlightSnippet,
        openPostDetail,
        closePostDetail,
        createPost,
        createConcept,
        toggleLike,
        addCommentToPost,
        savedPostIds,
        savedNewsArticles,
        toggleSavePost,
        isPostSaved,
        toggleSaveNews,
        isNewsSaved
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
