<?php
header('Content-Type: application/json; charset=utf-8');

try {
    if (file_exists(__DIR__ . '/../keepai/api/database.php')) {
        require_once __DIR__ . '/../keepai/api/database.php';
    } elseif (file_exists(__DIR__ . '/../../keepai/api/database.php')) {
        require_once __DIR__ . '/../../keepai/api/database.php';
    } else {
        throw new Exception("Arquivo database.php do KeepAI nao localizado a partir de " . __DIR__);
    }
    require_once __DIR__ . '/lib_security.php';

    // Valida o token e recupera o usuário do keepai.db
    $user = verifyAuthToken();
    $uid = (int) $user['id'];
    $credits = (int) $user['credits'];

    // Ativar Rate Limit
    checkRateLimit('upscale_' . $uid);

    if ($credits < 1) {
        http_response_code(402); // Payment Required
        echo json_encode(['error' => 'Saldo de IA insuficiente. Por favor, recarregue seus créditos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $apiToken = $_ENV['REPLICATE_API_TOKEN'] ?? getenv('REPLICATE_API_TOKEN') ?? null;


    if (!$apiToken || $apiToken === 'your_replicate_api_token_here') {
        http_response_code(500);
        echo json_encode(['error' => 'Replicate API Token não configurado no arquivo .env']);
        exit;
    }

    // Receber dados da imagem
    $input = json_decode(file_get_contents('php://input'), true);
    $imageContent = $input['image'] ?? null; // base64

    if (!$imageContent) {
        http_response_code(400);
        echo json_encode(['error' => 'Nenhuma imagem fornecida']);
        exit;
    }

    // 1. Criar a predição no Replicate
    $replicateUrl = 'https://api.replicate.com/v1/predictions';
    $headers = [
        'Authorization: Token ' . $apiToken,
        'Content-Type: application/json'
    ];

    $data = [
        'version' => 'b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8', // nightmareai/real-esrgan
        'input' => [
            'image' => $imageContent,
            'upscale' => 2,
            'face_enhance' => false
        ]
    ];

    $ch = curl_init($replicateUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 400) {
        http_response_code($httpCode);
        $errorData = json_decode($response, true);
        $detail = $errorData['detail'] ?? $response;
        echo json_encode(['error' => 'Replicate API Error (' . $httpCode . '): ' . $detail]);
        exit;
    }

    $prediction = json_decode($response, true);
    $predictionId = $prediction['id'];
    $statusUrl = $prediction['urls']['get'];

    // 2. Poll para verificar o status
    $maxAttempts = 60; // Upscale can take longer
    $attempt = 0;
    $resultUrl = null;

    while ($attempt < $maxAttempts) {
        sleep(2);
        $ch = curl_init($statusUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $statusResponse = curl_exec($ch);
        $statusHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($statusHttpCode !== 200) {
            http_response_code($statusHttpCode);
            echo $statusResponse;
            exit;
        }

        $statusData = json_decode($statusResponse, true);
        if ($statusData['status'] === 'succeeded') {
            $resultUrl = $statusData['output'] ?? null;
            break;
        } elseif ($statusData['status'] === 'failed') {
            http_response_code(500);
            echo json_encode(['error' => 'Falha no processamento da imagem: ' . ($statusData['error'] ?? 'Erro desconhecido')]);
            exit;
        }
        
        $attempt++;
    }

    if ($resultUrl) {
        // Deduct 1 credit
        $pdo = Database::get();
        $pdo->prepare('UPDATE users SET credits = credits - 1, updated_at = datetime("now") WHERE id = ?')->execute([$uid]);
        
        // Log the transaction
        $pdo->prepare('
            INSERT INTO transactions (user_id, mp_payment_id, package_label, amount_brl, credits_added, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ')->execute([$uid, 'PHC-' . time(), 'Consumo PhotoClone Pro', 0.0, -1, 'approved']);

        echo json_encode([
            'output' => $resultUrl,
            'credits_remaining' => $credits - 1
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(504);
        echo json_encode(['error' => 'Timeout ao processar a imagem']);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro interno do servidor: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
