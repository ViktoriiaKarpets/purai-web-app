<?php
require_once __DIR__ . '/db.php';

if (GROQ_API_KEY === '') {
    out(['error' => 'nokey', 'message' => 'Вставьте ключ Groq в php/config.php']);
}

$in   = body_json();
$type = $in['type'] ?? '';
$lang = ($in['lang'] ?? 'ru') === 'pl' ? 'pl' : 'ru';
$langLine = $lang === 'pl'
    ? 'WAŻNE: Odpowiadaj WYŁĄCZNIE po polsku. Wszystkie wartości w JSON muszą być po polsku. Nigdy nie używaj rosyjskiego.'
    : 'ВАЖНО: Отвечай ТОЛЬКО на русском языке. Все значения в JSON должны быть на русском. Никогда не используй польский.';

$profileText  = $in['profileText']  ?? '';
$analysesText = $in['analysesText'] ?? '';
$ingredients  = $in['ingredients']  ?? '';
$productName  = $in['productName']  ?? '';
$links        = $in['links']        ?? '';
$image        = $in['image']        ?? '';

$system = '';
$userContent = '';
$model = AI_MODEL;
$messages = [];

if ($type === 'ingredients') {
    $system = "You are an expert cosmetic chemist who analyzes INCI ingredient lists. You have deep knowledge of how each specific ingredient interacts with different skin types. You MUST give HONEST, DIFFERENTIATED scores based on actual ingredient analysis. You MUST respond with ONLY a valid JSON object. No markdown. $langLine";
    $userContent = "Skin profile:\n$profileText\n\nTests/analyses:\n" . ($analysesText ?: 'none') . "\n\nProduct INCI:\n$ingredients\n\nRespond with EXACTLY this JSON structure (fill in the values, keep the keys in English exactly as shown):\n{\"compatibility\": 75, \"verdict\": \"short 2-4 word verdict\", \"good\": [{\"name\": \"Ingredient Name\", \"why\": \"1-2 sentence explanation\"}], \"caution\": [{\"name\": \"Ingredient Name\", \"why\": \"1-2 sentence explanation\"}], \"avoid\": [{\"name\": \"Ingredient Name\", \"why\": \"1-2 sentence explanation\"}], \"summary\": \"3-4 sentence overall assessment\"}\n\nRULES:\n- compatibility is an integer 0-100\n- 3-5 items per array, only significant ingredients\n- All text values (verdict, why, summary) must be in " . ($lang === 'pl' ? 'Polish' : 'Russian') . "\n- JSON keys must be exactly: compatibility, verdict, good, caution, avoid, summary, name, why\n- Do NOT use any other key names\n- Do NOT wrap in markdown\n- CRITICAL SCORING GUIDE: Analyze EACH ingredient individually. Products with harsh surfactants (SLS, SLES), alcohol denat, fragrance/parfum high in the list = penalize heavily (40-55%). Products with proven actives (niacinamide, ceramides, zinc, centella, panthenol, salicylic acid) = reward (75-90%). Score must reflect ACTUAL ingredient quality for THIS specific skin type.\n- IMPORTANT: compatibility score MUST vary realistically. Analyze the ACTUAL ingredients: if product has mostly gentle, beneficial ingredients for this skin = 78-92%. If mixed (some good, some irritants) = 55-72%. If many harsh or irritating ingredients = 35-50%. Each product MUST get a DIFFERENT score. Never give the same score to all products.";
    $parts = [];
    $messages = [['role' => 'user', 'content' => $userContent]];

} elseif ($type === 'review') {
    $system = "Ты делаешь честную краткую выжимку отзывов о косметике. Пиши своими словами. $langLine Ответ — ТОЛЬКО валидный JSON без markdown.";
    $userContent = "Продукт: \"$productName\".\nПрофиль кожи:\n$profileText\n\nТекст отзывов/ссылки:\n$links\n\nВерни JSON: {\"summary\":\"<2-3 предложения>\",\"pros\":[\"коротко\",...],\"cons\":[\"коротко\",...],\"fitsYourSkin\":\"<словами>\",\"fitLevel\":\"<yes|rather_yes|unclear|rather_no|no>\",\"reviewed\":\"<насколько много отзывов>\"}";
    $messages = [['role' => 'user', 'content' => $userContent]];

} elseif ($type === 'face') {
    $model = AI_MODEL_VISION;
    $system = "You are a gentle cosmetic skin assistant. You analyze face photos to describe ONLY visible skin features. You NEVER diagnose diseases, judge appearance, or identify the person. You MUST respond with ONLY a valid JSON object, nothing else. No markdown. $langLine";
    $userContent = "Skin profile:\n$profileText\n\nAnalyze this face photo and respond with EXACTLY this JSON structure:\n{\"observations\": [\"visible observation 1\", \"visible observation 2\"], \"assumptions\": [\"gentle assumption 1\", \"gentle assumption 2\"], \"gentleTip\": \"one kind skincare recommendation\", \"score\": 7}\n\nSCORING RULES for the score field (integer 1-10):\n- 1-2: severe visible issues (heavy acne, strong irritation, many problem areas)\n- 3-4: noticeable issues (visible acne, redness, uneven texture)\n- 5-6: moderate issues (some blemishes, minor redness, visible pores)\n- 7-8: good condition (mostly clear, minor imperfections, healthy tone)\n- 9-10: excellent condition (clear, even tone, healthy glow)\nBe HONEST and DIFFERENTIATE between photos. A photo with visible acne and inflammation should score 3-5, not 6-7.\n\nRULES:\n- Max 4 items per array\n- All text values in " . ($lang === 'pl' ? 'Polish' : 'Russian') . "\n- JSON keys must be exactly: observations, assumptions, gentleTip, score\n- Be supportive but ACCURATE in scoring";

    if (preg_match('/^data:([^;]+);base64,(.*)$/', $image, $m)) {
        $messages = [['role' => 'user', 'content' => [
            ['type' => 'image_url', 'image_url' => ['url' => $image]],
            ['type' => 'text', 'text' => $userContent]
        ]]];
    } else {
        out(['error' => 'noimage']);
    }

} else {
    out(['error' => 'bad_type']);
}

$payload = [
    'model' => $model,
    'messages' => array_merge([['role' => 'system', 'content' => $system]], $messages),
    'temperature' => 0.3,
    'max_tokens' => 1500
];

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . GROQ_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE)
]);
$resp = curl_exec($ch);
$err  = curl_error($ch);
curl_close($ch);

if ($resp === false) out(['error' => 'curl', 'message' => $err]);

$data = json_decode($resp, true);

if (isset($data['error'])) {
    out(['error' => 'api', 'message' => $data['error']['message'] ?? 'API error']);
}

$text = $data['choices'][0]['message']['content'] ?? '';
out(['text' => $text]);