<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title id="page-title">PhotoClone Pro - Editor de Imagens Online com IA & Fotos Gratuitas</title>
	<meta name="description" content="PhotoClone Pro: O mais avançado editor de imagens online com Inteligência Artificial. Remova fundos com 1 clique, acesse milhões de fotos gratuitas em 4K e gere QR Code PIX oficial.">
	<link rel="canonical" href="https://4u.ia.br/app/photoclone/landing.php">
	<link rel="icon" sizes="192x192" href="images/favicon.png">
	<link rel="manifest" href="manifest.json">

	<!-- Google Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">

	<style>
		:root {
			--bg-dark: #090d16;
			--bg-card: rgba(15, 23, 42, 0.75);
			--border-glass: rgba(255, 255, 255, 0.1);
			--accent-cyan: #38bdf8;
			--accent-purple: #a855f7;
			--accent-blue: #3b82f6;
			--accent-green: #22c55e;
			--text-main: #f8fafc;
			--text-muted: #94a3b8;
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family: 'Plus Jakarta Sans', sans-serif;
			background-color: var(--bg-dark);
			color: var(--text-main);
			line-height: 1.6;
			overflow-x: hidden;
		}

		/* Glowing Background Aura */
		.bg-aura {
			position: fixed;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 100vw;
			height: 100vh;
			z-index: -1;
			background: 
				radial-gradient(circle at 20% 15%, rgba(168, 85, 247, 0.18) 0%, transparent 45%),
				radial-gradient(circle at 80% 25%, rgba(56, 189, 248, 0.18) 0%, transparent 50%),
				radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 60%);
			pointer-events: none;
		}

		.container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 0 24px;
		}

		/* Header */
		header {
			padding: 20px 0;
			border-bottom: 1px solid var(--border-glass);
			backdrop-filter: blur(12px);
			position: sticky;
			top: 0;
			z-index: 50;
			background: rgba(9, 13, 22, 0.8);
		}

		.nav-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
		}

		.logo-brand {
			display: flex;
			align-items: center;
			gap: 10px;
			text-decoration: none;
			font-family: 'Space Grotesk', sans-serif;
			font-size: 22px;
			font-weight: 700;
			color: #fff;
		}

		.logo-badge {
			background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
			padding: 3px 8px;
			border-radius: 6px;
			font-size: 11px;
			font-weight: 800;
			letter-spacing: 0.05em;
		}

		.nav-links {
			display: flex;
			align-items: center;
			gap: 20px;
		}

		.nav-link {
			color: var(--text-muted);
			text-decoration: none;
			font-size: 14px;
			font-weight: 600;
			transition: color 0.2s ease;
		}

		.nav-link:hover {
			color: var(--accent-cyan);
		}

		.btn-primary {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			background: linear-gradient(135deg, #3b82f6, #2563eb);
			color: #fff;
			padding: 10px 22px;
			border-radius: 8px;
			font-weight: 700;
			font-size: 14px;
			text-decoration: none;
			box-shadow: 0 4px 18px rgba(37, 99, 235, 0.35);
			transition: all 0.2s ease;
			border: none;
			cursor: pointer;
		}

		.btn-primary:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 24px rgba(37, 99, 235, 0.5);
		}

		.btn-outline {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			background: rgba(255, 255, 255, 0.05);
			color: #fff;
			padding: 10px 22px;
			border-radius: 8px;
			font-weight: 700;
			font-size: 14px;
			text-decoration: none;
			border: 1px solid var(--border-glass);
			transition: all 0.2s ease;
		}

		.btn-outline:hover {
			background: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.25);
		}

		/* Language Toggle Pills */
		.lang-switch-box {
			display: flex;
			align-items: center;
			background: rgba(255, 255, 255, 0.06);
			border: 1px solid rgba(255, 255, 255, 0.15);
			border-radius: 6px;
			padding: 2px;
			gap: 2px;
		}

		.lang-btn {
			padding: 4px 8px;
			font-size: 11px;
			font-weight: 800;
			border-radius: 4px;
			border: none;
			cursor: pointer;
			background: transparent;
			color: var(--text-muted);
			transition: all 0.2s ease;
		}

		.lang-btn.active {
			background: #3b82f6;
			color: #ffffff;
		}

		/* Hero Section */
		.hero {
			padding: 70px 0 50px;
			text-align: center;
		}

		.hero-pill {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			background: rgba(168, 85, 247, 0.12);
			border: 1px solid rgba(168, 85, 247, 0.35);
			padding: 6px 16px;
			border-radius: 30px;
			font-size: 13px;
			font-weight: 700;
			color: #d8b4fe;
			margin-bottom: 24px;
		}

		.hero-title {
			font-family: 'Space Grotesk', sans-serif;
			font-size: clamp(36px, 5.5vw, 60px);
			font-weight: 700;
			line-height: 1.18;
			margin-bottom: 20px;
			letter-spacing: -0.02em;
		}

		.hero-title .gradient-text {
			background: linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #ec4899 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		.hero-subtitle {
			font-size: clamp(16px, 2vw, 19px);
			color: var(--text-muted);
			max-width: 780px;
			margin: 0 auto 36px;
		}

		.hero-actions {
			display: flex;
			gap: 16px;
			justify-content: center;
			flex-wrap: wrap;
			margin-bottom: 40px;
		}

		/* Features Showcase Grid */
		.features-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
			gap: 24px;
			margin: 50px 0;
		}

		.feature-card {
			background: var(--bg-card);
			border: 1px solid var(--border-glass);
			border-radius: 16px;
			padding: 32px 28px;
			backdrop-filter: blur(16px);
			position: relative;
			overflow: hidden;
			transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
		}

		.feature-card:hover {
			transform: translateY(-4px);
			border-color: rgba(56, 189, 248, 0.35);
			box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
		}

		.feature-icon-box {
			width: 54px;
			height: 54px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26px;
			margin-bottom: 20px;
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid var(--border-glass);
		}

		.feature-card.purple .feature-icon-box {
			background: rgba(168, 85, 247, 0.15);
			border-color: rgba(168, 85, 247, 0.3);
		}

		.feature-card.cyan .feature-icon-box {
			background: rgba(56, 189, 248, 0.15);
			border-color: rgba(56, 189, 248, 0.3);
		}

		.feature-card.green .feature-icon-box {
			background: rgba(34, 197, 94, 0.15);
			border-color: rgba(34, 197, 94, 0.3);
		}

		.feature-title {
			font-size: 20px;
			font-weight: 700;
			margin-bottom: 12px;
			color: #fff;
		}

		.feature-desc {
			font-size: 14.5px;
			color: var(--text-muted);
			line-height: 1.6;
		}

		.feature-badge-list {
			display: flex;
			gap: 6px;
			flex-wrap: wrap;
			margin-top: 18px;
		}

		.feature-pill {
			font-size: 11px;
			font-weight: 700;
			padding: 4px 10px;
			border-radius: 20px;
			background: rgba(255, 255, 255, 0.06);
			color: #e2e8f0;
			border: 1px solid rgba(255, 255, 255, 0.08);
		}

		/* Interactive Spotlight Section */
		.spotlight-banner {
			background: linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9));
			border: 1px solid rgba(168, 85, 247, 0.3);
			border-radius: 20px;
			padding: 44px 36px;
			margin: 50px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 32px;
			flex-wrap: wrap;
		}

		.spotlight-content {
			flex: 1;
			min-width: 300px;
		}

		.spotlight-title {
			font-size: 28px;
			font-weight: 800;
			margin-bottom: 14px;
			color: #fff;
		}

		.spotlight-desc {
			font-size: 15px;
			color: #cbd5e1;
			margin-bottom: 24px;
			max-width: 600px;
		}

		/* Comparison Table */
		.compare-section {
			padding: 50px 0;
			text-align: center;
		}

		.section-header {
			margin-bottom: 36px;
		}

		.section-title {
			font-size: 32px;
			font-weight: 800;
			color: #fff;
			margin-bottom: 12px;
		}

		.table-wrapper {
			overflow-x: auto;
			border-radius: 14px;
			border: 1px solid var(--border-glass);
			background: var(--bg-card);
		}

		table {
			width: 100%;
			border-collapse: collapse;
			text-align: left;
			font-size: 14px;
		}

		th, td {
			padding: 15px 18px;
			border-bottom: 1px solid var(--border-glass);
		}

		th {
			background: rgba(255, 255, 255, 0.03);
			font-weight: 700;
			color: #fff;
		}

		td {
			color: #cbd5e1;
		}

		.check {
			color: var(--accent-green);
			font-weight: bold;
		}

		.cross {
			color: #ef4444;
		}

		/* CTA Bottom */
		.cta-banner {
			text-align: center;
			padding: 70px 20px;
			background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
		}

		.cta-title {
			font-size: 34px;
			font-weight: 800;
			margin-bottom: 14px;
		}

		/* Footer */
		footer {
			border-top: 1px solid var(--border-glass);
			padding: 36px 0;
			text-align: center;
			color: var(--text-muted);
			font-size: 13px;
		}

		.footer-links {
			display: flex;
			gap: 20px;
			justify-content: center;
			margin-bottom: 16px;
			flex-wrap: wrap;
		}

		.footer-link {
			color: var(--text-muted);
			text-decoration: none;
			transition: color 0.2s ease;
		}

		.footer-link:hover {
			color: #fff;
		}

		@media (max-width: 768px) {
			.nav-links {
				display: none;
			}
			.spotlight-banner {
				padding: 30px 20px;
			}
		}
	</style>
</head>
<body>
	<div class="bg-aura"></div>

	<!-- Top Header -->
	<header>
		<div class="container">
			<div class="nav-wrapper">
				<a href="landing.php" class="logo-brand">
					<span>✨ PhotoClone</span>
					<span class="logo-badge">PRO AI</span>
				</a>
				<div class="nav-links">
					<a href="#recursos" class="nav-link" data-i18n="nav_resources">Recursos</a>
					<a href="#ia" class="nav-link" data-i18n="nav_ai">Inteligência Artificial</a>
					<a href="#fotos" class="nav-link" data-i18n="nav_photos">Fotos Gratuitas</a>
					<a href="tutorial.html" class="nav-link" data-i18n="nav_tutorials">📖 Tutoriais</a>
				</div>
				<div style="display:flex; gap:10px; align-items:center;">
					<!-- Language Selector Pills -->
					<div class="lang-switch-box">
						<button id="landing-lang-pt" onclick="setLandingLanguage('pt')" type="button" class="lang-btn active" title="Português do Brasil">PT</button>
						<button id="landing-lang-en" onclick="setLandingLanguage('en')" type="button" class="lang-btn" title="English">EN</button>
					</div>
					<a href="index.php" class="btn-primary">
						<span data-i18n="btn_open_editor">🚀 Abrir Editor</span>
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div class="hero-pill">
				<span data-i18n="hero_pill">⚡ PhotoClone Pro v4.14 • Editor de Imagens com Inteligência Artificial</span>
			</div>
			<h1 class="hero-title">
				<span data-i18n="hero_h1_start">Crie, Edite e Recorte com IA.</span><br>
				<span class="gradient-text" data-i18n="hero_h1_end">100% no seu Navegador.</span>
			</h1>
			<p class="hero-subtitle" data-i18n="hero_subtitle">
				A mais poderosa alternativa online ao Photoshop e Canva. Remova fundos em 3 segundos, acesse milhões de fotos gratuitas em 4K e gere QR Code PIX oficial sem instalar nada.
			</p>
			<div class="hero-actions">
				<a href="index.php" class="btn-primary" style="font-size: 16px; padding: 14px 32px;">
					<span data-i18n="btn_hero_cta">✨ Começar a Criar Grátis</span>
				</a>
				<a href="tutorial.html" class="btn-outline" style="font-size: 16px; padding: 14px 28px;">
					<span data-i18n="btn_hero_tutorial">📖 Ver Central de Tutoriais</span>
				</a>
			</div>
		</div>
	</section>

	<!-- Main Features Grid -->
	<section id="recursos" class="container">
		<div class="features-grid">
			
			<!-- Card 1: Remoção de Fundo IA -->
			<div class="feature-card purple" id="ia">
				<div class="feature-icon-box">🪄</div>
				<h3 class="feature-title" data-i18n="card1_title">Remoção de Fundo por IA</h3>
				<p class="feature-desc" data-i18n="card1_desc">
					Isole produtos de e-commerce, pessoas e carros com precisão cirúrgica em segundos. Recorte automático por visão computacional ou por clique em cores sólidas sem gastar nada.
				</p>
				<div class="feature-badge-list">
					<span class="feature-pill" data-i18n="card1_badge1">🤖 IA Replicate</span>
					<span class="feature-pill" data-i18n="card1_badge2">🎯 Modo Chroma Cor</span>
					<span class="feature-pill" data-i18n="card1_badge3">⚡ 3 Segundos</span>
				</div>
			</div>

			<!-- Card 2: Banco de Fotos Gratuitas -->
			<div class="feature-card cyan" id="fotos">
				<div class="feature-icon-box">🖼️</div>
				<h3 class="feature-title" data-i18n="card2_title">4M+ Fotos Gratuitas (4K)</h3>
				<p class="feature-desc" data-i18n="card2_desc">
					Busque fotografias profissionais diretamente no editor em português ou inglês por lanches, pizzas, escritórios, fitness, moda e natureza com licença de uso comercial (CC0 / Unsplash).
				</p>
				<div class="feature-badge-list">
					<span class="feature-pill" data-i18n="card2_badge1">📸 Unsplash & Pixabay</span>
					<span class="feature-pill" data-i18n="card2_badge2">🇧🇷 Busca em Português</span>
					<span class="feature-pill" data-i18n="card2_badge3">1-Clique na Camada</span>
				</div>
			</div>

			<!-- Card 3: QR Code & PIX Oficial -->
			<div class="feature-card green">
				<div class="feature-icon-box">📱</div>
				<h3 class="feature-title" data-i18n="card3_title">Gerador de QR Code & PIX</h3>
				<p class="feature-desc" data-i18n="card3_desc">
					Crie códigos de pagamento oficiais do Banco Central (BR Code EMV), links de WhatsApp direto e senhas de Wi-Fi já diagramados com ícones centrais em camadas vetoriais.
				</p>
				<div class="feature-badge-list">
					<span class="feature-pill" data-i18n="card3_badge1">💸 Padrão BACEN Oficial</span>
					<span class="feature-pill" data-i18n="card3_badge2">💬 WhatsApp Direto</span>
					<span class="feature-pill" data-i18n="card3_badge3">💎 Camada Vetorial</span>
				</div>
			</div>

			<!-- Card 4: Exportação Otimizada WhatsApp -->
			<div class="feature-card cyan">
				<div class="feature-icon-box">⚡</div>
				<h3 class="feature-title" data-i18n="card4_title">Exportação WhatsApp & Web</h3>
				<p class="feature-desc" data-i18n="card4_desc">
					Comprime até 70% do peso do arquivo sem perder nada da nitidez visual. Suas artes carregam instantaneamente no WhatsApp, Instagram e sites sem travar nem estourar qualidade.
				</p>
				<div class="feature-badge-list">
					<span class="feature-pill" data-i18n="card4_badge1">⌨️ Atalho Alt + S</span>
					<span class="feature-pill" data-i18n="card4_badge2">💎 100% Nitidez</span>
					<span class="feature-pill" data-i18n="card4_badge3">🚀 Leve & Rápido</span>
				</div>
			</div>

			<!-- Card 5: Auto-Save Permanente -->
			<div class="feature-card purple">
				<div class="feature-icon-box">💾</div>
				<h3 class="feature-title" data-i18n="card5_title">Auto-Save & Projetos Recentes</h3>
				<p class="feature-desc" data-i18n="card5_desc">
					Nunca mais perca um trabalho por queda de energia ou fechamento acidental de aba. O PhotoClone salva seu projeto em segundo plano no navegador (IndexedDB) a cada 4 segundos.
				</p>
				<div class="feature-badge-list">
					<span class="feature-pill" data-i18n="card5_badge1">🔒 100% Privado Local</span>
					<span class="feature-pill" data-i18n="card5_badge2">🕒 Histórico 25 Projetos</span>
					<span class="feature-pill" data-i18n="card5_badge3">📂 Restauração em 1 Toque</span>
				</div>
			</div>

			<!-- Card 6: Instalação PWA & Offline -->
			<div class="feature-card green">
				<div class="feature-icon-box">📲</div>
				<h3 class="feature-title" data-i18n="card6_title">Instalável no PC e Celular (PWA)</h3>
				<p class="feature-desc" data-i18n="card6_desc">
					Instale com 1 clique direto pelo botão superior para abrir como um programa nativo na sua Área de Trabalho ou no celular, com carregamento instantâneo mesmo sem internet.
				</p>
				<div class="feature-badge-list">
					<span class="feature-pill" data-i18n="card6_badge1">💻 Windows / Mac / Linux</span>
					<span class="feature-pill" data-i18n="card6_badge2">📱 Android / iOS</span>
					<span class="feature-pill" data-i18n="card6_badge3">⚡ Funciona Offline</span>
				</div>
			</div>

		</div>
	</section>

	<!-- Spotlight AI & Stock Banner -->
	<section class="container">
		<div class="spotlight-banner">
			<div class="spotlight-content">
				<span style="font-size:12px; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.05em;" data-i18n="spotlight_badge">Ecossistema Completo 4U.IA.BR</span>
				<h2 class="spotlight-title" data-i18n="spotlight_title">Edição Profissional Sem Mensalidades Caras</h2>
				<p class="spotlight-desc" data-i18n="spotlight_desc">
					Enquanto outros editores cobram assinaturas mensais caras para liberar funções básicas, o PhotoClone Pro entrega uma suíte completa de camadas, filtros, Google Fonts, fotos comerciais gratuitas e IA avançada direto na web.
				</p>
				<a href="index.php" class="btn-primary">
					<span data-i18n="btn_spotlight_cta">Abrir o PhotoClone Agora</span>
				</a>
			</div>
			<div style="font-size:72px; display:flex; gap:16px; align-items:center; justify-content:center;">
				<span>🎨</span>
				<span>🪄</span>
				<span>📱</span>
			</div>
		</div>
	</section>

	<!-- Comparison Section -->
	<section class="container compare-section">
		<div class="section-header">
			<h2 class="section-title" data-i18n="compare_title">Por que o PhotoClone Pro é Diferente?</h2>
			<p style="color:var(--text-muted);" data-i18n="compare_subtitle">Veja como o PhotoClone supera ferramentas tradicionais:</p>
		</div>
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th data-i18n="th_feature">Recurso</th>
						<th style="color:var(--accent-cyan);">PhotoClone Pro</th>
						<th>Canva Grátis</th>
						<th>Photoshop Web</th>
					</tr>
				</thead>
				<tbody id="compare-tbody">
					<!-- Populated by i18n script -->
				</tbody>
			</table>
		</div>
	</section>

	<!-- CTA Banner -->
	<section class="cta-banner">
		<div class="container">
			<h2 class="cta-title" data-i18n="cta_title">Pronto para criar sua próxima arte?</h2>
			<p style="color:var(--text-muted); font-size:16px; margin-bottom:28px;" data-i18n="cta_subtitle">Sem instalação, sem burocracia. Clique abaixo e comece a editar em segundos!</p>
			<a href="index.php" class="btn-primary" style="font-size: 16px; padding: 14px 36px;">
				<span data-i18n="btn_cta_bottom">🚀 Abrir o PhotoClone Pro Grátis</span>
			</a>
		</div>
	</section>

	<!-- Footer -->
	<footer>
		<div class="container">
			<div class="footer-links">
				<a href="index.php" class="footer-link" data-i18n="footer_editor">Editor de Imagens</a>
				<a href="tutorial.html" class="footer-link" data-i18n="footer_tutorial">Central de Tutoriais</a>
				<a href="termos.php" class="footer-link" data-i18n="footer_terms">Termos de Uso</a>
				<a href="privacidade.php" class="footer-link" data-i18n="footer_privacy">Privacidade</a>
				<a href="suporte.php" class="footer-link" data-i18n="footer_support">Suporte</a>
			</div>
			<p>© <?php echo date('Y'); ?> PhotoClone Pro • <span data-i18n="footer_dev">Desenvolvido por</span> <a href="https://4u.ia.br" target="_blank" style="color:var(--accent-purple); text-decoration:none; font-weight:700;">4U.IA.BR</a>. <span data-i18n="footer_rights">Todos os direitos reservados.</span></p>
		</div>
	</footer>

	<!-- Bilingual Translation Script -->
	<script>
		const i18nData = {
			pt: {
				page_title: "PhotoClone Pro - Editor de Imagens Online com IA & Fotos Gratuitas",
				nav_resources: "Recursos",
				nav_ai: "Inteligência Artificial",
				nav_photos: "Fotos Gratuitas",
				nav_tutorials: "📖 Tutoriais",
				btn_open_editor: "🚀 Abrir Editor",
				hero_pill: "⚡ PhotoClone Pro v4.14 • Editor de Imagens com Inteligência Artificial",
				hero_h1_start: "Crie, Edite e Recorte com IA.",
				hero_h1_end: "100% no seu Navegador.",
				hero_subtitle: "A mais poderosa alternativa online ao Photoshop e Canva. Remova fundos em 3 segundos, acesse milhões de fotos gratuitas em 4K e gere QR Code PIX oficial sem instalar nada.",
				btn_hero_cta: "✨ Começar a Criar Grátis",
				btn_hero_tutorial: "📖 Ver Central de Tutoriais",
				card1_title: "Remoção de Fundo por IA",
				card1_desc: "Isole produtos de e-commerce, pessoas e carros com precisão cirúrgica em segundos. Recorte automático por visão computacional ou por clique em cores sólidas sem gastar nada.",
				card1_badge1: "🤖 IA Replicate",
				card1_badge2: "🎯 Modo Chroma Cor",
				card1_badge3: "⚡ 3 Segundos",
				card2_title: "4M+ Fotos Gratuitas (4K)",
				card2_desc: "Busque fotografias profissionais diretamente no editor em português ou inglês por lanches, pizzas, escritórios, fitness, moda e natureza com licença de uso comercial (CC0 / Unsplash).",
				card2_badge1: "📸 Unsplash & Pixabay",
				card2_badge2: "🇧🇷 Busca em Português",
				card2_badge3: "1-Clique na Camada",
				card3_title: "Gerador de QR Code & PIX",
				card3_desc: "Crie códigos de pagamento oficiais do Banco Central (BR Code EMV), links de WhatsApp direto e senhas de Wi-Fi já diagramados com ícones centrais em camadas vetoriais.",
				card3_badge1: "💸 Padrão BACEN Oficial",
				card3_badge2: "💬 WhatsApp Direto",
				card3_badge3: "💎 Camada Vetorial",
				card4_title: "Exportação WhatsApp & Web",
				card4_desc: "Comprime até 70% do peso do arquivo sem perder nada da nitidez visual. Suas artes carregam instantaneamente no WhatsApp, Instagram e sites sem travar nem estourar qualidade.",
				card4_badge1: "⌨️ Atalho Alt + S",
				card4_badge2: "💎 100% Nitidez",
				card4_badge3: "🚀 Leve & Rápido",
				card5_title: "Auto-Save & Projetos Recentes",
				card5_desc: "Nunca mais perca um trabalho por queda de energia ou fechamento acidental de aba. O PhotoClone salva seu projeto em segundo plano no navegador (IndexedDB) a cada 4 segundos.",
				card5_badge1: "🔒 100% Privado Local",
				card5_badge2: "🕒 Histórico 25 Projetos",
				card5_badge3: "📂 Restauração em 1 Toque",
				card6_title: "Instalável no PC e Celular (PWA)",
				card6_desc: "Instale com 1 clique direto pelo botão superior para abrir como um programa nativo na sua Área de Trabalho ou no celular, com carregamento instantâneo mesmo sem internet.",
				card6_badge1: "💻 Windows / Mac / Linux",
				card6_badge2: "📱 Android / iOS",
				card6_badge3: "⚡ Funciona Offline",
				spotlight_badge: "Ecossistema Completo 4U.IA.BR",
				spotlight_title: "Edição Profissional Sem Mensalidades Caras",
				spotlight_desc: "Enquanto outros editores cobram assinaturas mensais caras para liberar funções básicas, o PhotoClone Pro entrega uma suíte completa de camadas, filtros, Google Fonts, fotos comerciais gratuitas e IA avançada direto na web.",
				btn_spotlight_cta: "Abrir o PhotoClone Agora",
				compare_title: "Por que o PhotoClone Pro é Diferente?",
				compare_subtitle: "Veja como o PhotoClone supera ferramentas tradicionais:",
				th_feature: "Recurso",
				cta_title: "Pronto para criar sua próxima arte?",
				cta_subtitle: "Sem instalação, sem burocracia. Clique abaixo e comece a editar em segundos!",
				btn_cta_bottom: "🚀 Abrir o PhotoClone Pro Grátis",
				footer_editor: "Editor de Imagens",
				footer_tutorial: "Central de Tutoriais",
				footer_terms: "Termos de Uso",
				footer_privacy: "Privacidade",
				footer_support: "Suporte",
				footer_dev: "Desenvolvido por",
				footer_rights: "Todos os direitos reservados.",
				table_rows: [
					["Uso Gratuito Sem Login Obrigatório", "✔ Sim, 100% Livre", "✖ Exige Cadastro", "✖ Exige Assinatura Adobe"],
					["Recorte de Fundo por IA & Chroma por Cor", "✔ Sim (IA 1-Clique + Chroma Grátis)", "✖ Bloqueado (Canva Pro R$ 34,90/mês)", "✖ Exige Assinatura Adobe"],
					["Biblioteca de 4M+ Fotos Gratuitas (4K)", "✔ Integrada (CC0 / Unsplash)", "✖ Maioria Paga (Canva Pro)", "✖ Adobe Stock Pago"],
					["Gerador Oficial de QR Code PIX (BACEN)", "✔ Integrado (Chave PIX / WhatsApp / Wi-Fi)", "✖ Não possui PIX BACEN", "✖ Não possui"],
					["Histórico Visual & Navegação no Tempo (Time Travel)", "✔ Sim (Aba Histórico com 1 Clique)", "✖ Apenas Ctrl+Z (Histórico é Pago)", "✖ Lento / Pesado"],
					["Efeitos Rápidos de Texto (Sombra, Contorno, Neon, Tarja)", "✔ 1-Clique no Painel Detalhes", "✖ Limitado / Manual", "✖ Exige Janelas Complexas"],
					["Auto-Save Permanente no Navegador", "✔ Sim (IndexedDB Local Privado)", "✔ Nuvem (Exige Login)", "✖ Nuvem Paga"],
					["Exportação Otimizada WhatsApp & Web (Sem perda)", "✔ Sim (Atalho Alt + S)", "✖ Padrão", "✖ Manual / Complexo"],
					["Privacidade Total & Projetos .JSON no seu Disco", "✔ Seus arquivos são 100% seus", "✖ Preso na nuvem da empresa", "✖ Preso na Adobe Cloud"],
					["Edição Profissional em Camadas Vetoriais", "✔ Completa & Ilimitada", "✖ Limitada", "✔ Completa"]
				]
			},
			en: {
				page_title: "PhotoClone Pro - Online AI Image Editor & Free Stock Photos",
				nav_resources: "Features",
				nav_ai: "Artificial Intelligence",
				nav_photos: "Free Stock Photos",
				nav_tutorials: "📖 Tutorials",
				btn_open_editor: "🚀 Open Editor",
				hero_pill: "⚡ PhotoClone Pro v4.14 • AI-Powered Online Image Editor",
				hero_h1_start: "Create, Edit and Cutout with AI.",
				hero_h1_end: "100% in your Browser.",
				hero_subtitle: "The most powerful online alternative to Photoshop and Canva. Remove backgrounds in 3 seconds, access millions of 4K royalty-free photos, and generate official PIX QR Codes with zero install.",
				btn_hero_cta: "✨ Start Creating for Free",
				btn_hero_tutorial: "📖 View Tutorial Center",
				card1_title: "AI Background Removal",
				card1_desc: "Isolate e-commerce products, portraits and cars with surgical precision in seconds. Automatic computer vision cutout or 1-click solid color chroma at zero cost.",
				card1_badge1: "🤖 Replicate AI",
				card1_badge2: "🎯 Chroma Color Mode",
				card1_badge3: "⚡ 3 Seconds",
				card2_title: "4M+ Free Stock Photos (4K)",
				card2_desc: "Search professional royalty-free photography directly inside the editor in English or Portuguese (food, business, fitness, fashion, nature) under CC0 / Unsplash license.",
				card2_badge1: "📸 Unsplash & Pixabay",
				card2_badge2: "🌍 Multilingual Search",
				card2_badge3: "1-Click Layer Insert",
				card3_title: "QR Code & PIX Generator",
				card3_desc: "Create official Central Bank payment codes (BR Code EMV), direct WhatsApp links with custom messages, and Wi-Fi credentials pre-styled as vector layers.",
				card3_badge1: "💸 BACEN Official Standard",
				card3_badge2: "💬 Direct WhatsApp Link",
				card3_badge3: "💎 Vector Layer",
				card4_title: "WhatsApp & Web Optimized Export",
				card4_desc: "Compress up to 70% of file size without losing any visual sharpness. Your graphics load instantaneously on Instagram, WhatsApp, and websites without quality degradation.",
				card4_badge1: "⌨️ Shortcut Alt + S",
				card4_badge2: "💎 100% Sharpness",
				card4_badge3: "🚀 Ultra Lightweight",
				card5_title: "Auto-Save & Recent Projects",
				card5_desc: "Never lose your artwork due to sudden power outages or accidental tab closures. PhotoClone quietly autosaves your project in IndexedDB every 4 seconds.",
				card5_badge1: "🔒 100% Private & Local",
				card5_badge2: "🕒 25 Projects History",
				card5_badge3: "📂 1-Click Recovery",
				card6_title: "Desktop & Mobile Install (PWA)",
				card6_desc: "Install with 1 click from the top header to run as a native desktop or mobile application with instantaneous startup and offline support.",
				card6_badge1: "💻 Windows / Mac / Linux",
				card6_badge2: "📱 Android / iOS",
				card6_badge3: "⚡ Works Offline",
				spotlight_badge: "4U.IA.BR Full Ecosystem",
				spotlight_title: "Professional Editing Without Expensive Subscriptions",
				spotlight_desc: "While other editors lock basic features behind pricey monthly subscriptions, PhotoClone Pro provides complete layers, filters, Google Fonts, royalty-free stock photos, and AI tools directly on the web.",
				btn_spotlight_cta: "Open PhotoClone Now",
				compare_title: "Why PhotoClone Pro Stands Out?",
				compare_subtitle: "See how PhotoClone beats traditional image tools:",
				th_feature: "Feature",
				cta_title: "Ready to create your next design?",
				cta_subtitle: "No installation, no hassle. Click below and start editing in seconds!",
				btn_cta_bottom: "🚀 Open PhotoClone Pro Free",
				footer_editor: "Image Editor",
				footer_tutorial: "Tutorial Center",
				footer_terms: "Terms of Service",
				footer_privacy: "Privacy Policy",
				footer_support: "Support",
				footer_dev: "Developed by",
				footer_rights: "All rights reserved.",
				table_rows: [
					["Free to Use Without Mandatory Login", "✔ Yes, 100% Free", "✖ Requires Signup", "✖ Requires Adobe Subscription"],
					["AI Background Cutout & Chroma by Color", "✔ Yes (1-Click AI + Free Chroma)", "✖ Locked (Canva Pro $12.99/mo)", "✖ Requires Adobe Subscription"],
					["4M+ Free Stock Photos Library (4K)", "✔ Built-in (CC0 / Unsplash)", "✖ Mostly Paid (Canva Pro)", "✖ Paid Adobe Stock"],
					["Official QR Code & PIX Generator", "✔ Built-in (PIX / WhatsApp / Wi-Fi)", "✖ No BACEN PIX", "✖ Not available"],
					["Visual History Timeline (Time Travel)", "✔ Yes (1-Click History Tab)", "✖ Blind Ctrl+Z only (History is Paid)", "✖ Slow / Heavy"],
					["1-Click Fast Text Styles (Shadow, Stroke, Neon, Box)", "✔ 1-Click in Details Panel", "✖ Limited / Manual", "✖ Complex Layer Styles"],
					["Permanent Browser Auto-Save", "✔ Yes (Private Local IndexedDB)", "✔ Cloud (Requires Login)", "✖ Paid Cloud"],
					["Lossless WhatsApp & Web Export", "✔ Yes (Alt + S Shortcut)", "✖ Standard Export", "✖ Manual / Complex"],
					["Full Privacy & Editable .JSON on Your Disk", "✔ Your files belong 100% to you", "✖ Trapped in vendor cloud", "✖ Trapped in Adobe Cloud"],
					["Professional Vector Layer Editing", "✔ Complete & Unlimited", "✖ Limited", "✔ Complete"]
				]
			}
		};

		function setLandingLanguage(lang) {
			if (!i18nData[lang]) lang = 'pt';
			localStorage.setItem('photoclone_lang', lang);
			document.cookie = `language=${lang}; path=/; max-age=31536000`;

			// Update Lang Button UI
			document.getElementById('landing-lang-pt').classList.toggle('active', lang === 'pt');
			document.getElementById('landing-lang-en').classList.toggle('active', lang === 'en');

			const t = i18nData[lang];
			document.getElementById('page-title').innerText = t.page_title;

			// Update all elements with data-i18n
			document.querySelectorAll('[data-i18n]').forEach(el => {
				const key = el.getAttribute('data-i18n');
				if (t[key]) {
					el.innerHTML = t[key];
				}
			});

			// Render comparison table
			const tbody = document.getElementById('compare-tbody');
			if (tbody && t.table_rows) {
				tbody.innerHTML = t.table_rows.map(row => `
					<tr>
						<td><strong>${row[0]}</strong></td>
						<td class="check">${row[1]}</td>
						<td class="${row[2].startsWith('✔') ? 'check' : 'cross'}">${row[2]}</td>
						<td class="${row[3].startsWith('✔') ? 'check' : 'cross'}">${row[3]}</td>
					</tr>
				`).join('');
			}
		}

		// Auto detect on load
		document.addEventListener('DOMContentLoaded', () => {
			const saved = localStorage.getItem('photoclone_lang') || 'pt';
			setLandingLanguage(saved);
		});
	</script>
</body>
</html>
