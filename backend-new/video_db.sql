-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 09, 2025 lúc 03:38 AM
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
-- Error reading structure for table video_db.categories: #1932 - Table 'video_db.categories' doesn't exist in engine
-- Error reading data for table video_db.categories: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `video_db`.`categories`' at line 1

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `featured_videos`
-- (See below for the actual view)
--
CREATE TABLE `featured_videos` (
);

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `recent_videos`
-- (See below for the actual view)
--
CREATE TABLE `recent_videos` (
);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--
-- Error reading structure for table video_db.users: #1932 - Table 'video_db.users' doesn't exist in engine
-- Error reading data for table video_db.users: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `video_db`.`users`' at line 1

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `user_stats`
-- (See below for the actual view)
--
CREATE TABLE `user_stats` (
);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `videos`
--
-- Error reading structure for table video_db.videos: #1932 - Table 'video_db.videos' doesn't exist in engine
-- Error reading data for table video_db.videos: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `video_db`.`videos`' at line 1

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `video_stats`
-- (See below for the actual view)
--
CREATE TABLE `video_stats` (
);

-- --------------------------------------------------------

--
-- Cấu trúc cho view `featured_videos`
--
DROP TABLE IF EXISTS `featured_videos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `featured_videos`  AS SELECT `videos`.`id` AS `id`, `videos`.`title` AS `title`, `videos`.`description` AS `description`, `videos`.`video_id` AS `video_id`, `videos`.`category` AS `category`, `videos`.`thumbnail_url` AS `thumbnail_url`, `videos`.`views` AS `views`, `videos`.`likes` AS `likes`, `videos`.`duration` AS `duration`, `videos`.`software` AS `software`, `videos`.`created_at` AS `created_at` FROM `videos` ORDER BY `videos`.`views` DESC, `videos`.`likes` DESC LIMIT 0, 10 ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `recent_videos`
--
DROP TABLE IF EXISTS `recent_videos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recent_videos`  AS SELECT `videos`.`id` AS `id`, `videos`.`title` AS `title`, `videos`.`description` AS `description`, `videos`.`video_id` AS `video_id`, `videos`.`category` AS `category`, `videos`.`thumbnail_url` AS `thumbnail_url`, `videos`.`views` AS `views`, `videos`.`likes` AS `likes`, `videos`.`duration` AS `duration`, `videos`.`software` AS `software`, `videos`.`created_at` AS `created_at` FROM `videos` ORDER BY `videos`.`created_at` DESC LIMIT 0, 20 ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `user_stats`
--
DROP TABLE IF EXISTS `user_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_stats`  AS SELECT `users`.`role` AS `role`, count(0) AS `total_users`, sum(case when `users`.`is_active` = 1 then 1 else 0 end) AS `active_users`, max(`users`.`created_at`) AS `latest_user` FROM `users` GROUP BY `users`.`role` ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `video_stats`
--
DROP TABLE IF EXISTS `video_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `video_stats`  AS SELECT `videos`.`category` AS `category`, count(0) AS `total_videos`, avg(`videos`.`views`) AS `avg_views`, max(`videos`.`created_at`) AS `latest_video` FROM `videos` WHERE `videos`.`category` is not null GROUP BY `videos`.`category` ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
