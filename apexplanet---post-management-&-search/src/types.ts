export type PostStatus = 'published' | 'draft' | 'archived';

export type Category = 
  | 'All'
  | 'PHP & MySQL'
  | 'Full Stack Web'
  | 'Database & SQL'
  | 'Frontend & UI'
  | 'Security & Auth'
  | 'DevOps & Cloud'
  | 'API & Architecture';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
  likes?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  readingTimeMinutes: number;
  featured?: boolean;
  comments: Comment[];
}

export type SortOption = 'newest' | 'oldest' | 'views' | 'likes' | 'title-asc' | 'title-desc';

export type SearchScope = 'all' | 'title' | 'content' | 'tags' | 'author';

export interface FilterState {
  searchQuery: string;
  searchScope: SearchScope;
  category: Category;
  status: 'all' | PostStatus;
  selectedTag: string | null;
  sortBy: SortOption;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export type ViewMode = 'cards' | 'table';
