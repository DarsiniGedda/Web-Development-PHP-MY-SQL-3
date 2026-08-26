import { Post } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Mastering Advanced Search & Pagination in PHP and MySQL',
    slug: 'mastering-advanced-search-pagination-php-mysql',
    excerpt: 'Learn how to build efficient, secure SQL search queries using PDO prepared statements, full-text indexes, and offset/keyset pagination algorithms.',
    content: `Search and pagination are two essential pillars of modern web applications. When working with large datasets in PHP and MySQL, poorly constructed queries can lead to catastrophic performance bottlenecks and SQL injection vulnerabilities.

### 1. Constructing Dynamic Search Queries
Instead of string concatenation, always utilize parameterized PDO statements. Here is an optimal pattern:

\`\`\`php
$sql = "SELECT * FROM posts WHERE status = 'published'";
$params = [];

if (!empty($search)) {
    $sql .= " AND (title LIKE :search_title OR content LIKE :search_content)";
    $params[':search_title'] = "%" . $search . "%";
    $params[':search_content'] = "%" . $search . "%";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
\`\`\`

### 2. Implementing Limit & Offset Pagination
To ensure fast rendering, compute the total matching records using a fast \`COUNT(*)\` query, determine the offset via \`$offset = ($page - 1) * $limit;\`, and bind the integer limits:

\`\`\`php
$totalStmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE " . $whereClause);
$totalStmt->execute($params);
$totalRows = $totalStmt->fetchColumn();
$totalPages = ceil($totalRows / $limit);
\`\`\`

### 3. User Experience Best Practices
- Debounce real-time keystrokes to prevent spamming the database.
- Highlight matching search terms in the rendered cards.
- Retain filter parameters in the URL query string for shareable search states.`,
    category: 'PHP & MySQL',
    tags: ['PHP', 'MySQL', 'PDO', 'Pagination', 'Search'],
    author: {
      name: 'Aditya Sharma',
      role: 'Lead Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-20T10:30:00Z',
    updatedAt: '2026-08-25T14:15:00Z',
    views: 1420,
    likes: 98,
    readingTimeMinutes: 6,
    featured: true,
    comments: [
      {
        id: 'c1',
        author: 'Pooja Reddy',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'The PDO parameter binding example saved me so much debugging time on Task 3! Great explanation.',
        createdAt: '2026-08-21T09:12:00Z'
      },
      {
        id: 'c2',
        author: 'Rohan Gupta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Do you recommend Keyset pagination for tables with over 1M records?',
        createdAt: '2026-08-22T16:45:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Building Resilient RESTful APIs with PHP 8 and Clean Architecture',
    slug: 'building-resilient-rest-apis-php-8',
    excerpt: 'A comprehensive guide on creating modular, clean REST endpoints with proper HTTP status codes, structured JSON responses, and centralized exception handling.',
    content: `When designing modern web services, building clean API endpoints that decouple business logic from the database layer is critical.

### Key Highlights:
- **HTTP Status Codes:** Never return 200 OK for validation failures. Use 400 Bad Request, 401 Unauthorized, 404 Not Found, and 422 Unprocessable Entity.
- **Dependency Injection:** Inject repositories and service classes into controllers for testability.
- **Middleware Pipeline:** Handle CORS, JWT verification, and rate limiting seamlessly before reaching controller handlers.`,
    category: 'API & Architecture',
    tags: ['PHP', 'REST API', 'Backend', 'Architecture', 'Clean Code'],
    author: {
      name: 'Priya Nair',
      role: 'Software Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-18T08:00:00Z',
    updatedAt: '2026-08-22T11:00:00Z',
    views: 890,
    likes: 64,
    readingTimeMinutes: 5,
    featured: false,
    comments: []
  },
  {
    id: 'post-3',
    title: 'MySQL Indexing Strategies: B-Trees, Full-Text, and Query Optimization',
    slug: 'mysql-indexing-strategies-optimization',
    excerpt: 'Deep dive into EXPLAIN query plans, composite indexes, and how B-Tree indexes speed up WHERE clauses, ORDER BY sorts, and JOIN conditions.',
    content: `Without proper indexing, queries against large tables will execute expensive full table scans. In this guide, we analyze how MySQL manages indexes under the hood.

### Understanding EXPLAIN Output
Run \`EXPLAIN SELECT ...\` before deploying any complex search query. Check:
1. **type:** 'ALL' indicates a full table scan; aim for 'ref', 'range', or 'const'.
2. **key:** Shows which index was chosen by the query optimizer.
3. **rows:** Estimated rows MySQL needs to examine.

### Composite Indexes & Column Ordering
Always place high-cardinality equality columns first, followed by range condition columns.`,
    category: 'Database & SQL',
    tags: ['MySQL', 'SQL', 'Indexing', 'Performance', 'Database'],
    author: {
      name: 'Vikram Mehta',
      role: 'Database Administrator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-15T14:20:00Z',
    updatedAt: '2026-08-24T09:30:00Z',
    views: 2150,
    likes: 182,
    readingTimeMinutes: 7,
    featured: true,
    comments: [
      {
        id: 'c3',
        author: 'Sneha Patel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Adding a composite index on (status, created_at) reduced our query time from 420ms to 4ms!',
        createdAt: '2026-08-16T10:15:00Z'
      }
    ]
  },
  {
    id: 'post-4',
    title: 'Defending Web Applications Against OWASP Top 10 Vulnerabilities',
    slug: 'defending-web-apps-owasp-top-10',
    excerpt: 'Step-by-step security hardening for web applications: SQL injection mitigation, XSS sanitization, CSRF token validation, and secure password hashing.',
    content: `Security is non-negotiable. Web developers must implement defensive coding standards from day one.

### Core Safeguards:
- **SQL Injection:** Never inject user variables into SQL strings. Always use prepared statements with PDO or MySQLi.
- **Cross-Site Scripting (XSS):** Escape all output using \`htmlspecialchars($data, ENT_QUOTES, 'UTF-8')\`.
- **Password Security:** Use \`password_hash($pwd, PASSWORD_ARGON2ID)\` and verify using \`password_verify()\`.
- **CSRF Protection:** Generate cryptographically secure random session tokens for state-changing POST requests.`,
    category: 'Security & Auth',
    tags: ['Security', 'OWASP', 'XSS', 'SQL Injection', 'Auth'],
    author: {
      name: 'Neha Roy',
      role: 'Security Consultant',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-12T11:10:00Z',
    updatedAt: '2026-08-20T16:00:00Z',
    views: 1670,
    likes: 145,
    readingTimeMinutes: 8,
    featured: false,
    comments: []
  },
  {
    id: 'post-5',
    title: 'Modern UI/UX Design Systems: Typography, Spacing, and Component Hierarchy',
    slug: 'modern-ui-ux-design-systems-typography',
    excerpt: 'Explore how mathematical typographic scales, cohesive color palettes, and structured component boundaries elevate web user experience.',
    content: `Great interfaces feel intuitive and responsive. A cohesive design system provides clear visual signals that guide users through complex workflows like filtering, data editing, and modal navigation.

### Visual Polish Pillars:
1. **Mathematical Spacing:** Use consistent 4px and 8px grid increments for padding and margins.
2. **Typographic Hierarchy:** Balance bold display headings with highly readable body copy.
3. **Interactive Feedback:** Supply crisp hover, active, and focus rings to enhance keyboard accessibility.`,
    category: 'Frontend & UI',
    tags: ['UI/UX', 'Design System', 'Tailwind', 'CSS', 'Accessibility'],
    author: {
      name: 'Karan Joshi',
      role: 'Senior Product Designer',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-19T13:40:00Z',
    views: 1210,
    likes: 110,
    readingTimeMinutes: 4,
    featured: false,
    comments: []
  },
  {
    id: 'post-6',
    title: 'Containerizing PHP, Nginx, and MySQL with Docker Compose for Seamless Dev',
    slug: 'containerizing-php-nginx-mysql-docker-compose',
    excerpt: 'Set up an isolated, reproducible development environment with hot-reloading, phpMyAdmin, and automated database migrations using Docker.',
    content: `Stop troubleshooting environment mismatch issues between team members. Docker Compose lets you define your web server, PHP runtime, and MySQL database in a single declarative file.

### Multi-Container Setup:
- **Nginx:** Handles reverse proxying and fastcgi parameter passing.
- **PHP-FPM:** Executes PHP scripts in a clean Alpine container.
- **MySQL 8.0:** Mounts persistent volumes to keep your data safe between container rebuilds.`,
    category: 'DevOps & Cloud',
    tags: ['Docker', 'DevOps', 'PHP-FPM', 'Nginx', 'MySQL'],
    author: {
      name: 'Rohan Gupta',
      role: 'DevOps Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-08T15:30:00Z',
    updatedAt: '2026-08-18T10:00:00Z',
    views: 940,
    likes: 72,
    readingTimeMinutes: 6,
    featured: false,
    comments: []
  },
  {
    id: 'post-7',
    title: 'Implementing Full-Text Search in MySQL for Lightning-Fast Queries',
    slug: 'implementing-fulltext-search-mysql',
    excerpt: 'Discover the power of MATCH() AGAINST() in MySQL for natural language search, boolean search mode, and relevance scoring over standard LIKE queries.',
    content: `While \`LIKE '%keyword%'\` works fine for small tables, it cannot use standard B-Tree indexes and causes table scans. MySQL Full-Text Search generates an inverted index for lightning-fast keyword matching.

### Creating Full-Text Index:
\`\`\`sql
ALTER TABLE posts ADD FULLTEXT(title, content);

SELECT id, title, MATCH(title, content) AGAINST('+MySQL +PHP' IN BOOLEAN MODE) AS score
FROM posts
WHERE MATCH(title, content) AGAINST('+MySQL +PHP' IN BOOLEAN MODE)
ORDER BY score DESC;
\`\`\`
This boosts search performance by up to 100x on large document sets.`,
    category: 'Database & SQL',
    tags: ['MySQL', 'Search', 'Full-Text', 'SQL', 'Optimization'],
    author: {
      name: 'Vikram Mehta',
      role: 'Database Administrator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-08-16T15:20:00Z',
    views: 1830,
    likes: 130,
    readingTimeMinutes: 5,
    featured: false,
    comments: []
  },
  {
    id: 'post-8',
    title: 'Full-Stack CRUD Application Architecture with Real-Time State Sync',
    slug: 'fullstack-crud-app-architecture-state-sync',
    excerpt: 'A blueprint for structuring interactive CRUD applications: modal state management, optimistic UI updates, schema validation, and persistent storage.',
    content: `Building reliable CRUD operations requires handling edge cases gracefully: empty states, form validation errors, network latency, and instant user feedback.

### Architectural Rules:
1. **Single Source of Truth:** Centralize your posts state and derive filtered/paginated subsets dynamically.
2. **Optimistic Updates:** Reflect additions and deletions immediately in the UI while syncing with storage.
3. **Undo and Recovery:** Provide quick recovery mechanisms or confirm dialogs before permanent deletes.`,
    category: 'Full Stack Web',
    tags: ['CRUD', 'React', 'TypeScript', 'State Management', 'Web Dev'],
    author: {
      name: 'Aditya Sharma',
      role: 'Lead Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-08-02T10:15:00Z',
    updatedAt: '2026-08-14T12:00:00Z',
    views: 1120,
    likes: 88,
    readingTimeMinutes: 6,
    featured: false,
    comments: []
  },
  {
    id: 'post-9',
    title: 'Draft: Understanding Database Sharding and Horizontal Partitioning',
    slug: 'understanding-database-sharding-partitioning',
    excerpt: 'Notes and architectural diagrams exploring hash-based vs range-based sharding for petabyte-scale relational databases.',
    content: `Draft notes on partitioning large MySQL tables by date ranges and tenant IDs to keep index sizes manageable in RAM.`,
    category: 'Database & SQL',
    tags: ['MySQL', 'Sharding', 'Scaling', 'Architecture'],
    author: {
      name: 'Vikram Mehta',
      role: 'Database Administrator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    status: 'draft',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
    views: 45,
    likes: 4,
    readingTimeMinutes: 3,
    featured: false,
    comments: []
  },
  {
    id: 'post-10',
    title: 'Draft: ApexPlanet Web Development Internship Guide & Best Practices',
    slug: 'apexplanet-web-dev-internship-guide',
    excerpt: 'Detailed milestones for Task 1 through Task 5: from environment setup, CRUD creation, Search & Pagination, to final secure deployment.',
    content: `Welcome to the ApexPlanet Web Development Internship Program!
    
### Tasks Overview:
- **Task 1:** Setup Development Environment (PHP, MySQL, Apache/Nginx, VS Code, Git)
- **Task 2:** Basic CRUD Application (Create, Read, Update, Delete posts with database storage)
- **Task 3:** Advanced Features Implementation (Search functionality by title/content, dynamic pagination, and responsive UI enhancements)
- **Task 4:** Security Enhancements (Input sanitization, prepared statements, auth checks)
- **Task 5:** Final Project & Certification!`,
    category: 'Full Stack Web',
    tags: ['Internship', 'ApexPlanet', 'Web Dev', 'Tasks', 'PHP', 'MySQL'],
    author: {
      name: 'Aditya Sharma',
      role: 'Lead Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    status: 'draft',
    createdAt: '2026-07-28T09:30:00Z',
    updatedAt: '2026-07-28T09:30:00Z',
    views: 120,
    likes: 18,
    readingTimeMinutes: 4,
    featured: false,
    comments: []
  },
  {
    id: 'post-11',
    title: 'JavaScript Asynchronous Patterns: Callbacks, Promises, and Async/Await',
    slug: 'javascript-async-patterns-promises-async-await',
    excerpt: 'Master the event loop, microtask queues, error handling with try/catch, and parallel execution with Promise.all() in modern TypeScript/JS.',
    content: `Understanding how JavaScript handles non-blocking I/O operations is essential for building fluid user interfaces that search and filter data seamlessly without freezing the main thread.`,
    category: 'Frontend & UI',
    tags: ['JavaScript', 'TypeScript', 'Async', 'Frontend', 'Promises'],
    author: {
      name: 'Sneha Patel',
      role: 'Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-07-25T14:00:00Z',
    updatedAt: '2026-08-10T16:00:00Z',
    views: 1530,
    likes: 114,
    readingTimeMinutes: 5,
    featured: false,
    comments: []
  },
  {
    id: 'post-12',
    title: 'Implementing JWT Authentication with Refresh Tokens in PHP and MySQL',
    slug: 'jwt-auth-refresh-tokens-php-mysql',
    excerpt: 'Secure stateless authentication implementation: access tokens, rotating refresh tokens stored in HTTP-only cookies, and revocation tables.',
    content: `JSON Web Tokens (JWT) offer a lightweight way to transmit authenticated claims between client and server. Learn how to sign, verify, and rotate tokens securely.`,
    category: 'Security & Auth',
    tags: ['JWT', 'Auth', 'PHP', 'Security', 'Tokens'],
    author: {
      name: 'Neha Roy',
      role: 'Security Consultant',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    createdAt: '2026-07-20T11:45:00Z',
    updatedAt: '2026-08-05T09:00:00Z',
    views: 1780,
    likes: 156,
    readingTimeMinutes: 7,
    featured: false,
    comments: []
  }
];
