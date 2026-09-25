<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? '';
$amount = (float)($input['amount'] ?? 5.00);
$credits = (int)($input['credits'] ?? 15);

if (empty($token) || $amount <= 0) {
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

$mp_token = $_ENV['MP_ACCESS_TOKEN'] ?? '';
if (empty($mp_token)) {
    echo json_encode(['error' => 'MP Token not configured']);
    exit;
}

$payment_data = [
    "transaction_amount" => $amount,
    "description" => "Pacote de $credits creditos de Inteligencia Artificial",
    "payment_method_id" => "pix",
    "payer" => [
        "email" => "dev_" . time() . "@example.com",
    ]
];

$ch = curl_init('https://api.mercadopago.com/v1/payments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payment_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $mp_token,
    'Content-Type: application/json',
    'X-Idempotency-Key: ' . uniqid()
]);

$response = curl_exec($ch);
curl_close($ch);

$mp_result = json_decode($response, true);

if (isset($mp_result['id'])) {
    $payment_id = $mp_result['id'];
    $qr_code = $mp_result['point_of_interaction']['transaction_data']['qr_code'] ?? '';
    // To generate the base64, Mercado Pago sometimes sends it, if not, we handle it on frontend or return qr_code raw
    $qr_code_base64 = $mp_result['point_of_interaction']['transaction_data']['qr_code_base64'] ?? '';
    
    $stmt = $db->prepare("INSERT INTO payments (id, token, payment_id, amount, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([uniqid(), $token, $payment_id, $amount, 'pending']);
    
    echo json_encode([
        'payment_id' => $payment_id,
        'qr_code' => $qr_code,
        'qr_code_base64' => $qr_code_base64
    ]);
} else {
    echo json_encode(['error' => 'Failed to create PIX', 'details' => $mp_result]);
}
?>
