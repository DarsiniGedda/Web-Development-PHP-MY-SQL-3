import React from 'react';
import { 
  Plus, 
  Code2, 
  LayoutGrid, 
  Table as TableIcon, 
  Download, 
  RotateCcw, 
  Sparkles,
  BookOpenCheck,
  FileText
} from 'lucide-react';
import { ViewMode, Post } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  onOpenNewPost: () => void;
  onOpenCodeInspector: () => void;
  onResetData: () => void;
  onExportData: () => void;
  posts: Post[];
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenNewPost,
  onOpenCodeInspector,
  onResetData,
  onExportData,
  posts
}) => {
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;
  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);

  return (
    <header className="bg-slate-900 border-b border-emerald-900/40 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Task Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* ApexPlanet stylized wing/leaf emblem */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-400/30">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" opacity="0.2" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    Apex<span className="text-emerald-400">Planet</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                    Software Pvt Ltd
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Task 3 : Search & Pagination
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Web Development (PHP &amp; MySQL) &bull; Advanced Features
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Metrics Bar on Desktop */}
            <div className="hidden lg:flex items-center space-x-4 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total: <strong className="text-white">{posts.length}</strong></span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Published: <strong className="text-emerald-300">{publishedCount}</strong></span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Drafts: <strong className="text-amber-300">{draftCount}</strong></span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                id="btn-view-grid"
                onClick={() => onToggleViewMode('cards')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'cards'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-table"
                onClick={() => onToggleViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table / List View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* PHP & MySQL Code Reference Button */}
            <button
              id="btn-open-code-inspector"
              onClick={onOpenCodeInspector}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-950 text-teal-300 border border-teal-700/60 hover:bg-teal-900/80 hover:text-teal-200 transition-all cursor-pointer shadow-sm"
              title="View PHP & MySQL Backend Code & Schema"
            >
              <Code2 className="w-4 h-4 text-teal-400" />
              <span>PHP / MySQL Code</span>
            </button>

            {/* Export & Reset Dropdown Actions */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                id="btn-export-posts"
                onClick={onExportData}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Export Posts to JSON/CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                id="btn-reset-data"
                onClick={onResetData}
                className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset to Default Posts Dataset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Create Post Button */}
            <button
              id="btn-create-new-post"
              onClick={onOpenNewPost}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 hover:shadow-emerald-600/30 transition-all cursor-pointer transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Post</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
