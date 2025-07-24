const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    // Kết nối đến MySQL server (không chỉ định database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Đã kết nối MySQL server');

    // Tạo database nếu chưa có
    const dbName = process.env.DB_NAME || 'video_db';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' đã được tạo/đã tồn tại`);

    // Chọn database
    await connection.query(`USE ${dbName}`);

    // Tạo bảng videos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_id VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        thumbnail_url VARCHAR(500),
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        duration VARCHAR(20),
        software VARCHAR(255),
        subtitle VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_created_at (created_at),
        INDEX idx_video_id (video_id),
        INDEX idx_views (views),
        INDEX idx_likes (likes)
      )
    `);
    console.log('✅ Bảng videos đã được tạo');

    // Tạo bảng categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7) DEFAULT '#007bff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Bảng categories đã được tạo');

    // Thêm categories mẫu
    const categories = [
      ['Wedding', 'Video cưới hỏi', '#ff69b4'],
      ['Event', 'Video sự kiện', '#ffa500'],
      ['Corporate', 'Video doanh nghiệp', '#0066cc'],
      ['Music Video', 'Video âm nhạc', '#9932cc'],
      ['Commercial', 'Video quảng cáo', '#ff6347'],
      ['Documentary', 'Video tài liệu', '#228b22']
    ];

    for (const [name, description, color] of categories) {
      try {
        await connection.execute(
          'INSERT INTO categories (name, description, color) VALUES (?, ?, ?)',
          [name, description, color]
        );
        console.log(`✅ Đã thêm category: ${name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️ Category '${name}' đã tồn tại`);
        } else {
          throw err;
        }
      }
    }

    // Tạo view thống kê
    await connection.query(`
      CREATE OR REPLACE VIEW video_stats AS
      SELECT 
        category,
        COUNT(*) as total_videos,
        AVG(views) as avg_views,
        MAX(created_at) as latest_video
      FROM videos 
      WHERE category IS NOT NULL
      GROUP BY category
    `);
    console.log('✅ View video_stats đã được tạo');

    console.log('\n🎉 Khởi tạo database thành công!');
    console.log('📝 Bạn có thể chạy server bằng lệnh: npm run dev');

  } catch (error) {
    console.error('❌ Lỗi khởi tạo database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Chạy script
initDatabase();
