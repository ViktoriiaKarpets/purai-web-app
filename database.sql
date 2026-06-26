-- ============================================================
-- purai — структура базы данных
-- Запусти этот файл в phpMyAdmin (вкладка SQL) ИЛИ импортируй.
-- Сначала создастся база `purai`, затем таблицы.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `purai`
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `purai`;

-- Профиль пользователя (одна строка, id = 1).
-- Без системы аккаунтов — как в учебном примере. Можно расширить позже.
CREATE TABLE IF NOT EXISTS `profile` (
  `id`            INT PRIMARY KEY DEFAULT 1,
  `first_name`    VARCHAR(60)  DEFAULT '',
  `last_name`     VARCHAR(60)  DEFAULT '',
  `email`         VARCHAR(120) DEFAULT '',
  `avatar`        VARCHAR(20)  DEFAULT 'a1',
  `skin_type`     VARCHAR(40)  DEFAULT '',
  `age`           VARCHAR(10)  DEFAULT '',
  `concerns`      TEXT,          -- JSON-массив
  `sensitivities` TEXT,          -- JSON-массив
  `notes`         TEXT,
  `reminders`     TEXT,          -- JSON-массив
  `lang`          VARCHAR(5)   DEFAULT 'ru'
);

-- Продукты в косметичке
CREATE TABLE IF NOT EXISTS `products` (
  `id`             VARCHAR(32) PRIMARY KEY,
  `name`           VARCHAR(160) NOT NULL,
  `brand`          VARCHAR(120) DEFAULT '',
  `category`       VARCHAR(20)  DEFAULT 'skincare',   -- skincare | makeup
  `subtype`        VARCHAR(60)  DEFAULT '',
  `status`         VARCHAR(20)  DEFAULT 'current',    -- current | future | previous
  `ingredients`    TEXT,
  `photo`          LONGTEXT,      -- ссылка или data:URL
  `rating`         INT NULL,
  `price`          DECIMAL(10,2) NULL,
  `currency`       VARCHAR(6)   DEFAULT 'zł',
  `expiry`         VARCHAR(7)   DEFAULT '',           -- YYYY-MM
  `opened`         VARCHAR(10)  DEFAULT '',           -- YYYY-MM-DD
  `where_note`     TEXT,
  `note`           TEXT,
  `review_links`   TEXT,
  `analysis`       TEXT,          -- JSON (кэш анализа состава)
  `review_summary` TEXT,          -- JSON (кэш выжимки отзывов)
  `created_at`     BIGINT DEFAULT 0
);

-- Галерея фото лица
CREATE TABLE IF NOT EXISTS `gallery` (
  `id`         VARCHAR(32) PRIMARY KEY,
  `photo`      LONGTEXT,
  `date`       VARCHAR(10) DEFAULT '',
  `score`      INT NULL,
  `note`       TEXT,             -- JSON (наблюдения ИИ)
  `created_at` BIGINT DEFAULT 0
);

-- Анализы и заметки
CREATE TABLE IF NOT EXISTS `analyses` (
  `id`         VARCHAR(32) PRIMARY KEY,
  `date`       VARCHAR(10) DEFAULT '',
  `text`       TEXT,
  `photo`      LONGTEXT,
  `created_at` BIGINT DEFAULT 0
);

-- Журнал состояния кожи (для графика динамики), максимум 10 точек
CREATE TABLE IF NOT EXISTS `skin_log` (
  `id`         VARCHAR(32) PRIMARY KEY,
  `date`       VARCHAR(10) DEFAULT '',
  `score`      INT NOT NULL,
  `created_at` BIGINT DEFAULT 0
);
