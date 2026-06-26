<?php
/* ============================================================
   purai — data API (CRUD к базе данных)
   Все запросы используют подготовленные выражения (защита от SQL-инъекций).
   ============================================================ */
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';
$in = body_json();
if ($action === '') $action = $in['action'] ?? '';

function jdec($s){ $d = json_decode((string)$s, true); return $d; }

switch ($action) {

/* ---------- ЗАГРУЗКА ВСЕХ ДАННЫХ ---------- */
case 'bootstrap': {
    $conn->query("INSERT IGNORE INTO profile (id) VALUES (1)");
    $p = $conn->query("SELECT * FROM profile WHERE id=1")->fetch_assoc();
    $profile = [
        'firstName' => $p['first_name'], 'lastName' => $p['last_name'], 'email' => $p['email'],
        'avatar' => $p['avatar'] ?: 'a1',
        'skinType' => $p['skin_type'], 'age' => $p['age'],
        'concerns' => jdec($p['concerns']) ?: [], 'sensitivities' => jdec($p['sensitivities']) ?: [],
        'notes' => $p['notes'] ?: '', 'reminders' => jdec($p['reminders']) ?: [],
        'lang' => $p['lang'] ?: 'ru',
        'gallery' => [], 'analyses' => [], 'log' => []
    ];
    $r = $conn->query("SELECT * FROM gallery ORDER BY created_at DESC");
    while ($g = $r->fetch_assoc()) $profile['gallery'][] = [
        'id'=>$g['id'],'photo'=>$g['photo'],'date'=>$g['date'],
        'score'=>($g['score']===null?null:(int)$g['score']),'note'=>jdec($g['note'])
    ];
    $r = $conn->query("SELECT * FROM analyses ORDER BY created_at DESC");
    while ($a = $r->fetch_assoc()) $profile['analyses'][] = ['id'=>$a['id'],'date'=>$a['date'],'text'=>$a['text'],'photo'=>$a['photo']];
    $r = $conn->query("SELECT * FROM skin_log ORDER BY date ASC");
    while ($l = $r->fetch_assoc()) $profile['log'][] = ['id'=>$l['id'],'date'=>$l['date'],'score'=>(int)$l['score']];

    $products = [];
    $r = $conn->query("SELECT * FROM products ORDER BY created_at DESC");
    while ($row = $r->fetch_assoc()) {
        $products[] = [
            'id'=>$row['id'],'name'=>$row['name'],'brand'=>$row['brand'],'category'=>$row['category'],
            'subtype'=>$row['subtype'],'status'=>$row['status'],'ingredients'=>$row['ingredients'],
            'photo'=>$row['photo'],'rating'=>($row['rating']===null?null:(int)$row['rating']),
            'price'=>($row['price']===null?null:(float)$row['price']),'currency'=>$row['currency'],
            'expiry'=>$row['expiry'],'opened'=>$row['opened'],'where'=>$row['where_note'],'note'=>$row['note'],
            'reviewLinks'=>$row['review_links'],'analysis'=>jdec($row['analysis']),'reviewSummary'=>jdec($row['review_summary']),
            'createdAt'=>(int)$row['created_at']
        ];
    }
    out(['profile'=>$profile, 'products'=>$products]);
}

/* ---------- ПРОФИЛЬ ---------- */
case 'saveProfile': {
    $p = $in['profile'] ?? [];
    $stmt = $conn->prepare("INSERT INTO profile (id,first_name,last_name,email,avatar,skin_type,age,concerns,sensitivities,notes,reminders,lang)
        VALUES (1,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE first_name=VALUES(first_name),last_name=VALUES(last_name),email=VALUES(email),
        avatar=VALUES(avatar),skin_type=VALUES(skin_type),age=VALUES(age),concerns=VALUES(concerns),
        sensitivities=VALUES(sensitivities),notes=VALUES(notes),reminders=VALUES(reminders),lang=VALUES(lang)");
    $fn=$p['firstName']??''; $ln=$p['lastName']??''; $em=$p['email']??''; $av=$p['avatar']??'a1';
    $st=$p['skinType']??''; $ag=$p['age']??''; $co=json_encode($p['concerns']??[]); $se=json_encode($p['sensitivities']??[]);
    $no=$p['notes']??''; $re=json_encode($p['reminders']??[]); $la=$p['lang']??'ru';
    $stmt->bind_param("sssssssssss",$fn,$ln,$em,$av,$st,$ag,$co,$se,$no,$re,$la);
    $stmt->execute();
    out(['status'=>'ok']);
}

/* ---------- ПРОДУКТЫ ---------- */
case 'saveProduct': {
    $p = $in['product'] ?? [];
    $stmt = $conn->prepare("INSERT INTO products
        (id,name,brand,category,subtype,status,ingredients,photo,rating,price,currency,expiry,opened,where_note,note,review_links,analysis,review_summary,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE name=VALUES(name),brand=VALUES(brand),category=VALUES(category),subtype=VALUES(subtype),
        status=VALUES(status),ingredients=VALUES(ingredients),photo=VALUES(photo),rating=VALUES(rating),price=VALUES(price),
        currency=VALUES(currency),expiry=VALUES(expiry),opened=VALUES(opened),where_note=VALUES(where_note),note=VALUES(note),
        review_links=VALUES(review_links),analysis=VALUES(analysis),review_summary=VALUES(review_summary)");
    $id=$p['id']; $nm=$p['name']??''; $br=$p['brand']??''; $cat=$p['category']??'skincare'; $sub=$p['subtype']??'';
    $stt=$p['status']??'current'; $ing=$p['ingredients']??''; $ph=$p['photo']??'';
    $rt=isset($p['rating'])&&$p['rating']!==''?(int)$p['rating']:null;
    $pr=isset($p['price'])&&$p['price']!==''&&$p['price']!==null?(float)$p['price']:null;
    $cur=$p['currency']??'zł'; $exp=$p['expiry']??''; $op=$p['opened']??''; $wh=$p['where']??''; $nt=$p['note']??'';
    $rl=$p['reviewLinks']??''; $an=isset($p['analysis'])?json_encode($p['analysis']):null;
    $rs=isset($p['reviewSummary'])?json_encode($p['reviewSummary']):null; $ca=(int)($p['createdAt']??0);
    $stmt->bind_param("ssssssssidssssssssi",$id,$nm,$br,$cat,$sub,$stt,$ing,$ph,$rt,$pr,$cur,$exp,$op,$wh,$nt,$rl,$an,$rs,$ca);
    $stmt->execute();
    out(['status'=>'ok']);
}
case 'deleteProduct': {
    $stmt = $conn->prepare("DELETE FROM products WHERE id=?");
    $id=$in['id']??''; $stmt->bind_param("s",$id); $stmt->execute();
    out(['status'=>'ok']);
}

/* ---------- ГАЛЕРЕЯ ---------- */
case 'addGallery': {
    $g=$in['entry']??[];
    $stmt=$conn->prepare("INSERT INTO gallery (id,photo,date,score,note,created_at) VALUES (?,?,?,?,?,?)");
    $id=$g['id']; $ph=$g['photo']??''; $dt=$g['date']??''; $sc=isset($g['score'])?(int)$g['score']:null;
    $nt=isset($g['note'])?json_encode($g['note']):null; $ca=(int)($g['createdAt']??0);
    $stmt->bind_param("sssisi",$id,$ph,$dt,$sc,$nt,$ca); $stmt->execute();
    out(['status'=>'ok']);
}
case 'updateGallery': {
    $g=$in['entry']??[];
    $stmt=$conn->prepare("UPDATE gallery SET score=?, note=? WHERE id=?");
    $sc=isset($g['score'])?(int)$g['score']:null; $nt=isset($g['note'])?json_encode($g['note']):null; $id=$g['id'];
    $stmt->bind_param("iss",$sc,$nt,$id); $stmt->execute();
    out(['status'=>'ok']);
}
case 'deleteGallery': {
    $stmt=$conn->prepare("DELETE FROM gallery WHERE id=?"); $id=$in['id']??''; $stmt->bind_param("s",$id); $stmt->execute();
    out(['status'=>'ok']);
}

/* ---------- АНАЛИЗЫ ---------- */
case 'addAnalysis': {
    $a=$in['entry']??[];
    $stmt=$conn->prepare("INSERT INTO analyses (id,date,text,photo,created_at) VALUES (?,?,?,?,?)");
    $id=$a['id']; $dt=$a['date']??''; $tx=$a['text']??''; $ph=$a['photo']??''; $ca=(int)($a['createdAt']??0);
    $stmt->bind_param("ssssi",$id,$dt,$tx,$ph,$ca); $stmt->execute();
    out(['status'=>'ok']);
}
case 'deleteAnalysis': {
    $stmt=$conn->prepare("DELETE FROM analyses WHERE id=?"); $id=$in['id']??''; $stmt->bind_param("s",$id); $stmt->execute();
    out(['status'=>'ok']);
}

/* ---------- ЖУРНАЛ КОЖИ ---------- */
case 'saveLog': {
    $l=$in['entry']??[];
    $stmt=$conn->prepare("INSERT INTO skin_log (id,date,score,created_at) VALUES (?,?,?,?)
        ON DUPLICATE KEY UPDATE date=VALUES(date),score=VALUES(score)");
    $id=$l['id']; $dt=$l['date']??''; $sc=(int)($l['score']??0); $ca=(int)($l['createdAt']??0);
    $stmt->bind_param("ssii",$id,$dt,$sc,$ca); $stmt->execute();
    out(['status'=>'ok']);
}
case 'deleteLog': {
    $stmt=$conn->prepare("DELETE FROM skin_log WHERE id=?"); $id=$in['id']??''; $stmt->bind_param("s",$id); $stmt->execute();
    out(['status'=>'ok']);
}

default:
    http_response_code(400);
    out(['error'=>'unknown_action','action'=>$action]);
}
