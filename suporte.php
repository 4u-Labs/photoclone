<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
$assetVersion = time();
$msgSent = false;
$msgError = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $mensagem = trim($_POST['mensagem'] ?? '');

    if (!empty($nome) && !empty($email) && !empty($mensagem)) {
        // Log local obrigatorio
        $logDir = __DIR__ . '/uploads';
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0755, true);
        }
        $logFile = $logDir . '/messages_log.json';
        $logs = [];
        if (file_exists($logFile)) {
            $logs = json_decode(file_get_contents($logFile), true) ?: [];
        }
        $logs[] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'nome' => $nome,
            'email' => $email,
            'mensagem' => $mensagem,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'
        ];
        file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // Envio de E-mail com From oficial do dominio
        $to = 'contato@4u.ia.br';
        $subject = 'Contato PhotoClone Pro: ' . $nome;
        $body = "Nome: $nome\nE-mail: $email\nData: " . date('d/m/Y H:i:s') . "\n\nMensagem:\n$mensagem";
        $headers = "From: contato@4u.ia.br\r\nReply-To: $email\r\nX-Mailer: PHP/" . phpversion();

        @mail($to, $subject, $body, $headers);
        $msgSent = true;
    } else {
        $msgError = true;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Central de Suporte — PhotoClone Pro</title>
  <meta name="description" content="Central de Suporte e FAQ do PhotoClone Pro. Tire dúvidas sobre créditos de IA e edição.">
  <link rel="icon" sizes="192x192" href="images/favicon.png">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
  <style>
    * { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; box-sizing: border-box !important; }
    body { background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; margin: 0; padding: 0; }
    .legal-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      line-height: 1.7;
      color: #e2e8f0;
    }
    .legal-container h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #a855f7; font-weight: 700; }
    .legal-container h2 { font-size: 1.25rem; margin: 1.5rem 0 0.5rem; color: #c084fc; font-weight: 600; }
    .legal-container p { font-size: 0.9rem; color: #94a3b8; margin-bottom: 1rem; }
    .back-btn { display: inline-flex; align-items: center; gap: 0.4rem; color: #a855f7; text-decoration: none; font-weight: 600; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .app-header-legal { padding: 1rem 1.5rem; background: #0b0f19; border-bottom: 1px solid #1e293b; }
    .app-footer-legal { text-align: center; padding: 1.25rem; font-size: 0.775rem; color: #64748b; border-top: 1px solid #1e293b; margin-top: auto; }
    
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.4rem; }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      background: #0f172a;
      border: 1px solid #475569;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
    }
    .btn-submit {
      background: linear-gradient(135deg, #a855f7, #6366f1);
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
    }
    .alert-success { background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #4ade80; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .alert-danger { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  
  <header class="app-header-legal">
    <div style="max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between;">
      <a href="index.php" style="display:flex; align-items:center; gap:0.6rem; text-decoration:none; color:#fff; font-weight:800; font-size:1.3rem;">
        <img src="images/favicon.png" style="width:32px; height:32px; object-fit:contain;">
        <span>PhotoClone <span style="color:#a855f7;">Pro</span></span>
      </a>
    </div>
  </header>

  <main style="flex:1;">
    <div class="legal-container">
      <a href="index.php" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Voltar ao PhotoClone Pro</a>
      
      <h1>Central de Suporte & FAQ</h1>
      <p>Precisa de ajuda ou dúvidas sobre seus créditos? Preencha o formulário abaixo ou consulte as dúvidas frequentes.</p>

      <?php if ($msgSent): ?>
        <div class="alert-success">Sua mensagem foi enviada com sucesso! Responderemos em breve.</div>
      <?php endif; ?>

      <?php if ($msgError): ?>
        <div class="alert-danger">Por favor, preencha todos os campos do formulário.</div>
      <?php endif; ?>

      <h2>Fale Conosco</h2>
      <form method="POST" action="suporte.php">
        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" name="nome" required placeholder="Seu nome">
        </div>
        <div class="form-group">
          <label>E-mail de Contato</label>
          <input type="email" name="email" required placeholder="seu@email.com">
        </div>
        <div class="form-group">
          <label>Mensagem ou Dúvida</label>
          <textarea name="mensagem" rows="4" required placeholder="Descreva como podemos ajudar..."></textarea>
        </div>
        <button type="submit" class="btn-submit">Enviar Mensagem</button>
      </form>

      <h2>Perguntas Frequentes (FAQ)</h2>
      <p><strong>1. Como funcionam os créditos de IA?</strong><br>Cada operação de Inteligência Artificial (Remoção de Fundo, Colorização e Upscale) consome 1 crédito. Os créditos são compartilhados no seu login do ecossistema 4uLabs.</p>
      <p><strong>2. Onde são salvas minhas edições?</strong><br>Suas imagens permanecem 100% no navegador. Quando você exporta (PNG/JPG/WEBP), o download é gerado diretamente no seu computador.</p>
    </div>
  </main>

  <footer class="app-footer-legal">
    <p>© <?php echo date('Y'); ?> PhotoClone Pro — Ecossistema 4U.IA.BR • <a href="privacidade.php" style="color:#64748b; text-decoration:underline;">Privacidade</a> | <a href="termos.php" style="color:#64748b; text-decoration:underline;">Termos</a> | <a href="suporte.php" style="color:#64748b; text-decoration:underline;">Suporte</a></p>
  </footer>

</body>
</html>
