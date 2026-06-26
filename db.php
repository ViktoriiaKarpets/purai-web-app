<?php
/* Подключение к базе данных + вспомогательные функции */
require_once __DIR__ . '/config.php';

mysqli_report(MYSQLI_REPORT_OFF); // ошибки обрабатываем вручную

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
header('Content-Type: application/json; charset=utf-8');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'db', 'message' => $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8mb4');

/* Прочитать JSON-тело запроса */
function body_json() {
    $raw = file_get_contents('php://input');
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}

/* Отдать JSON и завершить */
function out($x) {
    echo json_encode($x, JSON_UNESCAPED_UNICODE);
    exit;
}
