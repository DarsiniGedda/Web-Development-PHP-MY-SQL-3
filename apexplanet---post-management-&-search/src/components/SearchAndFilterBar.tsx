import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Filter, 
  Sparkles,
  Tag,
  CheckCircle2,
  FileEdit,
  Clock
} from 'lucide-react';
import { Category, FilterState, PostStatus, SearchScope, SortOption } from '../types';

interface SearchAndFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  categories: Category[];
  categoryCounts: Record<Category, number>;
  totalMatching: number;
  totalAll: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  categoryCounts,
  totalMatching,
  totalAll
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters = 
    Boolean(filters.searchQuery.trim()) || 
    filters.category !== 'All' || 
    filters.status !== 'all' || 
    filters.selectedTag !== null ||
    filters.sortBy !== 'newest' ||
    filters.searchScope !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 mb-6 transition-all">
      
      {/* Top Row: Search Input & Scope + Sort & Status Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Form with Scope Selector */}
        <div className="flex-1 relative flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>

            <input
              ref={searchInputRef}
              id="search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search posts by title or content... (Press '/' to focus)"
              className="w-full pl-11 pr-24 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />

            {/* Clear Search & Scope Badge inside input */}
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
              {filters.searchQuery && (
                <button
                  id="btn-clear-search"
                  type="button"
                  onClick={() => onFilterChange({ searchQuery: '' })}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/70 transition-colors"
                  title="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Scope selector */}
              <select
                id="search-scope-select"
                value={filters.searchScope}
                onChange={(e) => onFilterChange({ searchScope: e.target.value as SearchScope })}
                className="text-xs bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-2 rounded-lg border-0 cursor-pointer outline-none"
                title="Search Scope"
              >
                <option value="all">Everywhere</option>
                <option value="title">Title Only</option>
                <option value="content">Content Only</option>
                <option value="tags">Tags Only</option>
                <option value="author">Author Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter & Sort Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          
          {/* Status Select */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium hidden sm:inline">Status:</span>
            <select
              id="status-select"
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value as 'all' | PostStatus })}
              className="bg-transparent text-slate-800 font-semibold outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
              className="bg-transparent text-slate-800 font-semibold outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              onClick={onResetFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset all search queries and filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* Middle Row: Category Pills with Count Badges */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 shrink-0 uppercase tracking-wider pl-1">
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = filters.category === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                id={`btn-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onFilterChange({ category: cat })}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tag Filter indicator (if any tag is active) */}
      {filters.selectedTag && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs text-emerald-800">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filtered by tag: <strong>#{filters.selectedTag}</strong></span>
          <button
            onClick={() => onFilterChange({ selectedTag: null })}
            className="ml-auto text-emerald-700 hover:text-emerald-950 font-bold"
          >
            Clear tag
          </button>
        </div>
      )}

      {/* Search Query Feedback & Results Counter Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span>
            Found <strong className="text-slate-800 font-bold">{totalMatching}</strong> post{totalMatching !== 1 ? 's' : ''}
            {filters.searchQuery.trim() && (
              <> matching &ldquo;<span className="text-emerald-700 font-semibold">{filters.searchQuery}</span>&rdquo;</>
            )}
            {filters.category !== 'All' && (
              <> in category <span className="text-emerald-700 font-semibold">{filters.category}</span></>
            )}
          </span>
        </div>

        {totalMatching < totalAll && (
          <span className="text-slate-400">
            ({totalAll - totalMatching} hidden by filters)
          </span>
        )}
      </div>

    </div>
  );
};
