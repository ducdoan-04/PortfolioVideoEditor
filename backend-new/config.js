module.exports = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'video_db',
    port: process.env.DB_PORT || 3306,
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Admin Credentials
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    token: process.env.ADMIN_TOKEN || 'admin-secret-token-2024',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 52428800, // 50MB
  },
}; 