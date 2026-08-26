import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Database, 
  CheckCircle2, 
  Copy, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  FileCode 
} from 'lucide-react';

interface PhpMySqlCodeInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpMySqlCodeInspector: React.FC<PhpMySqlCodeInspectorProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'search' | 'pagination' | 'schema' | 'crud'>('search');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PHP_SEARCH_CODE = `<?php
/**
 * ApexPlanet Web Development Internship - Task 3: Search Functionality
 * File: api/search_posts.php
 * Description: Secure, parameterized search by title or content with PDO.
 */

header('Content-Type: application/json');
require_once 'config/db.php'; // PDO connection

$searchTerm = isset($_GET['q']) ? trim($_GET['q']) : '';
$category   = isset($_GET['category']) ? trim($_GET['category']) : '';
$status     = isset($_GET['status']) ? trim($_GET['status']) : 'published';

try {
    // 1. Base Query with SQL injection prevention
    $sql = "SELECT id, title, slug, excerpt, category, author_name, status, views, likes, created_at 
            FROM posts 
            WHERE 1=1";
    $params = [];

    // 2. Search by Title or Content (Task 3 Objective 1)
    if (!empty($searchTerm)) {
        $sql .= " AND (title LIKE :term_title OR content LIKE :term_content)";
        $params[':term_title']   = "%" . $searchTerm . "%";
        $params[':term_content'] = "%" . $searchTerm . "%";
    }

    // 3. Category & Status Filters
    if (!empty($category) && $category !== 'All') {
        $sql .= " AND category = :category";
        $params[':category'] = $category;
    }

    if (!empty($status) && $status !== 'all') {
        $sql .= " AND status = :status";
        $params[':status'] = $status;
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'count'   => count($results),
        'query'   => htmlspecialchars($searchTerm),
        'data'    => $results
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>`;

  const PHP_PAGINATION_CODE = `<?php
/**
 * ApexPlanet Web Development Internship - Task 3: Pagination Implementation
 * File: api/paginated_posts.php
 * Description: Limit & Offset mathematical calculation for dynamic page rendering.
 */

header('Content-Type: application/json');
require_once 'config/db.php';

$page         = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit        = isset($_GET['limit']) ? min(50, max(1, (int)$_GET['limit'])) : 8;
$searchTerm   = isset($_GET['q']) ? trim($_GET['q']) : '';

// 1. Calculate the SQL OFFSET
$offset = ($page - 1) * $limit;

try {
    // 2. Count Total Matching Records for Pagination Controls
    $countSql = "SELECT COUNT(*) as total FROM posts WHERE status = 'published'";
    $countParams = [];

    if (!empty($searchTerm)) {
        $countSql .= " AND (title LIKE :search_title OR content LIKE :search_content)";
        $countParams[':search_title'] = "%" . $searchTerm . "%";
        $countParams[':search_content'] = "%" . $searchTerm . "%";
    }

    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($countParams);
    $totalRows = (int)$countStmt->fetchColumn();

    // 3. Compute Total Pages
    $totalPages = ($totalRows > 0) ? (int)ceil($totalRows / $limit) : 1;

    // 4. Fetch Paginated Records with LIMIT and OFFSET
    $dataSql = "SELECT id, title, slug, excerpt, category, author_name, cover_image, status, views, likes, created_at 
                FROM posts 
                WHERE status = 'published'";

    if (!empty($searchTerm)) {
        $dataSql .= " AND (title LIKE :search_title OR content LIKE :search_content)";
    }

    $dataSql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($dataSql);

    // Bind search parameters if present
    foreach ($countParams as $key => $val) {
        $stmt->bindValue($key, $val, PDO::PARAM_STR);
    }
    // PDO integer binding for LIMIT and OFFSET
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'    => true,
        'pagination' => [
            'current_page' => $page,
            'limit'        => $limit,
            'total_items'  => $totalRows,
            'total_pages'  => $totalPages,
            'has_prev'     => ($page > 1),
            'has_next'     => ($page < $totalPages)
        ],
        'data' => $posts
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>`;

  const MYSQL_SCHEMA_CODE = `-- ========================================================
-- ApexPlanet Software Pvt Ltd - Web Development Internship
-- Task 2 & Task 3 Database Schema (MySQL 8.0 / MariaDB)
-- ========================================================

CREATE DATABASE IF NOT EXISTS apexplanet_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE apexplanet_blog;

-- 1. Posts Table (with FullText Index for advanced search)
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Web Development',
    tags VARCHAR(255) NULL,
    cover_image VARCHAR(500) NULL,
    author_name VARCHAR(100) NOT NULL DEFAULT 'ApexPlanet Intern',
    author_role VARCHAR(100) NOT NULL DEFAULT 'Web Developer',
    author_avatar VARCHAR(500) NULL,
    status ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'published',
    views INT UNSIGNED NOT NULL DEFAULT 0,
    likes INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Performance Indexes for Task 3 Search & Pagination:
    INDEX idx_category_status (category, status),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX ft_search_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author VARCHAR(100) NOT NULL,
    avatar VARCHAR(500) NULL,
    text TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const PHP_CRUD_CODE = `<?php
/**
 * ApexPlanet Web Development Internship - Task 2: CRUD Operations
 * File: api/posts_controller.php
 */

require_once 'config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // CREATE (POST)
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO posts (title, slug, excerpt, content, category, author_name, cover_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['excerpt'],
            $data['content'],
            $data['category'],
            $data['author_name'],
            $data['cover_image'],
            $data['status']
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    // READ (GET)
    case 'GET':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        }
        break;

    // UPDATE (PUT)
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE posts SET title = ?, excerpt = ?, content = ?, category = ?, status = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['excerpt'],
            $data['content'],
            $data['category'],
            $data['status'],
            $data['id']
        ]);
        echo json_encode(['success' => true]);
        break;

    // DELETE (DELETE)
    case 'DELETE':
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'search': return PHP_SEARCH_CODE;
      case 'pagination': return PHP_PAGINATION_CODE;
      case 'schema': return MYSQL_SCHEMA_CODE;
      case 'crud': return PHP_CRUD_CODE;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  ApexPlanet Internship Backend Reference
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-md">
                  PHP 8 &amp; MySQL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Task 3 Search &amp; Pagination + Task 2 CRUD SQL Implementation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>1. Search Queries (PHP)</span>
            </button>

            <button
              onClick={() => setActiveTab('pagination')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pagination'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Pagination Algorithm (PHP)</span>
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'schema'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>3. MySQL Schema (SQL)</span>
            </button>

            <button
              onClick={() => setActiveTab('crud')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer hidden sm:flex ${
                activeTab === 'crud'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>4. CRUD Controller</span>
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(getActiveCode())}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Body */}
        <div className="overflow-y-auto p-6 bg-slate-950 font-mono text-xs text-emerald-300/90 leading-relaxed max-h-[60vh]">
          <pre className="whitespace-pre overflow-x-auto selection:bg-emerald-900 selection:text-white">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Footer info from slide */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PDO prepared statements eliminate SQL Injection risks automatically.</span>
          </div>
          <span className="text-slate-500 font-medium">ApexPlanet Software &bull; Task 3 Submission Ready</span>
        </div>

      </div>
    </div>
  );
};
