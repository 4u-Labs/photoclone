<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
$assetVersion = time();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Política de Privacidade — PhotoClone Pro</title>
  <meta name="description" content="Política de Privacidade do PhotoClone Pro. Transparência, criptografia SHA-256 e segurança no ecossistema 4uLabs.">
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
      
      <h1>Política de Privacidade</h1>
      <p>Última atualização: <?php echo date('d/m/Y'); ?></p>

      <h2>1. Compromisso com a Privacidade</h2>
      <p>O <strong>PhotoClone Pro</strong> respeita sua privacidade. As edições de imagens, manipulação de camadas e filtros ocorrem prioritariamente no seu próprio navegador via HTML5 Canvas. As requisições de Inteligência Artificial (Remoção de Fundo, Colorização e Upscale) são processadas via conexões seguras e encriptadas via SHA-256 com retenção zero de imagens.</p>

      <h2>2. Coleta de Informações e Créditos IA</h2>
      <p>Para sincronização de saldo de créditos de IA no ecossistema 4uLabs (Keep AI, PhotoClone), armazenamos de forma segura o seu e-mail e hash encriptado de senha. Não vendemos ou compartilhamos seus dados com terceiros.</p>

      <h2>3. Armazenamento no Navegador</h2>
      <p>Utilizamos <code>localStorage</code> exclusivamente para manter seu token de autenticação ativo e registrar preferências locais de uso da ferramenta.</p>

      <h2>4. Contato</h2>
      <p>Para dúvidas sobre nossa política de privacidade, visite nossa <a href="suporte.php" style="color:#a855f7;">Central de Suporte</a> ou envie um e-mail para <code>contato@4u.ia.br</code>.</p>
    </div>
  </main>

  <footer class="app-footer-legal">
    <p>© <?php echo date('Y'); ?> PhotoClone Pro — Ecossistema 4U.IA.BR • <a href="privacidade.php" style="color:#64748b; text-decoration:underline;">Privacidade</a> | <a href="termos.php" style="color:#64748b; text-decoration:underline;">Termos</a> | <a href="suporte.php" style="color:#64748b; text-decoration:underline;">Suporte</a></p>
  </footer>

</body>
</html>
