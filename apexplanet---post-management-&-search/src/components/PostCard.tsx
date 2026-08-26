import React, { useState } from 'react';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { Post } from '../types';
import { formatDate, formatRelativeTime, highlightText } from '../utils/helpers';

interface PostCardProps {
  post: Post;
  searchQuery: string;
  onView: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onDuplicate: (post: Post) => void;
  onLike: (postId: string) => void;
  onTagClick: (tag: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  searchQuery,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onLike,
  onTagClick
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike(post.id);
  };

  return (
    <div 
      id={`post-card-${post.id}`}
      className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Card Header & Image */}
      <div 
        onClick={() => onView(post)}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-md">
            {post.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
          {post.status === 'published' ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/40 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
              Published
            </span>
          ) : post.status === 'draft' ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-600/90 backdrop-blur-md text-white border border-amber-400/40 shadow-sm">
              Draft
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-slate-700/90 backdrop-blur-md text-slate-200 border border-slate-600 shadow-sm">
              Archived
            </span>
          )}
        </div>

        {/* Reading Time */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-900/80 backdrop-blur-sm text-slate-200">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>{post.readingTimeMinutes} min read</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2.5">
          {/* Post Title with Highlight */}
          <h3 
            onClick={() => onView(post)}
            className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {highlightText(post.title, searchQuery)}
          </h3>

          {/* Excerpt with Highlight */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {highlightText(post.excerpt, searchQuery)}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                <span>{tag}</span>
              </button>
            ))}
            {post.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Author, Engagement Metrics & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                {post.author.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          {/* Metrics & Context Menu */}
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            
            {/* View Count */}
            <div className="flex items-center gap-1 text-[11px]" title={`${post.views} views`}>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.views}</span>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-[11px] p-1 rounded-md transition-colors cursor-pointer ${
                liked ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-rose-500'
              }`}
              title="Like post"
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{post.likes}</span>
            </button>

            {/* Comments Count */}
            <div className="flex items-center gap-1 text-[11px]" title={`${post.comments?.length || 0} comments`}>
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.comments?.length || 0}</span>
            </div>

            {/* Action Dropdown */}
            <div className="relative">
              <button
                id={`btn-post-menu-${post.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Post Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 bottom-full mb-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 text-xs text-slate-700 font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onView(post);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 text-left"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Read Post</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit(post);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Edit Post</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDuplicate(post);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700 text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-teal-600" />
                      <span>Duplicate</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(post.id);
                      }}
                      className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 text-rose-600 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
