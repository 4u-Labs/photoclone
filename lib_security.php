<?php
/**
 * LIB_SECURITY - Biblioteca de Segurança e Utilidades Premium (IDΞI.ΛⱣⱣ)
 */

function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            putenv(trim($name) . "=" . trim($value, " \t\n\r\0\x0B\""));
            $_ENV[trim($name)] = trim($value, " \t\n\r\0\x0B\"");
        }
    }
}

// Inicializar Ambiente
if (file_exists(__DIR__ . '/.env')) {
    loadEnv(__DIR__ . '/.env');
}
if (file_exists(__DIR__ . '/../.env')) {
    loadEnv(__DIR__ . '/../.env');
}

// Configurações Globais
define('S_SALT', $_ENV['FINGERPRINT_SALT'] ?? getenv('FINGERPRINT_SALT') ?: 'default_salt_123');
define('ADMIN_PASS', $_ENV['ADMIN_PASS'] ?? getenv('ADMIN_PASS') ?: 'Fbr4g4@');

/**
 * Super Hash de Identidade
 */
function getSuperHash($fingerprint = '') {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return hash('sha256', $ip . $fingerprint . S_SALT);
}

/**
 * Rate Limit (Anti-Flooding) - Máx 1 req / 2s
 */
function checkRateLimitLegacy() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $limit_file = __DIR__ . '/data/rate_limit_' . md5($ip) . '.json';
    
    if (!is_dir(__DIR__ . '/data')) {
        mkdir(__DIR__ . '/data', 0755, true);
    }

    if (file_exists($limit_file)) {
        $data = json_decode(file_get_contents($limit_file), true);
        if ($data && (time() - $data['last_req']) < 2) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded. Please wait 2 seconds.']);
            exit;
        }
    }
    
    file_put_contents($limit_file, json_encode(['last_req' => time()]));
}

/**
 * Gets the DB connection (SQLite)
 */
function getDB() {
    $db_path = __DIR__ . '/data/dados.db';
    if (!is_dir(__DIR__ . '/data')) {
        mkdir(__DIR__ . '/data', 0755, true);
    }
    
    try {
        $db = new PDO('sqlite:' . $db_path);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Inicializar tabelas básicas se não existirem
        $db->exec("CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hash TEXT UNIQUE,
            credits INTEGER DEFAULT 5,
            last_access DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        
        $db->exec("CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_hash TEXT,
            mp_id TEXT,
            status TEXT,
            amount DECIMAL(10,2),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        
        // Manutenção (Cleanup e Backup)
        runCleanup(__DIR__ . '/data');
        runBackup($db_path);

        return $db;
    } catch (PDOException $e) {
        return null;
    }
}

/**
 * Backup Automático (Retenção de 3 dias)
 */
function runBackup($db_path) {
    if (!file_exists($db_path)) return;
    
    $backup_dir = __DIR__ . '/data/backups/';
    if (!is_dir($backup_dir)) @mkdir($backup_dir, 0755, true);

    $today = date('Y-m-d');
    $backup_file = $backup_dir . "backup_db_$today.db";

    // Só faz backup se ainda não existir o de hoje
    if (!file_exists($backup_file)) {
        @copy($db_path, $backup_file);
        
        // Rotina de retenção: apaga backups com mais de 3 dias
        $files = glob($backup_dir . "*.db");
        $now = time();
        foreach ($files as $file) {
            if ($now - filemtime($file) > 3 * 24 * 60 * 60) {
                @unlink($file);
            }
        }
    }
}

/**
 * Limpeza de temporários (>24h)
 */
function runCleanup($dir, $expiry_seconds = 86400) {
    if (!is_dir($dir)) return;
    $files = glob($dir . '/*');
    foreach ($files as $file) {
        // Não apagar arquivos de banco de dados (.db) nem o diretório de backups (Compatível com PHP 7+)
        if (is_file($file) && (substr($file, -3) !== '.db') && (time() - filemtime($file)) > $expiry_seconds) {
            unlink($file);
        }
    }
}
