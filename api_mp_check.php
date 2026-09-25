<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$payment_id = $_GET['payment_id'] ?? '';

if (empty($payment_id)) {
    echo json_encode(['error' => 'Missing payment_id']);
    exit;
}

$stmt = $db->prepare("SELECT status FROM payments WHERE payment_id = ?");
$stmt->execute([$payment_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
    echo json_encode(['status' => $row['status']]);
} else {
    echo json_encode(['error' => 'Payment not found']);
}
?>
