import React, { useState, useEffect, useMemo } from 'react';
import { 
  Category, 
  FilterState, 
  PaginationState, 
  Post, 
  PostStatus, 
  ViewMode,
  Comment
} from './types';
import { INITIAL_POSTS } from './data/initialPosts';
import { Header } from './components/Header';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { PaginationControls } from './components/PaginationControls';
import { PostCard } from './components/PostCard';
import { PostTableView } from './components/PostTableView';
import { PostModal } from './components/PostModal';
import { PostFormModal } from './components/PostFormModal';
import { PhpMySqlCodeInspector } from './components/PhpMySqlCodeInspector';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { TaskMilestoneBanner } from './components/TaskMilestoneBanner';
import { exportPostsToCsv, exportPostsToJson } from './utils/helpers';
import { 
  FileQuestion, 
  Plus, 
  RotateCcw, 
  Search, 
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Code2
} from 'lucide-react';

const STORAGE_KEY = 'apexplanet_posts_data_v1';

const ALL_CATEGORIES: Category[] = [
  'All',
  'PHP & MySQL',
  'Full Stack Web',
  'Database & SQL',
  'Frontend & UI',
  'Security & Auth',
  'DevOps & Cloud',
  'API & Architecture'
];

export default function App() {
  // 1. Core Posts State with LocalStorage Persistence
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load posts from storage', err);
    }
    return INITIAL_POSTS;
  });

  // Save to LocalStorage whenever posts change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Failed to save posts to storage', err);
    }
  }, [posts]);

  // 2. View Mode State
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // 3. Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    searchScope: 'all',
    category: 'All',
    status: 'all',
    selectedTag: null,
    sortBy: 'newest'
  });

  // 4. Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  // 5. Toast Feedback Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 6. Modal States
  const [readPost, setReadPost] = useState<Post | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState<boolean>(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Filter change handler that resets page to 1
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      searchScope: 'all',
      category: 'All',
      status: 'all',
      selectedTag: null,
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      'All': posts.length,
      'PHP & MySQL': 0,
      'Full Stack Web': 0,
      'Database & SQL': 0,
      'Frontend & UI': 0,
      'Security & Auth': 0,
      'DevOps & Cloud': 0,
      'API & Architecture': 0
    };

    posts.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, [posts]);

  // Filter and Sort Pipeline
  const filteredAndSortedPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Search Query filter across selected scope
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        let matches = false;

        if (filters.searchScope === 'all') {
          matches = 
            post.title.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.author.name.toLowerCase().includes(query) ||
            post.tags.some(t => t.toLowerCase().includes(query));
        } else if (filters.searchScope === 'title') {
          matches = post.title.toLowerCase().includes(query);
        } else if (filters.searchScope === 'content') {
          matches = post.content.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query);
        } else if (filters.searchScope === 'tags') {
          matches = post.tags.some(t => t.toLowerCase().includes(query));
        } else if (filters.searchScope === 'author') {
          matches = post.author.name.toLowerCase().includes(query);
        }

        if (!matches) return false;
      }

      // 2. Category filter
      if (filters.category !== 'All' && post.category !== filters.category) {
        return false;
      }

      // 3. Status filter
      if (filters.status !== 'all' && post.status !== filters.status) {
        return false;
      }

      // 4. Tag filter
      if (filters.selectedTag && !post.tags.includes(filters.selectedTag)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [posts, filters]);

  // Total pages and clamped page
  const totalItems = filteredAndSortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Clamp current page if filters reduced total items
  const validCurrentPage = Math.min(currentPage, totalPages);

  // Paginated subset of posts for the current view
  const paginatedPosts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredAndSortedPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPosts, validCurrentPage, itemsPerPage]);

  const paginationState: PaginationState = {
    currentPage: validCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages
  };

  // CRUD Actions
  const handleCreateOrUpdatePost = (postData: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    if (postData.id) {
      // Update existing post
      setPosts(prev => prev.map(p => {
        if (p.id === postData.id) {
          return {
            ...p,
            ...postData,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      }));
      showToast('Article updated successfully!');
    } else {
      // Create new post
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        views: 1,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPosts(prev => [newPost, ...prev]);
      showToast('New article published successfully!');
    }
  };

  const handleDuplicatePost = (post: Post) => {
    const duplicate: Post = {
      ...post,
      id: `post-${Date.now()}`,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy`,
      views: 0,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPosts(prev => [duplicate, ...prev]);
    showToast('Post duplicated successfully!');
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleteCandidateId(null);
    if (readPost?.id === id) setReadPost(null);
    showToast('Post deleted.');
  };

  const handleBulkDelete = (ids: string[]) => {
    setPosts(prev => prev.filter(p => !ids.includes(p.id)));
    showToast(`${ids.length} posts deleted.`);
  };

  const handleBulkStatusChange = (ids: string[], status: PostStatus) => {
    setPosts(prev => prev.map(p => {
      if (ids.includes(p.id)) {
        return { ...p, status, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    showToast(`Updated status of ${ids.length} posts to "${status}".`);
  };

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleViewPost = (post: Post) => {
    // Increment view count on open
    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    }));
    setReadPost({ ...post, views: post.views + 1 });
  };

  const handleAddComment = (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedComments = [newComment, ...(p.comments || [])];
        return { ...p, comments: updatedComments };
      }
      return p;
    }));

    if (readPost && readPost.id === postId) {
      setReadPost({
        ...readPost,
        comments: [newComment, ...(readPost.comments || [])]
      });
    }

    showToast('Comment posted!');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all posts to default dataset? Your custom edits will be refreshed.')) {
      setPosts(INITIAL_POSTS);
      handleResetFilters();
      showToast('Dataset reset to default sample articles.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-22 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenNewPost={() => {
          setEditingPost(null);
          setIsFormOpen(true);
        }}
        onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
        onResetData={handleResetData}
        onExportData={() => exportPostsToJson(posts)}
        posts={posts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Task 3 Milestone Banner */}
        <TaskMilestoneBanner />

        {/* 2. Search & Filter Bar (Task 3 Objective 1) */}
        <SearchAndFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          categories={ALL_CATEGORIES}
          categoryCounts={categoryCounts}
          totalMatching={totalItems}
          totalAll={posts.length}
        />

        {/* 3. Posts Listing Area */}
        {paginatedPosts.length > 0 ? (
          <div>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    searchQuery={filters.searchQuery}
                    onView={handleViewPost}
                    onEdit={(p) => {
                      setEditingPost(p);
                      setIsFormOpen(true);
                    }}
                    onDelete={(id) => setDeleteCandidateId(id)}
                    onDuplicate={handleDuplicatePost}
                    onLike={handleLikePost}
                    onTagClick={(tag) => handleFilterChange({ selectedTag: tag })}
                  />
                ))}
              </div>
            ) : (
              <PostTableView
                posts={paginatedPosts}
                searchQuery={filters.searchQuery}
                onView={handleViewPost}
                onEdit={(p) => {
                  setEditingPost(p);
                  setIsFormOpen(true);
                }}
                onDelete={(id) => setDeleteCandidateId(id)}
                onBulkDelete={handleBulkDelete}
                onBulkStatusChange={handleBulkStatusChange}
                onTagClick={(tag) => handleFilterChange({ selectedTag: tag })}
              />
            )}

            {/* 4. Pagination Controls (Task 3 Objective 2) */}
            <PaginationControls
              pagination={paginationState}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              onItemsPerPageChange={(limit) => {
                setItemsPerPage(limit);
                setCurrentPage(1);
              }}
            />
          </div>
        ) : (
          /* Empty Search & Filter State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4 my-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200">
              <FileQuestion className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">No matching posts found</h3>
              <p className="text-xs text-slate-500">
                {filters.searchQuery
                  ? `No articles match "${filters.searchQuery}" in ${filters.category !== 'All' ? filters.category : 'any category'}.`
                  : 'There are currently no articles matching the selected filters.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Clear Search &amp; Filters
              </button>
              <button
                onClick={() => {
                  setEditingPost(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Post</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">ApexPlanet Software Pvt Ltd</span>
            <span>&bull;</span>
            <span>Web Development Internship (PHP &amp; MySQL)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setIsCodeInspectorOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>PHP / MySQL Snippets</span>
            </button>
            <button
              onClick={() => exportPostsToCsv(posts)}
              className="hover:text-slate-900"
            >
              Export CSV
            </button>
            <button
              onClick={() => exportPostsToJson(posts)}
              className="hover:text-slate-900"
            >
              Export JSON
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Post Reader Modal */}
      <PostModal
        post={readPost}
        onClose={() => setReadPost(null)}
        onEdit={(p) => {
          setReadPost(null);
          setEditingPost(p);
          setIsFormOpen(true);
        }}
        onLike={handleLikePost}
        onAddComment={handleAddComment}
        onTagClick={(tag) => handleFilterChange({ selectedTag: tag })}
      />

      {/* 2. Post Form Modal (Create / Edit) */}
      <PostFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPost(null);
        }}
        onSave={handleCreateOrUpdatePost}
        initialPost={editingPost}
        categories={ALL_CATEGORIES}
      />

      {/* 3. PHP & MySQL Code Reference Modal */}
      <PhpMySqlCodeInspector
        isOpen={isCodeInspectorOpen}
        onClose={() => setIsCodeInspectorOpen(false)}
      />

      {/* 4. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteCandidateId)}
        title="Delete this post?"
        message="Are you sure you want to delete this article? This action will remove the record from your dataset."
        onConfirm={() => deleteCandidateId && handleDeletePost(deleteCandidateId)}
        onCancel={() => setDeleteCandidateId(null)}
      />

    </div>
  );
}
