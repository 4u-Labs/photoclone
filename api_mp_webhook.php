<?php
require_once __DIR__ . '/db.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['type']) && $data['type'] == 'payment') {
    $payment_id = $data['data']['id'] ?? '';
    
    if ($payment_id) {
        $mp_token = $_ENV['MP_ACCESS_TOKEN'] ?? '';
        
        // Fetch real status
        $ch = curl_init("https://api.mercadopago.com/v1/payments/$payment_id");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $mp_token
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        
        $mp_result = json_decode($response, true);
        
        if (isset($mp_result['status'])) {
            $status = $mp_result['status'];
            
            error_log("Webhook payment update: ID $payment_id | Status $status");
            
            $stmt = $db->prepare("UPDATE payments SET status = ? WHERE payment_id = ?");
            $stmt->execute([$status, $payment_id]);
        }
    }
}
http_response_code(200);
echo "OK";
?>
