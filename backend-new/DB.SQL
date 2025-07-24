-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 24, 2025 lúc 11:53 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `video_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(7) DEFAULT '#007bff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `color`, `created_at`) VALUES
(1, 'My Fav <3', 'My Fav <3', '#ff69b4', '2025-07-24 20:05:06'),
(2, 'Travel', 'Travel', '#4CAF50', '2025-07-24 20:05:06'),
(3, 'Tutorial', 'Tutorial', '#2196F3', '2025-07-24 20:05:07'),
(4, 'Trailer', 'Trailer', '#FF9800', '2025-07-24 20:05:07'),
(5, 'Wedding', 'Wedding', '#00BCD4', '2025-07-24 20:05:07'),
(6, 'Brand', 'Brand', '#9C27B0', '2025-07-24 20:05:07'),
(7, 'Shorts', 'Shorts', '#F44336', '2025-07-24 20:05:07');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `video_id` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `duration` varchar(20) DEFAULT NULL,
  `software` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `video_id`, `category`, `thumbnail_url`, `views`, `likes`, `duration`, `software`, `subtitle`, `created_at`, `updated_at`) VALUES
(1, 'CORPORATE HOUSING', 'Professional corporate housing promotional video showcasing business facilities and services.', 'dQw4w9WgXcQ', 'my-fav', '/backgroundVideo/1.jpg', 1250, 89, '2:15', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(2, 'Digital Nomad 2023', 'Inspiring lifestyle video about digital nomad journey and remote work culture.', 'jNQXAC9IVRw', 'my-fav', '/backgroundVideo/2.jpg', 2800, 156, '4:45', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(3, 'HOC LAN DAO PHU QUY', 'Beautiful underwater diving experience at Dao Phu Quy island.', '9bZkp7q19f0', 'my-fav', '/backgroundVideo/3.jpg', 3500, 248, '5:20', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(4, 'VIDEO EDITOR', 'Promotional video showcasing video editing skills and portfolio.', 'ScMzIvxBSi4', 'my-fav', '/backgroundVideo/4.jpg', 1890, 134, '3:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(5, 'TAJIKISTAN HISOR', 'Adventure travel vlog exploring the beautiful landscapes of Tajikistan Hisor.', 'ZXsQAXx_ao0', 'travel', '/backgroundVideo/5.jpg', 4200, 312, '8:45', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(6, 'SAM MAY BA LAT', 'Mountain climbing adventure in Sam May Ba Lat region.', 'kJQP7kiw5Fk', 'travel', '/backgroundVideo/6.jpg', 2750, 198, '6:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(7, 'XUYEN VIET', 'Epic journey across Vietnam from North to South, capturing diverse landscapes and culture.', 'L_jWHffIx5E', 'travel', '/backgroundVideo/1.jpg', 6800, 445, '12:15', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(8, 'AM THANH BA LAT', 'Capturing the natural sounds and beauty of Ba Lat coastal area.', 'fJ9rUzIMcZQ', 'travel', '/backgroundVideo/2.jpg', 1950, 167, '4:20', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(9, 'PHUOT VIET NAM', 'Motorbike adventure through Vietnam\'s most scenic routes.', 'Ks-_Mh1QhMc', 'travel', '/backgroundVideo/3.jpg', 5100, 378, '10:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(10, 'DA LAT JOURNEY', 'Exploring the romantic city of Da Lat with its cool climate and flower gardens.', 'hTWKbfoikeg', 'travel', '/backgroundVideo/4.jpg', 3200, 254, '7:15', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(11, 'HIEU BO SUA VIDEO', 'Comprehensive video editing tutorial covering basic to advanced techniques.', 'YQHsXMglC9A', 'tutorial', '/backgroundVideo/5.jpg', 8900, 567, '15:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(12, 'Nghien Cuu Thi Khoa Youtube', 'In-depth research on YouTube market trends and content strategy.', 'oHg5SJYRHA0', 'tutorial', '/backgroundVideo/6.jpg', 12500, 789, '22:45', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(13, 'Tap Khoa Youtube Chuan SEO', 'Complete YouTube SEO course to optimize video ranking and visibility.', 'RBumgq5yVrA', 'tutorial', '/backgroundVideo/1.jpg', 15600, 934, '18:20', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(14, 'After Effects Basics', 'Learn After Effects basics for creating stunning motion graphics and animations.', 'lTRiuFIWV54', 'tutorial', '/backgroundVideo/2.jpg', 11200, 678, '25:10', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(15, 'An Gia Homestay', 'Virtual tour of An Gia Homestay showcasing amenities and location.', 'M7lc1UVf-VE', 'real-estate', '/backgroundVideo/3.jpg', 2100, 145, '3:45', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(16, 'Dalant Villa', 'Luxury villa tour featuring premium amenities and elegant design.', 'QH2-TGUlwu4', 'real-estate', '/backgroundVideo/4.jpg', 3400, 234, '4:20', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(17, 'Moonlight House', 'Stunning nighttime property showcase with dramatic lighting effects.', 'nOHFR1xi2f8', 'real-estate', '/backgroundVideo/5.jpg', 1800, 123, '2:55', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(18, 'Floating Freelancing', 'Creative underwater freelancing concept with floating elements.', 'SX_ViT4Ra7k', 'underwater', '/backgroundVideo/6.jpg', 2900, 201, '2:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(19, 'Hair Freelancing', 'Artistic underwater hair movement in weightless environment.', 'iik25wqIuFo', 'underwater', '/backgroundVideo/1.jpg', 2200, 178, '1:45', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(20, 'Heart Freelancing', 'Emotional underwater scene representing the heart of freelancing.', 'BaW_jenozKc', 'underwater', '/backgroundVideo/2.jpg', 3100, 225, '3:15', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(21, 'PHUOT VAN BIEN DT 201', 'Brand campaign video for Phuot Van Bien adventure tours.', 'kffacxfA7G4', 'brand', '/backgroundVideo/3.jpg', 2600, 189, '3:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(22, 'CORPORATE HOUSING', 'Corporate housing brand promotional video showcasing business solutions.', 'dQw4w9WgXcQ', 'brand', '/backgroundVideo/4.jpg', 1900, 134, '2:15', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(23, 'Quick Edit Tips', 'Quick video editing tips for efficient workflow.', 'jfKfPfyJRdk', 'shorts', '/backgroundVideo/5.jpg', 5800, 412, '0:45', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(24, 'Color Grading Fast', 'Fast color grading techniques for instant mood enhancement.', 'ixmxOlcrlUc', 'shorts', '/backgroundVideo/6.jpg', 7200, 523, '0:30', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(25, 'Transition Effects', 'Creative transition effects for dynamic video storytelling.', 'hFZFjoX2cGg', 'shorts', '/backgroundVideo/1.jpg', 6500, 478, '0:55', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(26, 'Audio Sync Tips', 'Essential audio sync tips for professional video production.', '09R8_2nJtjg', 'shorts', '/backgroundVideo/2.jpg', 4900, 356, '0:40', 'Capcut Pc, Premiere Pro, After Effects', NULL, '2025-07-24 20:05:07', '2025-07-24 20:05:07'),
(27, 'Freelancing Dao Phu Quy', 'Recent underwater freelancing project at Dao Phu Quy island.', 'QjR3DDjnijM', 'underwater', '/backgroundVideo/3.jpg', 25000, 0, '0:00', 'Capcut Pc, Premiere Pro, After Effects', NULL, '0000-00-00 00:00:00', '2025-07-24 20:05:07'),
(28, 'Nghien Cuu Thi Khoa Youtube', 'Latest YouTube market research and strategy analysis.', 'oHg5SJYRHA0', 'tutorial', '/backgroundVideo/4.jpg', 15000, 0, '0:00', 'Capcut Pc, Premiere Pro, After Effects', NULL, '0000-00-00 00:00:00', '2025-07-24 20:05:07');

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `video_stats`
-- (See below for the actual view)
--
CREATE TABLE `video_stats` (
`category` varchar(100)
,`total_videos` bigint(21)
,`avg_views` decimal(14,4)
,`latest_video` timestamp
);

-- --------------------------------------------------------

--
-- Cấu trúc cho view `video_stats`
--
DROP TABLE IF EXISTS `video_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `video_stats`  AS SELECT `videos`.`category` AS `category`, count(0) AS `total_videos`, avg(`videos`.`views`) AS `avg_views`, max(`videos`.`created_at`) AS `latest_video` FROM `videos` WHERE `videos`.`category` is not null GROUP BY `videos`.`category` ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_video_id` (`video_id`),
  ADD KEY `idx_views` (`views`),
  ADD KEY `idx_likes` (`likes`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
