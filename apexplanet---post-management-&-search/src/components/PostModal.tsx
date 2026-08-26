import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Heart, 
  Eye, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Tag, 
  Edit3, 
  Send,
  User
} from 'lucide-react';
import { Post, Comment } from '../types';
import { formatDate, formatRelativeTime } from '../utils/helpers';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
  onEdit: (post: Post) => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onTagClick: (tag: string) => void;
}

export const PostModal: React.FC<PostModalProps> = ({
  post,
  onClose,
  onEdit,
  onLike,
  onAddComment,
  onTagClick
}) => {
  if (!post) return null;

  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setHasLiked(!hasLiked);
    onLike(post.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim()) return;

    onAddComment(post.id, {
      author: commentAuthor.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(commentAuthor.trim())}`,
      text: commentText.trim()
    });

    setCommentText('');
  };

  // Helper to render markdown-like formatted text nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-4 text-slate-700 leading-relaxed font-normal">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-slate-900 pt-3 pb-1 border-b border-slate-100">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-extrabold text-slate-900 pt-4 pb-2 border-b border-slate-200">
                {line.replace('## ', '')}
              </h2>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-black text-slate-900 pt-4 pb-2">
                {line.replace('# ', '')}
              </h1>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <li key={idx} className="ml-5 list-disc text-slate-700">
                {line.replace(/^[-*]\s+/, '')}
              </li>
            );
          }
          if (line.startsWith('```')) {
            return null; // Handle code blocks cleanly
          }
          if (line.includes('$') || line.includes('SELECT') || line.includes('WHERE') || line.includes('function')) {
            return (
              <pre key={idx} className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl font-mono text-xs overflow-x-auto my-2 border border-slate-800 shadow-inner">
                <code>{line}</code>
              </pre>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }
          return (
            <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-700">
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Action Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              &bull; {formatDate(post.createdAt)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Edit Post"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Copy Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-2"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-8">
          
          {/* Post Header */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author Profile & Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{post.author.name}</h4>
                  <p className="text-xs text-slate-500">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{post.views} views</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    hasLiked 
                      ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 max-h-[420px]">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt Lead */}
          <div className="bg-emerald-50/60 border-l-4 border-emerald-500 p-4 rounded-r-xl text-slate-700 italic text-sm sm:text-base leading-relaxed">
            &ldquo;{post.excerpt}&rdquo;
          </div>

          {/* Main Article Content */}
          <div className="prose prose-slate max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Tags &amp; Topics:
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onClose();
                    onTagClick(tag);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>#{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Comments ({post.comments?.length || 0})</span>
              </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative w-1/3">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    required
                    placeholder="Write a constructive comment or question..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full bg-slate-200 object-cover mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-700">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
