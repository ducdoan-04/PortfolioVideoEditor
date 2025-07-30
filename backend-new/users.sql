-- Tạo bảng users cho authentication
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
);

-- Thêm admin user mặc định
INSERT IGNORE INTO users (username, password, email, role) VALUES
('admin', '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4t.5uI6oP9qR0sA1bC2dE3fF4gH5iJ6kL7mN8oP9', 'admin@example.com', 'admin'),
('user1', '$2b$10$rQZ8K9mN2pL3vX7yJ1hG4t.5uI6oP9qR0sA1bC2dE3fF4gH5iJ6kL7mN8oP9', 'user1@example.com', 'user');

-- Tạo view cho user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  role,
  COUNT(*) as total_users,
  SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
  MAX(created_at) as latest_user
FROM users 
GROUP BY role; 