-- Tạo database
CREATE DATABASE IF NOT EXISTS video_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE video_db;

-- Tạo bảng videos với đầy đủ fields theo frontend
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
  software VARCHAR(255), -- Thay đổi từ file_size thành software
  subtitle VARCHAR(255), -- Thêm subtitle
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_created_at (created_at),
  INDEX idx_video_id (video_id),
  INDEX idx_views (views),
  INDEX idx_likes (likes)
);

-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#007bff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm categories theo frontend
INSERT IGNORE INTO categories (name, description, color) VALUES
('My Fav <3', 'Favorite videos collection', '#ff69b4'),
('Travel', 'Travel and adventure videos', '#4CAF50'),
('Tutorial', 'Educational and tutorial content', '#2196F3'),
('Trailer', 'Real estate and property videos', '#FF9800'),
('Wedding', 'Underwater and wedding scenes', '#00BCD4'),
('Brand', 'Brand campaigns and promotional videos', '#9C27B0'),
('Shorts', 'Short-form video content', '#F44336');

-- Tạo view để thống kê theo categories
CREATE OR REPLACE VIEW video_stats AS
SELECT 
  category,
  COUNT(*) as total_videos,
  AVG(views) as avg_views,
  AVG(likes) as avg_likes,
  MAX(created_at) as latest_video,
  SUM(views) as total_views,
  SUM(likes) as total_likes
FROM videos 
WHERE category IS NOT NULL AND category != ''
GROUP BY category
ORDER BY total_videos DESC;

-- Tạo view cho featured videos (videos có views cao nhất)
CREATE OR REPLACE VIEW featured_videos AS
SELECT 
  id, title, description, video_id, category, thumbnail_url,
  views, likes, duration, software, created_at
FROM videos 
ORDER BY views DESC, likes DESC
LIMIT 10;

-- Tạo view cho recent videos
CREATE OR REPLACE VIEW recent_videos AS
SELECT 
  id, title, description, video_id, category, thumbnail_url,
  views, likes, duration, software, created_at
FROM videos 
ORDER BY created_at DESC
LIMIT 20;
