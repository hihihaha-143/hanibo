-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: MySQL-8.4:3306
-- Время создания: Окт 17 2026 г., 11:38
-- Версия сервера: 8.4.8
-- Версия PHP: 8.5.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `hanibo`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `course_items`
--

CREATE TABLE `course_items` (
  `id` bigint UNSIGNED NOT NULL,
  `type` enum('lesson','extra','test') COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int UNSIGNED NOT NULL,
  `level_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extra_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `extras`
--

CREATE TABLE `extras` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `forms`
--

CREATE TABLE `forms` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `forms`
--

INSERT INTO `forms` (`id`, `title`, `order`, `created_at`, `updated_at`) VALUES
(1, 'вежливая', 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, 'неформальная', 2, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(3, 'формальная', 3, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(4, 'разговорная', 4, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(5, 'письменная', 5, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `grammar_phrase`
--

CREATE TABLE `grammar_phrase` (
  `id` bigint UNSIGNED NOT NULL,
  `grammar_rule_id` bigint UNSIGNED NOT NULL,
  `phrase_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `grammar_phrase`
--

INSERT INTO `grammar_phrase` (`id`, `grammar_rule_id`, `phrase_id`) VALUES
(1, 1, 2),
(2, 2, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `grammar_rules`
--

CREATE TABLE `grammar_rules` (
  `id` bigint UNSIGNED NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `construction` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `form_id` bigint UNSIGNED DEFAULT NULL,
  `level_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `grammar_rules`
--

INSERT INTO `grammar_rules` (`id`, `title`, `construction`, `form_id`, `level_id`, `created_at`, `updated_at`) VALUES
(1, 'Вежливая форма глагола -아요/-어요', 'V-아요 / V-어요', 1, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, 'Винительный падеж (частица 를/을)', 'N-를 / N-을', NULL, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_grammar`
--

CREATE TABLE `lesson_grammar` (
  `id` bigint UNSIGNED NOT NULL,
  `course_item_id` bigint UNSIGNED NOT NULL,
  `grammar_rule_id` bigint UNSIGNED NOT NULL,
  `order` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_phrase`
--

CREATE TABLE `lesson_phrase` (
  `id` bigint UNSIGNED NOT NULL,
  `course_item_id` bigint UNSIGNED NOT NULL,
  `phrase_id` bigint UNSIGNED NOT NULL,
  `order` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `lesson_word`
--

CREATE TABLE `lesson_word` (
  `id` bigint UNSIGNED NOT NULL,
  `course_item_id` bigint UNSIGNED NOT NULL,
  `word_id` bigint UNSIGNED NOT NULL,
  `order` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `levels`
--

CREATE TABLE `levels` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `levels`
--

INSERT INTO `levels` (`id`, `title`, `order`, `created_at`, `updated_at`) VALUES
(1, '1급', 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, '2급', 2, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(3, '3급', 3, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(4, '4급', 4, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(5, '5급', 5, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(6, '6급', 6, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `library_items`
--

CREATE TABLE `library_items` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cover_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pages` int UNSIGNED DEFAULT NULL,
  `year` smallint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `library_items`
--

INSERT INTO `library_items` (`id`, `title`, `author`, `type`, `description`, `cover_path`, `file_path`, `level`, `language`, `pages`, `year`, `created_at`, `updated_at`) VALUES
(1, 'Sejong Korean 1', 'King Sejong Institute', 'textbook', 'Базовый учебник корейского языка для начинающих.', 'library/covers/1.jpg', 'library/1.pdf', '1급', 'ko', 200, 2020, '2026-10-14 00:28:15', '2026-10-14 05:39:02'),
(2, 'Korean-Russian Dictionary', 'Lee Hyeon', 'dictionary', 'Корейско-русский словарь на 30 000 слов.', 'library/covers/2.jpg', 'library/2.pdf', NULL, 'mixed', 850, 2018, '2026-10-14 00:28:15', '2026-10-14 05:39:02'),
(3, 'The Little Prince (어린 왕자)', 'Antoine de Saint-Exupéry', 'book', '«Маленький принц» на корейском языке для чтения.', 'library/covers/3.jpg', 'library/3.pdf', '3급', 'ko', 120, 2015, '2026-10-14 00:28:15', '2026-10-14 05:39:03'),
(4, 'TOPIK I Workbook', 'Hanibo Team', 'workbook', 'Рабочая тетрадь для подготовки к TOPIK I.', 'library/covers/4.jpg', 'library/4.pdf', '1-2급', 'mixed', 180, 2022, '2026-10-14 00:28:15', '2026-10-14 05:39:03'),
(5, 'Hanibo Flashcards: Basic Verbs', 'Hanibo Team', 'flashcards', 'Набор карточек с базовыми корейскими глаголами.', 'library/covers/5.jpg', 'library/5.pdf', '1급', 'ko', 60, 2024, '2026-10-14 00:28:15', '2026-10-14 05:39:04');

-- --------------------------------------------------------

--
-- Структура таблицы `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_09_26_130212_create_personal_access_tokens_table', 1),
(5, '2026_09_27_045730_create_tips_table', 1),
(6, '2026_09_27_065033_create_course_items_table', 1),
(7, '2026_09_27_093212_create_extras_table', 1),
(8, '2026_09_27_093330_add_extra_id_to_course_items_table', 1),
(9, '2026_09_29_130447_create_levels_table', 1),
(10, '2026_09_29_130448_create_parts_of_speech_table', 1),
(11, '2026_09_29_130449_create_topics_table', 1),
(12, '2026_09_29_130450_create_words_table', 1),
(13, '2026_09_29_130451_create_word_topic_table', 1),
(14, '2026_09_29_130452_create_phrases_table', 1),
(15, '2026_09_29_130453_create_phrase_topic_table', 1),
(16, '2026_09_29_130454_create_lesson_word_table', 1),
(17, '2026_09_29_130455_create_lesson_phrase_table', 1),
(18, '2026_09_29_135825_create_phrase_word_table', 1),
(19, '2026_09_30_150403_create_forms_table', 1),
(20, '2026_09_30_150404_create_grammar_rules_table', 1),
(21, '2026_09_30_150405_create_grammar_examples_table', 1),
(22, '2026_09_30_150406_create_grammar_example_tokens_table', 1),
(23, '2026_09_30_150407_create_lesson_grammar_table', 1),
(24, '2026_09_30_150925_add_space_after_to_grammar_example_tokens_table', 1),
(25, '2026_09_30_152953_create_phrase_tokens_table', 1),
(26, '2026_09_30_153005_create_grammar_phrase_table', 1),
(27, '2026_09_30_153011_drop_grammar_examples_and_tokens_tables', 1),
(28, '2026_10_02_013106_add_level_id_to_course_items_table', 1),
(29, '2026_10_14_052225_create_library_items_table', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `parts_of_speech`
--

CREATE TABLE `parts_of_speech` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `parts_of_speech`
--

INSERT INTO `parts_of_speech` (`id`, `title`, `order`, `created_at`, `updated_at`) VALUES
(1, 'существительное', 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, 'глагол', 2, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(3, 'прилагательное', 3, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(4, 'наречие', 4, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(5, 'местоимение', 5, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(6, 'числительное', 6, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(7, 'частица', 7, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(8, 'междометие', 8, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(9, 'счётное слово', 9, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 1, 'spa', '6133d3fdbfda4b0fb9728e49d0d9d59ae75db118bdf67bb82d94a88e792b265b', '[\"*\"]', '2026-10-12 20:17:25', NULL, '2026-10-11 21:25:38', '2026-10-12 20:17:25'),
(6, 'App\\Models\\User', 1, 'spa', '5b66013721b679b3d749dcf633e11237024f631b0f469ce7df79f3cce034f932', '[\"*\"]', '2026-10-14 06:05:52', NULL, '2026-10-12 20:35:42', '2026-10-14 06:05:52'),
(7, 'App\\Models\\User', 1, 'spa', '916b3e5c5abe265214db5d83fd7f1ba3f583e658be91206209c64801a8b4d067', '[\"*\"]', NULL, NULL, '2026-10-14 20:15:24', '2026-10-14 20:15:24'),
(8, 'App\\Models\\User', 1, 'spa', '92e43237a6d5f6321010adcc832c8dbc1f0230e2207eae18337272aa1dc155b0', '[\"*\"]', '2026-10-15 20:07:21', NULL, '2026-10-14 20:15:28', '2026-10-15 20:07:21'),
(9, 'App\\Models\\User', 1, 'spa', '115ce828651045f3381d08b4b92883aa584e0de0906b73c54a76e428d8a2d697', '[\"*\"]', NULL, NULL, '2026-10-15 20:07:21', '2026-10-15 20:07:21'),
(10, 'App\\Models\\User', 1, 'spa', '23fd0cd77fd898c1575d1ba184df940cffe866f4b14a835fba9e7015870fdfda', '[\"*\"]', '2026-10-16 22:13:59', NULL, '2026-10-15 20:12:26', '2026-10-16 22:13:59');

-- --------------------------------------------------------

--
-- Структура таблицы `phrases`
--

CREATE TABLE `phrases` (
  `id` bigint UNSIGNED NOT NULL,
  `hangul` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `translation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `level_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `phrases`
--

INSERT INTO `phrases` (`id`, `hangul`, `translation`, `level_id`, `created_at`, `updated_at`) VALUES
(1, '안녕하세요', 'Здравствуйте', 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, '사과를 먹어요', 'Я ем яблоко', 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `phrase_tokens`
--

CREATE TABLE `phrase_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `phrase_id` bigint UNSIGNED NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `space_after` tinyint(1) NOT NULL DEFAULT '0',
  `word_id` bigint UNSIGNED DEFAULT NULL,
  `grammar_rule_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `phrase_tokens`
--

INSERT INTO `phrase_tokens` (`id`, `phrase_id`, `order`, `text`, `space_after`, `word_id`, `grammar_rule_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '사과', 0, 3, NULL, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, 2, 2, '를', 1, NULL, 2, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(3, 2, 3, '먹', 0, 4, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(4, 2, 4, '어요', 0, NULL, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `phrase_topic`
--

CREATE TABLE `phrase_topic` (
  `id` bigint UNSIGNED NOT NULL,
  `phrase_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `phrase_topic`
--

INSERT INTO `phrase_topic` (`id`, `phrase_id`, `topic_id`) VALUES
(1, 1, 1),
(2, 2, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `phrase_word`
--

CREATE TABLE `phrase_word` (
  `id` bigint UNSIGNED NOT NULL,
  `phrase_id` bigint UNSIGNED NOT NULL,
  `word_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `phrase_word`
--

INSERT INTO `phrase_word` (`id`, `phrase_id`, `word_id`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 2, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tips`
--

CREATE TABLE `tips` (
  `id` bigint UNSIGNED NOT NULL,
  `type` enum('advice','fact') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tips`
--

INSERT INTO `tips` (`id`, `type`, `content`, `created_at`, `updated_at`) VALUES
(1, 'advice', 'Повторяйте 10 новых слов каждый день — через неделю это уже 70!', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(2, 'advice', 'Смотрите корейские дорамы с субтитрами — так вы привыкаете к живой речи.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(3, 'advice', 'Записывайте новые слова в контексте, а не списком — так они лучше запоминаются.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(4, 'advice', 'Говорите вслух, даже если одни дома. Произношение тренируется только практикой.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(5, 'advice', 'Учите не отдельные слова, а целые фразы — это ускоряет разговорную речь.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(6, 'fact', 'В Корее возраст считается не с дня рождения, а с момента зачатия — поэтому новорождённому уже 1 год.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(7, 'fact', 'Корейский алфавит хангыль был создан в 1443 году королём Седжоном Великим и считается одним из самых логичных в мире.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(8, 'fact', 'В корейском нет понятия «ты» в привычном смысле — используются разные формы обращения в зависимости от статуса собеседника.', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(9, 'fact', 'Слово «우리» (uri, «наш») корейцы используют даже для «мой» — «우리 집» буквально «наш дом», но означает «мой дом».', '2026-10-11 21:16:16', '2026-10-11 21:16:16'),
(10, 'fact', 'В Корее есть праздник Чусок — аналог Нового года, когда вся семья собирается вместе и готовит традиционные блюда.', '2026-10-11 21:16:16', '2026-10-11 21:16:16');

-- --------------------------------------------------------

--
-- Структура таблицы `topics`
--

CREATE TABLE `topics` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `topics`
--

INSERT INTO `topics` (`id`, `title`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Приветствия', 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, 'Дом', 2, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(3, 'Еда', 3, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `language_level` enum('A1','A2','B1','B2','C1','C2') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `strawberry` int UNSIGNED NOT NULL DEFAULT '0',
  `blueberry` int UNSIGNED NOT NULL DEFAULT '0',
  `exp` int UNSIGNED NOT NULL DEFAULT '0',
  `streak_current` int UNSIGNED NOT NULL DEFAULT '0',
  `streak_best` int UNSIGNED NOT NULL DEFAULT '0',
  `streak_last_date` date DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `nickname`, `email`, `email_verified_at`, `password`, `role`, `language_level`, `avatar`, `strawberry`, `blueberry`, `exp`, `streak_current`, `streak_best`, `streak_last_date`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'nick', 'chickpiupiu@gmail.com', NULL, '$2y$12$X3dSDoWUJ8ZTqAoVwUGwTO.2HFbGxNGuQ2Yuv1my7ABDev/L9eXsi', 'user', NULL, NULL, 0, 0, 0, 0, 0, NULL, NULL, '2026-10-11 21:24:31', '2026-10-11 21:24:31');

-- --------------------------------------------------------

--
-- Структура таблицы `words`
--

CREATE TABLE `words` (
  `id` bigint UNSIGNED NOT NULL,
  `hangul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `translation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `part_of_speech_id` bigint UNSIGNED DEFAULT NULL,
  `level_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `words`
--

INSERT INTO `words` (`id`, `hangul`, `translation`, `part_of_speech_id`, `level_id`, `created_at`, `updated_at`) VALUES
(1, '안녕', 'привет', 1, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(2, '안녕하세요', 'здравствуйте', 1, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(3, '사과', 'яблоко', 1, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14'),
(4, '먹다', 'есть (кушать)', 2, 1, '2026-10-11 21:15:14', '2026-10-11 21:15:14');

-- --------------------------------------------------------

--
-- Структура таблицы `word_topic`
--

CREATE TABLE `word_topic` (
  `id` bigint UNSIGNED NOT NULL,
  `word_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `word_topic`
--

INSERT INTO `word_topic` (`id`, `word_id`, `topic_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 3),
(4, 4, 3);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Индексы таблицы `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Индексы таблицы `course_items`
--
ALTER TABLE `course_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_items_order_unique` (`order`),
  ADD KEY `course_items_extra_id_foreign` (`extra_id`),
  ADD KEY `course_items_level_id_foreign` (`level_id`);

--
-- Индексы таблицы `extras`
--
ALTER TABLE `extras`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Индексы таблицы `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `grammar_phrase`
--
ALTER TABLE `grammar_phrase`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `grammar_phrase_grammar_rule_id_phrase_id_unique` (`grammar_rule_id`,`phrase_id`),
  ADD KEY `grammar_phrase_phrase_id_foreign` (`phrase_id`);

--
-- Индексы таблицы `grammar_rules`
--
ALTER TABLE `grammar_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grammar_rules_form_id_foreign` (`form_id`),
  ADD KEY `grammar_rules_level_id_foreign` (`level_id`);

--
-- Индексы таблицы `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Индексы таблицы `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `lesson_grammar`
--
ALTER TABLE `lesson_grammar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lesson_grammar_course_item_id_grammar_rule_id_unique` (`course_item_id`,`grammar_rule_id`),
  ADD KEY `lesson_grammar_grammar_rule_id_foreign` (`grammar_rule_id`);

--
-- Индексы таблицы `lesson_phrase`
--
ALTER TABLE `lesson_phrase`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lesson_phrase_course_item_id_phrase_id_unique` (`course_item_id`,`phrase_id`),
  ADD KEY `lesson_phrase_phrase_id_foreign` (`phrase_id`);

--
-- Индексы таблицы `lesson_word`
--
ALTER TABLE `lesson_word`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lesson_word_course_item_id_word_id_unique` (`course_item_id`,`word_id`),
  ADD KEY `lesson_word_word_id_foreign` (`word_id`);

--
-- Индексы таблицы `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `library_items`
--
ALTER TABLE `library_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `library_items_type_index` (`type`);

--
-- Индексы таблицы `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `parts_of_speech`
--
ALTER TABLE `parts_of_speech`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Индексы таблицы `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Индексы таблицы `phrases`
--
ALTER TABLE `phrases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phrases_level_id_foreign` (`level_id`);

--
-- Индексы таблицы `phrase_tokens`
--
ALTER TABLE `phrase_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phrase_tokens_phrase_id_foreign` (`phrase_id`),
  ADD KEY `phrase_tokens_word_id_foreign` (`word_id`),
  ADD KEY `phrase_tokens_grammar_rule_id_foreign` (`grammar_rule_id`);

--
-- Индексы таблицы `phrase_topic`
--
ALTER TABLE `phrase_topic`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phrase_topic_phrase_id_topic_id_unique` (`phrase_id`,`topic_id`),
  ADD KEY `phrase_topic_topic_id_foreign` (`topic_id`);

--
-- Индексы таблицы `phrase_word`
--
ALTER TABLE `phrase_word`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phrase_word_phrase_id_word_id_unique` (`phrase_id`,`word_id`),
  ADD KEY `phrase_word_word_id_foreign` (`word_id`);

--
-- Индексы таблицы `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Индексы таблицы `tips`
--
ALTER TABLE `tips`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_nickname_unique` (`nickname`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Индексы таблицы `words`
--
ALTER TABLE `words`
  ADD PRIMARY KEY (`id`),
  ADD KEY `words_part_of_speech_id_foreign` (`part_of_speech_id`),
  ADD KEY `words_level_id_foreign` (`level_id`);

--
-- Индексы таблицы `word_topic`
--
ALTER TABLE `word_topic`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `word_topic_word_id_topic_id_unique` (`word_id`,`topic_id`),
  ADD KEY `word_topic_topic_id_foreign` (`topic_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `course_items`
--
ALTER TABLE `course_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `extras`
--
ALTER TABLE `extras`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `forms`
--
ALTER TABLE `forms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `grammar_phrase`
--
ALTER TABLE `grammar_phrase`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `grammar_rules`
--
ALTER TABLE `grammar_rules`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `lesson_grammar`
--
ALTER TABLE `lesson_grammar`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `lesson_phrase`
--
ALTER TABLE `lesson_phrase`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `lesson_word`
--
ALTER TABLE `lesson_word`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `levels`
--
ALTER TABLE `levels`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `library_items`
--
ALTER TABLE `library_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT для таблицы `parts_of_speech`
--
ALTER TABLE `parts_of_speech`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `phrases`
--
ALTER TABLE `phrases`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `phrase_tokens`
--
ALTER TABLE `phrase_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `phrase_topic`
--
ALTER TABLE `phrase_topic`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `phrase_word`
--
ALTER TABLE `phrase_word`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `tips`
--
ALTER TABLE `tips`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `topics`
--
ALTER TABLE `topics`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `words`
--
ALTER TABLE `words`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `word_topic`
--
ALTER TABLE `word_topic`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `course_items`
--
ALTER TABLE `course_items`
  ADD CONSTRAINT `course_items_extra_id_foreign` FOREIGN KEY (`extra_id`) REFERENCES `extras` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `course_items_level_id_foreign` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `grammar_phrase`
--
ALTER TABLE `grammar_phrase`
  ADD CONSTRAINT `grammar_phrase_grammar_rule_id_foreign` FOREIGN KEY (`grammar_rule_id`) REFERENCES `grammar_rules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grammar_phrase_phrase_id_foreign` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `grammar_rules`
--
ALTER TABLE `grammar_rules`
  ADD CONSTRAINT `grammar_rules_form_id_foreign` FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grammar_rules_level_id_foreign` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `lesson_grammar`
--
ALTER TABLE `lesson_grammar`
  ADD CONSTRAINT `lesson_grammar_course_item_id_foreign` FOREIGN KEY (`course_item_id`) REFERENCES `course_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_grammar_grammar_rule_id_foreign` FOREIGN KEY (`grammar_rule_id`) REFERENCES `grammar_rules` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `lesson_phrase`
--
ALTER TABLE `lesson_phrase`
  ADD CONSTRAINT `lesson_phrase_course_item_id_foreign` FOREIGN KEY (`course_item_id`) REFERENCES `course_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_phrase_phrase_id_foreign` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `lesson_word`
--
ALTER TABLE `lesson_word`
  ADD CONSTRAINT `lesson_word_course_item_id_foreign` FOREIGN KEY (`course_item_id`) REFERENCES `course_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_word_word_id_foreign` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `phrases`
--
ALTER TABLE `phrases`
  ADD CONSTRAINT `phrases_level_id_foreign` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `phrase_tokens`
--
ALTER TABLE `phrase_tokens`
  ADD CONSTRAINT `phrase_tokens_grammar_rule_id_foreign` FOREIGN KEY (`grammar_rule_id`) REFERENCES `grammar_rules` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `phrase_tokens_phrase_id_foreign` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phrase_tokens_word_id_foreign` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `phrase_topic`
--
ALTER TABLE `phrase_topic`
  ADD CONSTRAINT `phrase_topic_phrase_id_foreign` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phrase_topic_topic_id_foreign` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `phrase_word`
--
ALTER TABLE `phrase_word`
  ADD CONSTRAINT `phrase_word_phrase_id_foreign` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phrase_word_word_id_foreign` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `words`
--
ALTER TABLE `words`
  ADD CONSTRAINT `words_level_id_foreign` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `words_part_of_speech_id_foreign` FOREIGN KEY (`part_of_speech_id`) REFERENCES `parts_of_speech` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `word_topic`
--
ALTER TABLE `word_topic`
  ADD CONSTRAINT `word_topic_topic_id_foreign` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `word_topic_word_id_foreign` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
