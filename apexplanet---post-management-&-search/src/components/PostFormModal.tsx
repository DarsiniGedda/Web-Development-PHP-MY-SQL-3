import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  Sparkles, 
  FileText, 
  Code, 
  List, 
  Heading1, 
  Heading2, 
  Quote,
  Check
} from 'lucide-react';
import { Category, Post, PostStatus } from '../types';
import { calculateReadingTime, slugify } from '../utils/helpers';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<Post, 'id' | 'views' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialPost?: Post | null;
  categories: Category[];
}

const PRESET_COVERS = [
  { label: 'Coding & PHP', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Database & SQL', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Web Dev & APIs', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80' },
  { label: 'Security & Shields', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80' },
  { label: 'UI & Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cloud & Docker', url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80' },
];

export const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPost,
  categories
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialPost?.id);

  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [category, setCategory] = useState<Category>(initialPost?.category || 'PHP & MySQL');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [coverImage, setCoverImage] = useState(
    initialPost?.coverImage || PRESET_COVERS[0].url
  );
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || 'published');
  const [authorName, setAuthorName] = useState(initialPost?.author.name || 'Darsini Gedda');
  const [authorRole, setAuthorRole] = useState(initialPost?.author.role || 'Web Development Intern');
  const [authorAvatar, setAuthorAvatar] = useState(
    initialPost?.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialPost?.tags || ['PHP', 'MySQL', 'WebDev']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto update slug when title changes in creation mode
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const insertSnippet = (snippet: string) => {
    setContent(prev => prev + '\n' + snippet + '\n');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!excerpt.trim()) errs.excerpt = 'A short excerpt or summary is required';
    if (!content.trim()) errs.content = 'Post content is required';
    if (!authorName.trim()) errs.authorName = 'Author name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const readingTimeMinutes = calculateReadingTime(content);

    onSave({
      id: initialPost?.id,
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      category: category === 'All' ? 'Full Stack Web' : category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags,
      coverImage: coverImage.trim() || PRESET_COVERS[0].url,
      status,
      readingTimeMinutes,
      author: {
        name: authorName.trim(),
        role: authorRole.trim() || 'Software Engineer',
        avatar: authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>{isEditing ? 'Edit Post' : 'Create New Article'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isEditing ? 'Update post details and content' : 'Add a new post to the database with tags, search indexes, and cover image'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 sm:px-8 py-6 space-y-5 text-slate-700 text-xs sm:text-sm">
          
          {/* Title & Slug */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Post Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Advanced Search & Pagination Techniques with PHP PDO"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 outline-none focus:bg-white focus:ring-3 focus:ring-emerald-500/20 ${
                  errors.title ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="slug-url-format"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 outline-none focus:border-emerald-500"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Excerpt / Brief Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A punchy 1-2 sentence preview for search results and cards..."
              className={`w-full px-4 py-2 bg-slate-50 border rounded-xl text-slate-800 outline-none focus:bg-white focus:ring-3 focus:ring-emerald-500/20 ${
                errors.excerpt ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {errors.excerpt && <p className="text-rose-500 text-xs mt-1">{errors.excerpt}</p>}
          </div>

          {/* Content with Quick Formatting Toolbar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Article Content <span className="text-rose-500">*</span>
              </label>

              {/* Formatting helper buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertSnippet('### New Subsection Header')}
                  className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                  title="Insert Heading"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('- Key takeaway point 1\n- Key takeaway point 2')}
                  className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                  title="Insert Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('```php\n// PDO Prepared Statement Search Query\n$stmt = $pdo->prepare("SELECT * FROM posts WHERE title LIKE ?");\n$stmt->execute(["%$search%"]);\n```')}
                  className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                  title="Insert Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full post content here. Supports headings (###), bullet points (-), and code snippets..."
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl font-normal text-slate-900 outline-none focus:bg-white focus:ring-3 focus:ring-emerald-500/20 ${
                errors.content ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {errors.content && <p className="text-rose-500 text-xs mt-1">{errors.content}</p>}
          </div>

          {/* Cover Image Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cover Image
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all group cursor-pointer ${
                    coverImage === preset.url ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-[10px] text-white py-0.5 text-center truncate px-1">
                    {preset.label}
                  </span>
                  {coverImage === preset.url && (
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Or paste custom image URL: https://..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag and press Enter"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-emerald-600 hover:text-rose-600 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status Radio */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Publication Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === 'published'}
                    onChange={() => setStatus('published')}
                    className="accent-emerald-600"
                  />
                  <span>Published</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="accent-amber-600"
                  />
                  <span>Draft</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value="archived"
                    checked={status === 'archived'}
                    onChange={() => setStatus('archived')}
                    className="accent-slate-600"
                  />
                  <span>Archived</span>
                </label>
              </div>
            </div>

          </div>

          {/* Author Details */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author Name"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Author Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Web Developer"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-post"
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish Article'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
