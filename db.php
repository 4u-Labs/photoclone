<?php
$env_path = __DIR__ . '/.env';
if (file_exists($env_path)) {
    $lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if(count($parts) == 2) {
            $_ENV[trim($parts[0])] = trim($parts[1]);
        }
    }
}

$data_dir = __DIR__ . '/data';
if (!file_exists($data_dir)) {
    mkdir($data_dir, 0755, true);
    file_put_contents($data_dir.'/.htaccess', "Order allow,deny\nDeny from all\n");
}

$db_file = $data_dir . '/dados.db';
$is_new = !file_exists($db_file);

try {
    $db = new PDO('sqlite:' . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($is_new) {
        $db->exec("CREATE TABLE payments (
            id TEXT PRIMARY KEY,
            token TEXT,
            payment_id TEXT,
            amount REAL,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
    }
} catch (Exception $e) {
    die("DB Error: " . $e->getMessage());
}
?>
