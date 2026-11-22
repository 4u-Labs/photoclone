<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Same-origin guard
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ['https://4u.ia.br', 'https://www.4u.ia.br'], true)) {
    http_response_code(403);
    echo json_encode(['error' => 'Origem não autorizada']);
    exit;
}

// Per-IP rate limit: max 10 font uploads per hour
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rlFile = sys_get_temp_dir() . '/4u_font_rl_' . md5($ip) . '.json';
$now = time();
$hits = is_file($rlFile) ? (json_decode((string) file_get_contents($rlFile), true) ?: []) : [];
$hits = array_values(array_filter($hits, static fn($t) => is_int($t) && ($now - $t) < 3600));
if (count($hits) >= 10) {
    http_response_code(429);
    echo json_encode(['error' => 'Limite de uploads por hora atingido. Tente novamente mais tarde.']);
    exit;
}

if (!isset($_FILES['font']) || $_FILES['font']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo enviado ou erro no upload']);
    exit;
}

$file = $_FILES['font'];
$maxBytes = 5 * 1024 * 1024; // 5 MB max
if (($file['size'] ?? 0) <= 0 || $file['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(['error' => 'Arquivo de fonte deve ter no máximo 5 MB']);
    exit;
}

$origName = basename((string) $file['name']);
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
if (!in_array($ext, ['ttf', 'otf', 'woff', 'woff2'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Apenas arquivos de fonte .ttf, .otf, .woff ou .woff2 são aceitos']);
    exit;
}

// Validate real binary font magic header
$fh = @fopen($file['tmp_name'], 'rb');
$magic = $fh ? fread($fh, 4) : '';
if ($fh) fclose($fh);
$validMagics = ["\x00\x01\x00\x00", 'OTTO', 'true', 'ttcf', 'wOFF', 'wOF2'];
if (!in_array($magic, $validMagics, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Arquivo inválido: assinatura binária de fonte não reconhecida']);
    exit;
}

$safeBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
$safeBase = trim((string) $safeBase, '_');
if ($safeBase === '') $safeBase = 'font_' . bin2hex(random_bytes(4));
$safeName = substr($safeBase, 0, 60) . '.' . $ext;

$customDir = __DIR__ . '/fonts/custom';
if (!is_dir($customDir)) {
    mkdir($customDir, 0755, true);
}

$destPath = $customDir . '/' . $safeName;
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao salvar a fonte']);
    exit;
}
chmod($destPath, 0644);

$hits[] = $now;
@file_put_contents($rlFile, json_encode($hits), LOCK_EX);

$family = ucwords(trim(str_replace(['_', '-'], ' ', $safeBase)));
$manifestFile = __DIR__ . '/fonts/manifest.txt';
$manifestEntry = "{$family} | Regular | fonts/custom/{$safeName}";

$fp = fopen($manifestFile, 'c+');
if ($fp && flock($fp, LOCK_EX)) {
    $current = stream_get_contents($fp) ?: '';
    if (!str_contains($current, "fonts/custom/{$safeName}")) {
        fseek($fp, 0, SEEK_END);
        fwrite($fp, ($current !== '' && !str_ends_with($current, "\n") ? "\n" : '') . $manifestEntry . "\n");
    }
    flock($fp, LOCK_UN);
    fclose($fp);
}

echo json_encode([
    'success' => true,
    'family'  => $family,
    'file'    => "fonts/custom/{$safeName}",
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
