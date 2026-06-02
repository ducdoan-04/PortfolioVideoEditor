-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: video-db-portfolio-video-editor.d.aivencloud.com    Database: video_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '03797679-0cdf-11f1-a725-a62048ae4553:1-15,
0b4875a0-8d51-11f0-b564-460397ef1bb9:1-115,
1187b3c5-de25-11f0-89f1-4a3a9a723346:1-131,
247f639c-5e5a-11f1-90a3-b6af707fc79b:1-15,
68231818-ff53-11f0-ae5f-96498523ced5:1-20,
892912f3-277e-11f1-a49f-3ad5d158d328:1-15,
bde213c9-1abd-11f1-b216-e60c790ce4d9:1-15,
e55d8113-3330-11f1-9198-629b2ffb8856:1-24,
eb6a300d-12c7-11f1-a42a-0a68fc0b4304:1-15,
fd4d61d8-f2a6-11f0-b868-9233db911fa9:1-16';

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'My Fav <3','My Fav <3 category videos','#ff69b4','2025-08-03 10:03:13'),(2,'Recap','Recap category videos','#4CAF50','2025-08-03 10:03:13'),(3,'Travel','Travel category videos','#2196F3','2025-08-03 10:03:13'),(4,'Teaser','Teaser category videos','#FF9800','2025-08-03 10:03:13'),(5,'Wedding','Wedding category videos','#00BCD4','2025-08-03 10:03:13'),(6,'Brand','Brand category videos','#9C27B0','2025-08-03 10:03:13'),(7,'Shorts','Shorts category videos','#F44336','2025-08-03 10:03:13'),(10,'Contest','Contest category videos','#6678ff','2025-12-23 16:09:39'),(11,'Holiday','Holiday category videos','#ff5252','2025-12-23 17:32:51');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `featured_videos`
--

DROP TABLE IF EXISTS `featured_videos`;
/*!50001 DROP VIEW IF EXISTS `featured_videos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `featured_videos` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `description`,
 1 AS `video_id`,
 1 AS `category`,
 1 AS `thumbnail_url`,
 1 AS `views`,
 1 AS `likes`,
 1 AS `duration`,
 1 AS `software`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `recent_videos`
--

DROP TABLE IF EXISTS `recent_videos`;
/*!50001 DROP VIEW IF EXISTS `recent_videos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `recent_videos` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `description`,
 1 AS `video_id`,
 1 AS `category`,
 1 AS `thumbnail_url`,
 1 AS `views`,
 1 AS `likes`,
 1 AS `duration`,
 1 AS `software`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `user_stats`
--

DROP TABLE IF EXISTS `user_stats`;
/*!50001 DROP VIEW IF EXISTS `user_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `user_stats` AS SELECT 
 1 AS `role`,
 1 AS `total_users`,
 1 AS `active_users`,
 1 AS `latest_user`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$rnKDnZiPmaVyNbgB9A6CYez98tRVLUifeUQrtlcnjm/sglV39CFES','admin@example.com','admin',1,'2025-07-30 08:08:35','2026-04-22 12:28:41'),(2,'ducdoan04','$2b$10$zYjChuVFqRHwWh51s0vwO.rHbMyLg5mQa7HtXUd8lcqFfz8aGFTVO','ducdoan04.work@gmail.com','admin',1,'2025-07-30 08:08:35','2026-04-08 09:58:17'),(3,'admin3','$2b$10$Hg37YIW0bhq.yc4hdERHW.xi1ygQMD6YRnZMgzO2kFjql2iMA3xsO','admin3@gmail.com','admin',1,'2025-07-30 09:12:51','2026-04-08 09:57:58'),(6,'user1','$2b$10$0HQ1c7UFwfQ9t667QrPoAOa8eWKkmz2HB74ylv8XzP4GSvEUlyRPK','user1@example.com','user',1,'2025-08-03 08:45:23','2026-04-08 09:58:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `video_stats`
--

DROP TABLE IF EXISTS `video_stats`;
/*!50001 DROP VIEW IF EXISTS `video_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `video_stats` AS SELECT 
 1 AS `category`,
 1 AS `total_videos`,
 1 AS `avg_views`,
 1 AS `latest_video`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_id` varchar(64) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `thumbnail_url` varchar(512) DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `likes` int NOT NULL DEFAULT '0',
  `duration` int DEFAULT NULL,
  `software` varchar(100) DEFAULT NULL,
  `extra` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_videos_category` (`category`),
  KEY `idx_videos_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (40,'VIDEO TỔNG KẾT DÂN VẬN | TRÀ GIÁC 2025 - Tựa Nắng Ôm Bản','VIDEO RECAP DAN VAN 2025','aLtBwNEklyY','My Fav <3','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766488352/thumbnail-1766488348731.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 05:53:49','2025-12-24 16:10:49'),(41,'VIDEO TỔNG KẾT NK 2024  -2025','video edit by ducdoan04','dC71a34gRKI','My Fav <3','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766554150/thumbnail-1766554149136.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 05:55:04','2025-12-24 16:11:33'),(42,'VIDEO TIỀN TRẠM DÂN VẬN TRÀ TÂN 2025 - ĐÔNG THƯƠNG ẤM BẢN','Video edit by ducdoan04','MMchH8nGmbk','My Fav <3','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766488413/thumbnail-1766488410393.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 05:59:52','2025-12-24 16:11:13'),(43,'[MV]  Thanh Xuân Ngày Ấy','[MV]  Thanh Xuân Ngày Ấy','Iq9L9Hsa4Bw','My Fav <3','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766488462/thumbnail-1766488458733.png',0,0,NULL,'Premiere Pro, After Effect',NULL,'2025-12-23 06:42:33','2025-12-23 11:14:23'),(44,'CASTING THÀNH VIÊN','Video edit by ducdoan04','sQFl9z32f94','Shorts','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766493916/thumbnail-1766493905139.jpg',0,0,NULL,'Capcut pc',NULL,'2025-12-23 06:48:50','2025-12-24 16:23:18'),(45,'VIDEO CHAO MUNG 30/04/1975','VIDEO CHAO MUNG 30/04/1975 - 30/04/2025','QU2aYEfqXEk','Shorts','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766494308/thumbnail-1766494306187.jpg',0,0,NULL,'Capcut pc',NULL,'2025-12-23 06:59:13','2025-12-24 16:23:14'),(46,'VIDEO TEASER DÂN VẬN 2025 - TỰA NẮNG ÔM BẢN','Video edit by ducdoan04.','zlXkzQbKLHQ','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766488622/thumbnail-1766488619520.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 07:18:40','2025-12-24 05:49:49'),(47,'TỔNG KẾT CHƯƠNG TRÌNH GÂY QUỸ “TUẦN LỄ YÊU THƯƠNG”','Video edit by ducdoan04','XaK-GTPgUvQ','Shorts','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766494382/thumbnail-1766494379580.jpg',0,0,NULL,'Capcut pc',NULL,'2025-12-23 07:23:28','2025-12-24 16:23:16'),(48,'VIDEO TIỀN TRẠM DÂN VẬN TRÀ GIÁC 2025 - TỰA NẮNG ÔM BẢN','Video edit by ducdoan04','Y8RCZHR_QoA','My Fav <3','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766488652/thumbnail-1766488649981.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 07:25:10','2025-12-24 05:50:25'),(52,'VIDEO RECAP BIGGAME V9','video edit by ducdoan04','q0B_uxXBV4Q','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766496567/thumbnail-1766496564788.jpg',0,0,NULL,'Capcut pc',NULL,'2025-12-23 13:29:29','2025-12-23 13:29:29'),(53,'Video ATGT Truong THCS Tran Dai Nghia','video edit by ducdoan04','pQjmitbQ2PQ','Contest','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766506406/thumbnail-1766506404555.png',0,0,NULL,'Capcut pc',NULL,'2025-12-23 16:13:27','2025-12-23 16:13:27'),(54,'Video 20-11 Truong THCS Tran Dai Nghia','https://youtu.be/uN7aCb69y9c','uN7aCb69y9c','Contest','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766506771/thumbnail-1766506768067.png',0,0,NULL,'Capcut pc',NULL,'2025-12-23 16:19:32','2025-12-23 16:19:32'),(55,'Video Bien dao que huong Truong THCS Tran Dai Nghia','video edit by ducdoan04','IL-FXToP6Ww','Contest','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766506853/thumbnail-1766506850033.png',0,0,NULL,'Capcut pc',NULL,'2025-12-23 16:20:54','2025-12-23 16:20:54'),(56,'Video Wedding Quốc Thịnh & Ý Nhung','video edit by ducdoan04','LPW5U7usDWA','Wedding','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766507561/thumbnail-1766507555589.png',0,0,NULL,'Capcut pc',NULL,'2025-12-23 16:32:49','2025-12-23 16:32:49'),(57,'DON NGHIA TRANG','video edit by ducdoan04','Awx9MbKC92I','Recap',NULL,0,0,NULL,'Capcut pc',NULL,'2025-12-23 17:00:25','2025-12-23 17:00:25'),(58,'RECAP CHƯƠNG TRÌNH NỤ CƯỜI NẮNG HẠ','video edit by ducdoan04','IZDVv6GdHRs','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766509889/thumbnail-1766509887039.png',0,0,NULL,'Capcut pc',NULL,'2025-12-23 17:11:30','2025-12-23 17:11:30'),(59,'TỔNG KẾT CHƯƠNG TRÌNH TRÀ DƠN - KHÁT VỌNG ĐẠI NGÀN','video edit by ducdoan04','TOyyNPcMOyQ','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766510101/thumbnail-1766510100234.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:15:02','2025-12-23 17:16:43'),(60,'VIDEO GIỚI THIỆU ỨNG CỬ VIÊN','video edit by ducdoan04','Q-RMuxs_3lU','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766510453/thumbnail-1766510452058.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:20:54','2025-12-23 17:40:46'),(61,'NHÌN LẠI HÀNH TRÌNH TRONG MỘT NĂM QUA CỦA HIH','video edit by ducdoan04','D1l3jayTP1w','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766510692/thumbnail-1766510690781.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:24:52','2025-12-23 17:26:17'),(62,'VIDEO NEW YEAR PARTY','video edit by ducdoan04','DO1wrqapqDY','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766510991/thumbnail-1766510989506.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:29:51','2025-12-23 17:29:51'),(63,'🎊 CHÚC MỪNG NĂM MỚI 2024 🎊','video edit by ducdoan04','24aZXUGUJJY','Holiday','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766511279/thumbnail-1766511278546.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:34:40','2025-12-23 17:34:40'),(64,'🌱 CUỘC THI SPOGOMI HAND IN HAND CUP 2024 🌱 ','video edit by ducdoan04.','4abxItCR5vQ','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766511404/thumbnail-1766511402441.jpg',0,0,NULL,'Capcut pc',NULL,'2025-12-23 17:36:48','2025-12-23 17:40:55'),(65,'VIDEO TEASER - TIỀN TRẠM DÂN VẬN 2024','video edit by ducdoan04.','LJv8SRJhgKs','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766511930/thumbnail-1766511928186.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:45:31','2025-12-23 17:45:31'),(66,' 🌻TIỀN TRẠM “TRÀ TẬP 2024 - ĐÔNG ẤM ĐẠI NGÀN”🌻','video edit by ducdoan04.','jnrIrMhcDgI','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766512117/thumbnail-1766512116119.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:48:37','2025-12-23 18:32:14'),(67,'TỔNG KẾT “TUẦN LỄ YÊU THƯƠNG”  2024','video edit by ducdoan04.','kr_HgN3iJAo','Shorts','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766512527/thumbnail-1766512525156.png',0,0,NULL,'Capcut pc',NULL,'2025-12-23 17:55:27','2025-12-24 16:22:53'),(68,'TỔNG KẾT  DÂN VẬN TRÀ TẬP 2024 - ĐÔNG ẤM ĐẠI NGÀN','video edit by ducdoan04.','n78KPjIXvpo','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766512643/thumbnail-1766512641781.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 17:57:24','2025-12-23 18:32:28'),(69,'TIKTOK RECAP DÂN VẬN 2024','video edit by ducdoan04','n90FoJSxJrM','Shorts','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766513694/thumbnail-1766513692575.jpg',0,0,NULL,'Capcut pc',NULL,'2025-12-23 17:58:40','2025-12-24 16:23:03'),(70,'VIDEO GIỚI THIỆU ỨNG CỬ VIÊN NK-XIV','video edit by ducdoan04','rhj2jC7HAdM','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766513181/thumbnail-1766513179511.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-23 18:06:21','2025-12-23 18:06:21'),(71,'GIỚI THIỆU NHÓM TỪ THIỆN HAND IN HAND VIỆT - HÀN','video edit by ducdoan04.','K4NjtcLjhbI','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766553317/thumbnail-1766553315555.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 05:15:18','2025-12-24 05:15:18'),(72,'CUỘC THI GIỚI THIỆU CÂU LẠC BỘ ĐỘI NHÓM','video edit by ducdoan04.','t4QyueIByrg','Contest','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766553431/thumbnail-1766553430148.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 05:17:11','2025-12-24 05:17:11'),(73,'VIDEO TỔNG KẾT NK 2023-2024','video edit by ducdoan04','wy-GR1WR1J4','My Fav <3','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766554327/thumbnail-1766554325889.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 05:32:08','2025-12-24 05:32:08'),(74,'🎊 CHÚC MỪNG NĂM MỚI 2025 🎊','video edit by ducdoan04','F1c3_R7wG3M','Holiday','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766554451/thumbnail-1766554450364.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 05:34:12','2025-12-24 05:34:12'),(75,'COMING SOON DÂN VẬN 2025','Video edit by ducdoan04.','w7LfT_rjNPQ','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766592217/thumbnail-1766592216074.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 05:45:56','2025-12-24 16:03:38'),(76,'GIỚI THIỆU GIỚI THIỆU NHÓM TỪ THIỆN HAND IN HAND VIỆT - HÀN','Video edit by ducdoan04.','pY9I8gC9oW0','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766592546/thumbnail-1766592543527.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 05:47:56','2025-12-24 16:09:06'),(77,'VIDEO THUC TAP MOI TRUONG',' Video edit by ducdoan04','psvRhY2wQts','Travel','https://res.cloudinary.com/dlvpf7qke/image/upload/v1766594032/thumbnail-1766594030552.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2025-12-24 16:33:53','2025-12-24 16:33:53'),(78,'Nonla Coffee - Video Highlight Event',' Video edit by ducdoan04','e-RimrABAIY','Brand','https://res.cloudinary.com/dlvpf7qke/image/upload/v1769013880/thumbnail-1769013878767.jpg',0,0,NULL,'Capcut pc, After Effect',NULL,'2026-01-21 16:44:40','2026-01-21 16:44:40'),(79,'VIDEO BG V10','Video edit by ducdoan04','NbLNt0AvS5c','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1771250877/thumbnail-1771250875235.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2026-02-16 14:07:58','2026-02-16 14:07:58'),(80,'TEASER TIỀN TRẠM DÂN VẬN TRÀ TÂN 2026 - HẠ THƯƠNG ƯƠM NẮNG','Video edit by ducdoan04','0ReojP6PGnc','Teaser','https://res.cloudinary.com/dlvpf7qke/image/upload/v1771251665/thumbnail-1771251663603.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2026-02-16 14:21:06','2026-02-16 14:22:11'),(81,'Video template wedding chibi version 1','- Video edit by ducdoan04\r\n- Video template wedding chibi use zepeto, ae, capcup pc','fuX3-4R8UcE','Wedding','https://res.cloudinary.com/dlvpf7qke/image/upload/v1775642427/thumbnail-1775642425571.png',0,0,NULL,'Capcut pc, After Effect, zepeto',NULL,'2026-02-16 14:54:36','2026-04-08 10:00:28'),(82,'Video template wedding chibi version 2','- Video edit by ducdoan04\r\n- Video template wedding chibi use zepeto, ae, capcup pc','7AVkwCQe1LQ','Wedding','https://res.cloudinary.com/dlvpf7qke/image/upload/v1775642541/thumbnail-1775642538977.png',0,0,NULL,'Capcut pc, After Effect, zepeto',NULL,'2026-04-08 10:02:21','2026-04-08 10:02:21'),(83,'DÂN VẬN TRÀ TÂN 2026 - HẠ THƯƠNG ƯƠM NẮNG','video edit by ducdoan04','JyoJagqFzag','Recap','https://res.cloudinary.com/dlvpf7qke/image/upload/v1777337706/thumbnail-1777337706397.png',0,0,NULL,'Capcut pc, After Effect',NULL,'2026-04-28 00:55:07','2026-04-28 01:00:52');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `featured_videos`
--

/*!50001 DROP VIEW IF EXISTS `featured_videos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `featured_videos` AS select `v`.`id` AS `id`,`v`.`title` AS `title`,`v`.`description` AS `description`,`v`.`video_id` AS `video_id`,`v`.`category` AS `category`,`v`.`thumbnail_url` AS `thumbnail_url`,`v`.`views` AS `views`,`v`.`likes` AS `likes`,`v`.`duration` AS `duration`,`v`.`software` AS `software`,`v`.`created_at` AS `created_at` from `videos` `v` order by `v`.`views` desc,`v`.`likes` desc limit 10 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `recent_videos`
--

/*!50001 DROP VIEW IF EXISTS `recent_videos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `recent_videos` AS select `v`.`id` AS `id`,`v`.`title` AS `title`,`v`.`description` AS `description`,`v`.`video_id` AS `video_id`,`v`.`category` AS `category`,`v`.`thumbnail_url` AS `thumbnail_url`,`v`.`views` AS `views`,`v`.`likes` AS `likes`,`v`.`duration` AS `duration`,`v`.`software` AS `software`,`v`.`created_at` AS `created_at` from `videos` `v` order by `v`.`created_at` desc limit 20 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_stats`
--

/*!50001 DROP VIEW IF EXISTS `user_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `user_stats` AS select `u`.`role` AS `role`,count(0) AS `total_users`,sum((case when (`u`.`is_active` = 1) then 1 else 0 end)) AS `active_users`,max(`u`.`created_at`) AS `latest_user` from `users` `u` group by `u`.`role` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `video_stats`
--

/*!50001 DROP VIEW IF EXISTS `video_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`avnadmin`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `video_stats` AS select `v`.`category` AS `category`,count(0) AS `total_videos`,avg(`v`.`views`) AS `avg_views`,max(`v`.`created_at`) AS `latest_video` from `videos` `v` where (`v`.`category` is not null) group by `v`.`category` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-02 15:15:29
