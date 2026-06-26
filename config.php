<?php
/* ============================================================
   purai — настройки проекта
   ============================================================ */

/* --- Подключение к базе данных (XAMPP по умолчанию) --- */
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'purai');

/* --- Ключ Groq API ---
   Без ключа функции ИИ (анализ состава, отзывы, фото) работать не будут.
   Получить ключ: https://console.groq.com/keys →  API Keys
   Вставьте его между кавычками ниже: */
define('GROQ_API_KEY', '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');    // <-- ВСТАВЬТЕ СВОЙ КЛЮЧ СЮДА

/* Модель ИИ (можно поменять при необходимости) */
define('AI_MODEL', 'llama-3.3-70b-versatile');
define('AI_MODEL_VISION', 'meta-llama/llama-4-scout-17b-16e-instruct');