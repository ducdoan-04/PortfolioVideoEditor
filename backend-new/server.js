require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware bảo mật
app.use(helmet());

// Logging
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse JSON và URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Đã tạo thư mục uploads tại: ${uploadsDir}`);
}

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file video và hình ảnh!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Kết nối MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'video_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Đã kết nối MySQL thành công');
    connection.release();
  } catch (err) {
    console.error('❌ Lỗi kết nối MySQL:', err.message);
    process.exit(1);
  }
}

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
  }
  next();
};

// API routes
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Server đang hoạt động', timestamp: new Date().toISOString() }));

app.get('/api/videos', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;

  let sql = 'SELECT * FROM videos WHERE 1=1';
  let countSql = 'SELECT COUNT(*) as total FROM videos WHERE 1=1';
  let params = [];
  let countParams = [];

  if (category) {
    sql += ' AND category = ?';
    countSql += ' AND category = ?';
    params.push(category);
    countParams.push(category);
  }

  if (search) {
    sql += ' AND (title LIKE ? OR description LIKE ?)';
    countSql += ' AND (title LIKE ? OR description LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam);
    countParams.push(searchParam, searchParam);
  }

  sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [videos] = await pool.execute(sql, params);
  const [countResult] = await pool.execute(countSql, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: { videos, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
}));

app.get('/api/videos/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const [videos] = await pool.execute(
    'SELECT * FROM videos WHERE category = ? ORDER BY id ASC LIMIT ? OFFSET ?',
    [category, limit, offset]
  );

  const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM videos WHERE category = ?', [category]);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: { videos, category, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
}));

app.get('/api/videos/featured', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const [videos] = await pool.execute('SELECT * FROM videos ORDER BY views DESC, likes DESC, id ASC LIMIT ?', [limit]);
  res.json({ success: true, data: videos });
}));

app.get('/api/videos/recent', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const [videos] = await pool.execute('SELECT * FROM videos ORDER BY id ASC LIMIT ?', [limit]);
  res.json({ success: true, data: videos });
}));

app.get('/api/videos/search', asyncHandler(async (req, res) => {
  const { q, category, sortBy = 'id', order = 'ASC' } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM videos WHERE 1=1';
  let countSql = 'SELECT COUNT(*) as total FROM videos WHERE 1=1';
  let params = [];
  let countParams = [];

  if (q) {
    sql += ' AND (title LIKE ? OR description LIKE ? OR software LIKE ?)';
    countSql += ' AND (title LIKE ? OR description LIKE ? OR software LIKE ?)';
    const searchParam = `%${q}%`;
    params.push(searchParam, searchParam, searchParam);
    countParams.push(searchParam, searchParam, searchParam);
  }

  if (category) {
    sql += ' AND category = ?';
    countSql += ' AND category = ?';
    params.push(category);
    countParams.push(category);
  }

  const allowedSortFields = ['id', 'created_at', 'views', 'likes', 'title'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'id';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  sql += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [videos] = await pool.execute(sql, params);
  const [countResult] = await pool.execute(countSql, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: { videos, searchQuery: q, category, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
}));

app.get('/api/stats', asyncHandler(async (req, res) => {
  const [totalVideos] = await pool.execute('SELECT COUNT(*) as total FROM videos');
  const [totalViews] = await pool.execute('SELECT SUM(views) as total FROM videos');
  const [totalLikes] = await pool.execute('SELECT SUM(likes) as total FROM videos');
  const [totalCategories] = await pool.execute('SELECT COUNT(*) as total FROM categories');
  const [categoryStats] = await pool.execute(`
    SELECT category, COUNT(*) as count, SUM(views) as total_views, SUM(likes) as total_likes
    FROM videos WHERE category IS NOT NULL GROUP BY category ORDER BY count DESC
  `);

  res.json({
    success: true,
    data: {
      overview: {
        totalVideos: totalVideos[0].total,
        totalViews: totalViews[0].total || 0,
        totalLikes: totalLikes[0].total || 0,
        totalCategories: totalCategories[0].total,
      },
      categoryStats,
    },
  });
}));

app.get('/api/categories', asyncHandler(async (req, res) => {
  const [categories] = await pool.execute(`
    SELECT id, name, description, color, created_at FROM categories -- Sử dụng các cột thực tế
    WHERE name IS NOT NULL AND name != '' ORDER BY id ASC
  `);
  res.json({ success: true, data: categories });
}));

app.get('/api/videos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [videos] = await pool.execute('SELECT * FROM videos WHERE id = ?', [id]);
  if (videos.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
  res.json({ success: true, data: videos[0] });
}));

app.post('/api/videos', upload.single('thumbnail'), asyncHandler(async (req, res) => {
  const { title, description, video_id, category, software } = req.body;
  
  if (!title || !video_id) {
    return res.status(400).json({ success: false, message: 'Title and video_id are required' });
  }

  let thumbnail_url = null;
  if (req.file) {
    thumbnail_url = `/uploads/${req.file.filename}`;
  }

  const [result] = await pool.execute(
    'INSERT INTO videos (title, description, video_id, category, software, thumbnail_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [title, description, video_id, category, software, thumbnail_url]
  );
  
  res.status(201).json({
    success: true,
    message: 'Thêm video thành công',
    data: { id: result.insertId, title, description, video_id, category, software, thumbnail_url },
  });
}));

app.put('/api/videos/:id', upload.single('thumbnail'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, video_id, category, software } = req.body;
  
  // Check if video exists
  const [existing] = await pool.execute('SELECT id FROM videos WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }

  let thumbnail_url = null;
  if (req.file) {
    thumbnail_url = `/uploads/${req.file.filename}`;
  }

  const updateFields = [];
  const updateValues = [];

  if (title) {
    updateFields.push('title = ?');
    updateValues.push(title);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    updateValues.push(description);
  }
  if (video_id) {
    updateFields.push('video_id = ?');
    updateValues.push(video_id);
  }
  if (software !== undefined) {
    updateFields.push('software = ?');
    updateValues.push(software);
  }
  if (category !== undefined) {
    updateFields.push('category = ?');
    updateValues.push(category);
  }
  if (thumbnail_url) {
    updateFields.push('thumbnail_url = ?');
    updateValues.push(thumbnail_url);
  }

  updateFields.push('updated_at = NOW()');
  updateValues.push(id);

  const sql = `UPDATE videos SET ${updateFields.join(', ')} WHERE id = ?`;
  await pool.execute(sql, updateValues);

  res.json({ success: true, message: 'Cập nhật video thành công' });
}));

app.delete('/api/videos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [result] = await pool.execute('DELETE FROM videos WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy video' });
  res.json({ success: true, message: 'Xóa video thành công' });
}));

app.post('/api/upload', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Upload file thành công',
    data: { filename: req.file.filename, originalname: req.file.originalname, size: req.file.size, url: fileUrl },
  });
}));

// Admin Login
app.post('/api/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], handleValidationErrors, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check user in database
    const [users] = await pool.execute(
      'SELECT id, username, password, role, is_active FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: `User '${username}' not found in database`
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: `Account '${username}' is deactivated`
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Access denied. User '${username}' has role '${user.role}' but admin role is required.`
      });
    }

    // Simple password check (in production, use bcrypt)
    if (password === 'admin123') {
      const token = `admin-token-${user.id}-${Date.now()}`;
      res.json({
        success: true,
        message: `Login successful! Welcome ${user.username} (${user.role})`,
        token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: `Invalid password for user '${username}'`
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
}));

// Admin Token Verification
app.get('/api/admin/verify', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  const token = authHeader.substring(7);
  
  // Simple token verification (in production, use JWT)
  if (token.startsWith('admin-token-')) {
    res.json({ success: true, message: 'Token is valid' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}));

app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File quá lớn (tối đa 50MB)' });
  }
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Đã xảy ra lỗi' : error.message,
  });
});

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'API endpoint không tồn tại' }));

// Start server
async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📁 Static files: http://localhost:${PORT}/uploads`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error.message);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n⏹️ Đang tắt server...');
  await pool.end();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('\n⏹️ Đang tắt server...');
  await pool.end();
  process.exit(0);
});

startServer();