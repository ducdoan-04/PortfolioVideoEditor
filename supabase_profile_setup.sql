-- Supabase PostgreSQL Setup Script for Profile

-- 1. Create Table
CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  greeting VARCHAR(255),
  description TEXT,
  video_tools VARCHAR(255),
  photo_tools VARCHAR(255),
  experience_years INTEGER,
  satisfaction_rate INTEGER,
  toeic_score INTEGER,
  facebook_url VARCHAR(512),
  instagram_url VARCHAR(512),
  zalo_url VARCHAR(512),
  avatar_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert Default Data (ID = 1)
INSERT INTO "profile" (
  id, name, greeting, description, video_tools, photo_tools, 
  experience_years, satisfaction_rate, toeic_score, 
  facebook_url, instagram_url, zalo_url, avatar_url
) VALUES (
  1, 
  'HO DUC DOAN', 
  'Hi there!', 
  'I''m Doan a passionate video editor with 3 years of experience in various styles, from corporate to cinematic and social media content. Check out my work to see how I bring stories to life.', 
  'Capcut Pc, Premiere Pro, After Effects', 
  'Photoshop, Illustrator, Evoto', 
  3, 
  99, 
  600, 
  'https://www.facebook.com/ducdoan04', 
  'https://www.instagram.com/d.doan_4', 
  'https://zalo.me/0376180362', 
  '/images/profile-photo-1.png'
) ON CONFLICT (id) DO NOTHING;

-- 3. Reset Sequence (optional)
SELECT setval('profile_id_seq', (SELECT MAX(id) FROM profile));

-- 4. Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies
-- Public read access
CREATE POLICY "Public read access for profile" ON profile FOR SELECT USING (true);

-- Authenticated access for modification (Admins)
CREATE POLICY "Auth write access for profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
