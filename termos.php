<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
$assetVersion = time();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Termos de Uso — PhotoClone Pro</title>
  <meta name="description" content="Termos de Uso do PhotoClone Pro. Regras de conduta e condicoes de servico do ecossistema 4uLabs.">
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
    .legal-container p, .legal-container ul { font-size: 0.9rem; color: #94a3b8; margin-bottom: 1rem; }
    .legal-container ul { padding-left: 1.2rem; }
    .legal-container li { margin-bottom: 0.4rem; }
    .back-btn { display: inline-flex; align-items: center; gap: 0.4rem; color: #a855f7; text-decoration: none; font-weight: 600; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .app-header-legal { padding: 1rem 1.5rem; background: #0b0f19; border-bottom: 1px solid #1e293b; }
    .app-footer-legal { text-align: center; padding: 1.25rem; font-size: 0.775rem; color: #64748b; border-top: 1px solid #1e293b; margin-top: auto; }
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
      
      <h1>Termos de Uso</h1>
      <p>Última atualização: <?php echo date('d/m/Y'); ?></p>

      <h2>1. Aceitação dos Termos</h2>
      <p>Ao utilizar o <strong>PhotoClone Pro</strong>, você concorda expressamente com os presentes Termos de Uso e com as políticas do ecossistema 4uLabs.</p>

      <h2>2. Uso Autorizado</h2>
      <p>O aplicativo destina-se ao tratamento, edição e aprimoramento de imagens para fins pessoais ou comerciais lícitos. É proibida a utilização do serviço para processar conteúdos ilegais ou que violem direitos de terceiros.</p>

      <h2>3. Créditos de Inteligência Artificial</h2>
      <p>Os recursos de IA (Remoção de Fundo, Colorização e Upscale) utilizam o saldo unificado de créditos. O processamento consome 1 crédito por operação concluída com sucesso.</p>

      <h2>4. Limitação de Responsabilidade</h2>
      <p>O PhotoClone Pro é fornecido "como está", garantindo o máximo de empenho na qualidade dos resultados, não se responsabilizando por perdas decorrentes de mau uso pelo usuário.</p>
    </div>
  </main>

  <footer class="app-footer-legal">
    <p>© <?php echo date('Y'); ?> PhotoClone Pro — Ecossistema 4U.IA.BR • <a href="privacidade.php" style="color:#64748b; text-decoration:underline;">Privacidade</a> | <a href="termos.php" style="color:#64748b; text-decoration:underline;">Termos</a> | <a href="suporte.php" style="color:#64748b; text-decoration:underline;">Suporte</a></p>
  </footer>

</body>
</html>
