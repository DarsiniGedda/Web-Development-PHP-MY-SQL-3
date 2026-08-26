import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowRight
} from 'lucide-react';
import { PaginationState } from '../types';

interface PaginationControlsProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onItemsPerPageChange
}) => {
  const { currentPage, itemsPerPage, totalItems, totalPages } = pagination;
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with ellipses
  const getPageNumbers = () => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (typeof i === 'number') {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPageInput('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Left: Items Info & Items Per Page Selector */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center space-x-1.5 font-medium">
          <span>Showing</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {startItem}–{endItem}
          </span>
          <span>of</span>
          <span className="font-bold text-slate-900">{totalItems}</span>
          <span>posts</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Per page:</span>
          <select
            id="items-per-page-select"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
          >
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={18}>18</option>
          </select>
        </div>
      </div>

      {/* Middle: Numbered Navigation & Previous / Next Controls */}
      <div className="flex items-center gap-1">
        
        {/* First Page */}
        <button
          id="btn-first-page"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          id="btn-prev-page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 font-medium text-xs pr-2.5"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-slate-400 font-medium select-none text-xs"
                >
                  &hellip;
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                id={`btn-page-${page}`}
                onClick={() => onPageChange(Number(page))}
                className={`min-w-[34px] h-[34px] text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          id="btn-next-page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 font-medium text-xs pl-2.5"
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          id="btn-last-page"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

      </div>

      {/* Right: Direct Page Jump */}
      {totalPages > 2 && (
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500">Go to:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPageInput}
            onChange={(e) => setJumpPageInput(e.target.value)}
            placeholder={String(currentPage)}
            className="w-12 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="p-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 rounded-lg transition-colors"
            title="Jump to Page"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

    </div>
  );
};
