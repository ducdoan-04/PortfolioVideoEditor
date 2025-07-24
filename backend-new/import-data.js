const mysql = require('mysql2/promise');
require('dotenv').config();

// Dữ liệu từ frontend page.jsx
const portfolioCategories = [
  { id: "my-fav", name: "My Fav <3" },
  { id: "travel", name: "Travel" },
  { id: "tutorial", name: "Tutorial" },
  { id: "real-estate", name: "Trailer" },
  { id: "underwater", name: "Wedding" },
  { id: "brand", name: "Brand" },
  { id: "shorts", name: "Shorts" },
];

const portfolioData = {
  "my-fav": [
    {
      title: "CORPORATE HOUSING",
      subtitle: "Business Promo",
      thumbnail: "/backgroundVideo/1.jpg",
      duration: "2:15",
      videoId: "dQw4w9WgXcQ",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Professional corporate housing promotional video showcasing business facilities and services.",
      category: "my-fav",
      views: 1250,
      likes: 89
    },
    {
      title: "Digital Nomad 2023",
      subtitle: "Lifestyle Brand",
      thumbnail: "/backgroundVideo/2.jpg",
      duration: "4:45",
      videoId: "jNQXAC9IVRw",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Inspiring lifestyle video about digital nomad journey and remote work culture.",
      category: "my-fav",
      views: 2800,
      likes: 156
    },
    {
      title: "HOC LAN DAO PHU QUY",
      subtitle: "Freelancing Dao Phu Quy",
      thumbnail: "/backgroundVideo/3.jpg",
      duration: "5:20",
      videoId: "9bZkp7q19f0",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Beautiful underwater diving experience at Dao Phu Quy island.",
      category: "my-fav",
      views: 3500,
      likes: 248
    },
    {
      title: "VIDEO EDITOR",
      subtitle: "Promotional Video",
      thumbnail: "/backgroundVideo/4.jpg",
      duration: "3:30",
      videoId: "ScMzIvxBSi4",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Promotional video showcasing video editing skills and portfolio.",
      category: "my-fav",
      views: 1890,
      likes: 134
    },
  ],
  travel: [
    {
      title: "TAJIKISTAN HISOR",
      subtitle: "Travel Vlog",
      thumbnail: "/backgroundVideo/5.jpg",
      duration: "8:45",
      videoId: "ZXsQAXx_ao0",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Adventure travel vlog exploring the beautiful landscapes of Tajikistan Hisor.",
      category: "travel",
      views: 4200,
      likes: 312
    },
    {
      title: "SAM MAY BA LAT",
      subtitle: "Travel Adventure",
      thumbnail: "/backgroundVideo/6.jpg",
      duration: "6:30",
      videoId: "kJQP7kiw5Fk",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Mountain climbing adventure in Sam May Ba Lat region.",
      category: "travel",
      views: 2750,
      likes: 198
    },
    {
      title: "XUYEN VIET",
      subtitle: "Vietnam Journey",
      thumbnail: "/backgroundVideo/1.jpg",
      duration: "12:15",
      videoId: "L_jWHffIx5E",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Epic journey across Vietnam from North to South, capturing diverse landscapes and culture.",
      category: "travel",
      views: 6800,
      likes: 445
    },
    {
      title: "AM THANH BA LAT",
      subtitle: "Sound of Ba Lat",
      thumbnail: "/backgroundVideo/2.jpg",
      duration: "4:20",
      videoId: "fJ9rUzIMcZQ",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Capturing the natural sounds and beauty of Ba Lat coastal area.",
      category: "travel",
      views: 1950,
      likes: 167
    },
    {
      title: "PHUOT VIET NAM",
      subtitle: "Vietnam Adventure",
      thumbnail: "/backgroundVideo/3.jpg",
      duration: "10:30",
      videoId: "Ks-_Mh1QhMc",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Motorbike adventure through Vietnam's most scenic routes.",
      category: "travel",
      views: 5100,
      likes: 378
    },
    {
      title: "DA LAT JOURNEY",
      subtitle: "Highland Adventure",
      thumbnail: "/backgroundVideo/4.jpg",
      duration: "7:15",
      videoId: "hTWKbfoikeg",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Exploring the romantic city of Da Lat with its cool climate and flower gardens.",
      category: "travel",
      views: 3200,
      likes: 254
    },
  ],
  tutorial: [
    {
      title: "HIEU BO SUA VIDEO",
      subtitle: "Video Editing Tutorial",
      thumbnail: "/backgroundVideo/5.jpg",
      duration: "15:30",
      videoId: "YQHsXMglC9A",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Comprehensive video editing tutorial covering basic to advanced techniques.",
      category: "tutorial",
      views: 8900,
      likes: 567
    },
    {
      title: "Nghien Cuu Thi Khoa Youtube",
      subtitle: "YouTube Research",
      thumbnail: "/backgroundVideo/6.jpg",
      duration: "22:45",
      videoId: "oHg5SJYRHA0",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "In-depth research on YouTube market trends and content strategy.",
      category: "tutorial",
      views: 12500,
      likes: 789
    },
    {
      title: "Tap Khoa Youtube Chuan SEO",
      subtitle: "YouTube SEO Course",
      thumbnail: "/backgroundVideo/1.jpg",
      duration: "18:20",
      videoId: "RBumgq5yVrA",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Complete YouTube SEO course to optimize video ranking and visibility.",
      category: "tutorial",
      views: 15600,
      likes: 934
    },
    {
      title: "After Effects Basics",
      subtitle: "Motion Graphics Tutorial",
      thumbnail: "/backgroundVideo/2.jpg",
      duration: "25:10",
      videoId: "lTRiuFIWV54",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Learn After Effects basics for creating stunning motion graphics and animations.",
      category: "tutorial",
      views: 11200,
      likes: 678
    },
  ],
  "real-estate": [
    {
      title: "An Gia Homestay",
      subtitle: "Property Tour",
      thumbnail: "/backgroundVideo/3.jpg",
      duration: "3:45",
      videoId: "M7lc1UVf-VE",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Virtual tour of An Gia Homestay showcasing amenities and location.",
      category: "real-estate",
      views: 2100,
      likes: 145
    },
    {
      title: "Dalant Villa",
      subtitle: "Luxury Property",
      thumbnail: "/backgroundVideo/4.jpg",
      duration: "4:20",
      videoId: "QH2-TGUlwu4",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Luxury villa tour featuring premium amenities and elegant design.",
      category: "real-estate",
      views: 3400,
      likes: 234
    },
    {
      title: "Moonlight House",
      subtitle: "Night Property",
      thumbnail: "/backgroundVideo/5.jpg",
      duration: "2:55",
      videoId: "nOHFR1xi2f8",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Stunning nighttime property showcase with dramatic lighting effects.",
      category: "real-estate",
      views: 1800,
      likes: 123
    },
  ],
  underwater: [
    {
      title: "Floating Freelancing",
      subtitle: "Underwater Scene",
      thumbnail: "/backgroundVideo/6.jpg",
      duration: "2:30",
      videoId: "SX_ViT4Ra7k",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Creative underwater freelancing concept with floating elements.",
      category: "underwater",
      views: 2900,
      likes: 201
    },
    {
      title: "Hair Freelancing",
      subtitle: "Underwater Scene",
      thumbnail: "/backgroundVideo/1.jpg",
      duration: "1:45",
      videoId: "iik25wqIuFo",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Artistic underwater hair movement in weightless environment.",
      category: "underwater",
      views: 2200,
      likes: 178
    },
    {
      title: "Heart Freelancing",
      subtitle: "Underwater Scene",
      thumbnail: "/backgroundVideo/2.jpg",
      duration: "3:15",
      videoId: "BaW_jenozKc",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Emotional underwater scene representing the heart of freelancing.",
      category: "underwater",
      views: 3100,
      likes: 225
    },
  ],
  brand: [
    {
      title: "PHUOT VAN BIEN DT 201",
      subtitle: "Brand Campaign",
      thumbnail: "/backgroundVideo/3.jpg",
      duration: "3:30",
      videoId: "kffacxfA7G4",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Brand campaign video for Phuot Van Bien adventure tours.",
      category: "brand",
      views: 2600,
      likes: 189
    },
    {
      title: "CORPORATE HOUSING",
      subtitle: "Business Promo",
      thumbnail: "/backgroundVideo/4.jpg",
      duration: "2:15",
      videoId: "dQw4w9WgXcQ",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Corporate housing brand promotional video showcasing business solutions.",
      category: "brand",
      views: 1900,
      likes: 134
    },
  ],
  shorts: [
    {
      title: "Quick Edit Tips",
      subtitle: "Short Tutorial",
      thumbnail: "/backgroundVideo/5.jpg",
      duration: "0:45",
      videoId: "jfKfPfyJRdk",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Quick video editing tips for efficient workflow.",
      category: "shorts",
      views: 5800,
      likes: 412
    },
    {
      title: "Color Grading Fast",
      subtitle: "Quick Guide",
      thumbnail: "/backgroundVideo/6.jpg",
      duration: "0:30",
      videoId: "ixmxOlcrlUc",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Fast color grading techniques for instant mood enhancement.",
      category: "shorts",
      views: 7200,
      likes: 523
    },
    {
      title: "Transition Effects",
      subtitle: "Quick Tutorial",
      thumbnail: "/backgroundVideo/1.jpg",
      duration: "0:55",
      videoId: "hFZFjoX2cGg",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Creative transition effects for dynamic video storytelling.",
      category: "shorts",
      views: 6500,
      likes: 478
    },
    {
      title: "Audio Sync Tips",
      subtitle: "Quick Guide",
      thumbnail: "/backgroundVideo/2.jpg",
      duration: "0:40",
      videoId: "09R8_2nJtjg",
      software: "Capcut Pc, Premiere Pro, After Effects",
      description: "Essential audio sync tips for professional video production.",
      category: "shorts",
      views: 4900,
      likes: 356
    },
  ],
};

const recentProjects = [
  {
    title: "Freelancing Dao Phu Quy",
    date: "November 30, 2023",
    thumbnail: "/backgroundVideo/3.jpg",
    views: "2.5K",
    videoId: "QjR3DDjnijM",
    software: "Capcut Pc, Premiere Pro, After Effects",
    description: "Recent underwater freelancing project at Dao Phu Quy island.",
    category: "underwater"
  },
  {
    title: "Nghien Cuu Thi Khoa Youtube",
    date: "March 15, 2024",
    thumbnail: "/backgroundVideo/4.jpg",
    views: "15K",
    videoId: "oHg5SJYRHA0",
    software: "Capcut Pc, Premiere Pro, After Effects",
    description: "Latest YouTube market research and strategy analysis.",
    category: "tutorial"
  },
];

async function importData() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'video_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Đã kết nối database');

    // Xóa dữ liệu cũ
    await connection.execute('DELETE FROM videos');
    await connection.execute('DELETE FROM categories');
    await connection.execute('ALTER TABLE videos AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE categories AUTO_INCREMENT = 1');
    console.log('🧹 Đã xóa dữ liệu cũ');

    // Import categories
    for (const category of portfolioCategories) {
      const categoryColors = {
        "my-fav": "#ff69b4",
        "travel": "#4CAF50",
        "tutorial": "#2196F3",
        "real-estate": "#FF9800",
        "underwater": "#00BCD4",
        "brand": "#9C27B0",
        "shorts": "#F44336"
      };

      await connection.execute(
        'INSERT INTO categories (name, description, color) VALUES (?, ?, ?)',
        [
          category.name,
          `${category.name} category videos`,
          categoryColors[category.id] || '#007bff'
        ]
      );
      console.log(`✅ Đã thêm category: ${category.name}`);
    }

    // Import videos từ portfolioData
    let videoCount = 0;
    for (const [categoryKey, videos] of Object.entries(portfolioData)) {
      for (const video of videos) {
        await connection.execute(`
          INSERT INTO videos (
            title, description, video_id, category, thumbnail_url, 
            views, likes, duration, software, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          video.title,
          video.description,
          video.videoId,
          video.category,
          video.thumbnail,
          video.views || 0,
          video.likes || 0,
          video.duration,
          video.software
        ]);
        videoCount++;
      }
    }

    // Import recent projects
    for (const project of recentProjects) {
      const viewsNumber = project.views.replace('K', '000').replace('.', '');
      await connection.execute(`
        INSERT INTO videos (
          title, description, video_id, category, thumbnail_url, 
          views, likes, duration, software, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, '0:00', ?, ?, NOW())
      `, [
        project.title,
        project.description,
        project.videoId,
        project.category,
        project.thumbnail,
        parseInt(viewsNumber) || 0,
        0,
        project.software,
        project.date
      ]);
      videoCount++;
    }

    console.log(`✅ Đã import ${videoCount} videos`);
    console.log(`✅ Đã import ${portfolioCategories.length} categories`);
    console.log('🎉 Import dữ liệu thành công!');

  } catch (error) {
    console.error('❌ Lỗi import dữ liệu:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Chạy script
importData();
