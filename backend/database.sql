-- SQL Schema untuk Database B-Glow
-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `bglow_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bglow_db`;

-- Struktur dari tabel `users`
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `profile_photo` LONGTEXT DEFAULT NULL,
  `skin_type` VARCHAR(255) DEFAULT NULL,
  `acne_level` VARCHAR(255) DEFAULT NULL,
  `oil_level` VARCHAR(255) DEFAULT NULL,
  `pore_condition` VARCHAR(255) DEFAULT NULL,
  `skin_score` INT(11) DEFAULT 0,
  `sunscreen_interval` INT(11) DEFAULT 2,
  `favorites` LONGTEXT DEFAULT NULL,
  `diary_entries` LONGTEXT DEFAULT NULL,
  `routine` LONGTEXT DEFAULT NULL,
  `special_schedule` LONGTEXT DEFAULT NULL,
  `streak` LONGTEXT DEFAULT NULL,
  `routine_progress` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
