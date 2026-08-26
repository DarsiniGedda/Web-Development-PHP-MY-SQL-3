import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Layers, 
  Layout, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export const TaskMilestoneBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/20 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-white">
                ApexPlanet Web Development &bull; TASK 3: Advanced Features
              </h2>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                100% Completed
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Search by title/content, dynamic limit/offset pagination, and responsive UI enhancements.
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-task-deliverables"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-xs font-semibold text-emerald-300 border border-emerald-700/50 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isExpanded ? 'Hide Task Spec' : 'View Task Deliverables'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-emerald-800/40 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Step 1 */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1. Search Functionality</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Real-time multi-scope search by title, content, tags, &amp; author with match highlighting, live debounce, and instant reset.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>2. Pagination Engine</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Configurable items per page (4, 6, 8, 12, 18), smart ellipsis page links, previous/next bounds, and direct jump to page.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3. User Interface &amp; CRUD</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Card &amp; Table views, full Create/Edit/Delete modals, interactive comments, likes, export to JSON/CSV, and PHP/MySQL inspector.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
