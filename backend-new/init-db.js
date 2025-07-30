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

    // Tạo bảng users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role ENUM('admin', 'user') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);
    console.log('✅ Bảng users đã được tạo');

    // Thêm categories mẫu
    const categories = [
      ['My Fav <3', 'Favorite videos collection', '#ff69b4'],
      ['Travel', 'Travel and adventure videos', '#4CAF50'],
      ['Tutorial', 'Educational and tutorial content', '#2196F3'],
      ['Trailer', 'Real estate and property videos', '#FF9800'],
      ['Wedding', 'Underwater and wedding scenes', '#00BCD4'],
      ['Brand', 'Brand campaigns and promotional videos', '#9C27B0'],
      ['Shorts', 'Short-form video content', '#F44336']
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

    // Thêm users mẫu (password: admin123)
    const users = [
      ['admin', '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4t.5uI6oP9qR0sA1bC2dE3fF4gH5iJ6kL7mN8oP9', 'admin@example.com', 'admin'],
      ['user1', '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4t.5uI6oP9qR0sA1bC2dE3fF4gH5iJ6kL7mN8oP9', 'user1@example.com', 'user']
    ];

    for (const [username, password, email, role] of users) {
      try {
        await connection.execute(
          'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
          [username, password, email, role]
        );
        console.log(`✅ Đã thêm user: ${username} (${role})`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️ User '${username}' đã tồn tại`);
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

    // Tạo view user stats
    await connection.query(`
      CREATE OR REPLACE VIEW user_stats AS
      SELECT 
        role,
        COUNT(*) as total_users,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
        MAX(created_at) as latest_user
      FROM users 
      GROUP BY role
    `);
    console.log('✅ View user_stats đã được tạo');

    console.log('\n🎉 Database đã được khởi tạo thành công!');
    console.log('📋 Users đã được tạo:');
    console.log('   - admin (admin123) - Role: admin');
    console.log('   - user1 (admin123) - Role: user');

  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Chạy script
initDatabase();
