import React, { useState } from 'react';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  Square,
  ArrowUpDown,
  ExternalLink,
  Tag,
  CheckCircle2,
  FileEdit,
  Archive,
  Download
} from 'lucide-react';
import { Post, PostStatus } from '../types';
import { formatDate, highlightText } from '../utils/helpers';

interface PostTableViewProps {
  posts: Post[];
  searchQuery: string;
  onView: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onBulkDelete: (postIds: string[]) => void;
  onBulkStatusChange: (postIds: string[], status: PostStatus) => void;
  onTagClick: (tag: string) => void;
}

export const PostTableView: React.FC<PostTableViewProps> = ({
  posts,
  searchQuery,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkStatusChange,
  onTagClick
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    onBulkDelete(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: PostStatus) => {
    if (selectedIds.length === 0) return;
    onBulkStatusChange(selectedIds, status);
    setSelectedIds([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-xs">
              {selectedIds.length}
            </span>
            <span>selected posts</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleBulkStatus('published')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg font-medium transition-colors"
            >
              Set as Published
            </button>
            <button
              onClick={() => handleBulkStatus('draft')}
              className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 rounded-lg font-medium transition-colors"
            >
              Set as Draft
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="p-4 w-12 text-center">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {selectedIds.length === posts.length && posts.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th scope="col" className="py-3 px-4 min-w-[280px]">Article &amp; Summary</th>
              <th scope="col" className="py-3 px-4">Category</th>
              <th scope="col" className="py-3 px-4">Author</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4 text-center">Metrics</th>
              <th scope="col" className="py-3 px-4">Date</th>
              <th scope="col" className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => {
              const isSelected = selectedIds.includes(post.id);

              return (
                <tr
                  key={post.id}
                  id={`table-row-${post.id}`}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSelectOne(post.id)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Thumbnail & Title/Excerpt */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.coverImage}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <button
                          onClick={() => onView(post)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left line-clamp-1 transition-colors"
                        >
                          {highlightText(post.title, searchQuery)}
                        </button>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {highlightText(post.excerpt, searchQuery)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {post.category}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-800">
                        {post.author.name}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {post.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Published
                      </span>
                    ) : post.status === 'draft' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                        Archived
                      </span>
                    )}
                  </td>

                  {/* Metrics */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1" title={`${post.views} views`}>
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1 text-rose-600" title={`${post.likes} likes`}>
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        {post.likes}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(post.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onView(post)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(post)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(post.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
