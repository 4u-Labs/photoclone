<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>
<!DOCTYPE html>
<html dir="ltr" lang="pt-BR">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="x-ua-compatible" content="IE=edge" />
	<title>PhotoClone Pro - Editor de Imagens Online Profissional</title>
	<meta name="description" content="PhotoClone Pro: Editor de imagens online gratuito da 4U.IA.BR. Edite fotos, use camadas e efeitos profissionais direto no seu navegador.">
	<link rel="canonical" href="https://4u.ia.br/app/photoclone/">
	<meta name="keywords" content="editor de fotos, photoshop online, editar imagens, 4u.ia.br, photoclone, camadas, efeitos de imagem" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
	<link rel="icon" sizes="192x192" href="images/favicon.png">
	<link rel="manifest" href="manifest.json">
	<link rel="webmcp" href="webmcp.json">
	<!-- Google -->
	<meta itemprop="name" content="PhotoClone Pro" />
	<meta itemprop="description" content="Editor de imagens profissional e gratuito rodando 100% no seu navegador." />
	<meta itemprop="image" content="https://4u.ia.br/app/photoclone/images/preview.jpg" />
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="PhotoClone Pro" />
	<meta name="twitter:description" content="PhotoClone Pro é um editor de imagens online gratuito com Inteligência Artificial. Remova fundos, colorize fotos e aumente a resolução em segundos." />
	<meta name="twitter:image" content="https://4u.ia.br/app/photoclone/images/preview.jpg" />
	<meta name="twitter:image:alt" content="PhotoClone Pro - AI Image Editor" />
	<!-- Facebook, Pinterest -->
	<meta property="og:title" content="PhotoClone Pro" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://4u.ia.br/app/photoclone/" />
	<meta property="og:image" content="https://4u.ia.br/app/photoclone/images/preview.jpg" />
	<meta property="og:description" content="PhotoClone Pro é um editor de imagens online gratuito com Inteligência Artificial. Remova fundos, colorize fotos e aumente a resolução em segundos." />
	<meta property="og:site_name" content="PhotoClone Pro" />

	<script src="dist/bundle.js?v=<?php echo time(); ?>"></script>
	<style>
		/* 4U.IA.BR bottom copyright */
		.bottom-copyright {
			padding: 8px 6px;
			font-size: 9px;
			color: rgba(255, 255, 255, 0.35);
			text-align: center;
			letter-spacing: 0.05em;
			text-transform: uppercase;
			border-top: 1px solid rgba(255, 255, 255, 0.05);
			margin-top: 10px;
			user-select: none;
		}
		.bottom-copyright a {
			color: rgba(255, 255, 255, 0.45);
			text-decoration: none;
			margin: 0 2px;
		}
		.bottom-copyright a:hover {
			color: #a855f7;
		}
	</style>
</head>
<body>
	<div class="wrapper">

		<nav aria-label="Main Menu" class="main_menu" id="main_menu"></nav>

		
		<div class="submenu">
			<a class="logo" href="#">PhotoClone</a>
			<div class="block attributes" id="action_attributes"></div>
			<button class="undo_button" id="undo_button" type="button">
				<span class="sr_only">Undo</span>
			</button>
		</div>
		
		<div class="sidebar_left" id="tools_container"></div>


		<div class="middle_area has-tabs" id="middle_area">
			<div class="photoclone_tabs_bar" id="photoclone_tabs_bar"></div>

			<canvas class="ruler_left" id="ruler_left"></canvas>
			<canvas class="ruler_top" id="ruler_top"></canvas>

			<div class="main_wrapper" id="main_wrapper">
				<div class="canvas_wrapper" id="canvas_wrapper">
					<div id="mouse"></div>
					<div class="transparent-grid" id="canvas_minipaint_background"></div>
					<canvas id="canvas_minipaint">
						<div class="trn error">
							Seu navegador não suporta canvas ou o JavaScript está desativado.
						</div>
					</canvas>
				</div>
			</div>
		</div>

		<div class="sidebar_right">
			<div class="preview block">
				<h2 class="trn toggle" data-target="toggle_preview">Preview</h2>
				<div id="toggle_preview"></div>
			</div>
			
			<div class="colors block">
				<h2 class="trn toggle" data-target="toggle_colors">Colors</h2>
				<div class="content" id="toggle_colors"></div>
			</div>
			
			<div class="block" id="info_base">
				<h2 class="trn toggle toggle-full" data-target="toggle_info">Information</h2>
				<div class="content" id="toggle_info"></div>
			</div>
			
			<div class="details block" id="details_base">
				<h2 class="trn toggle toggle-full" data-target="toggle_details">Layer details</h2>
				<div class="content details-content" id="toggle_details"></div>
			</div>
			
			<div class="layers block">
				<h2 class="trn">Camadas & Histórico</h2>
				<div class="content" id="layers_base"></div>
			</div>
			
			<div class="bottom-copyright">
				© <?php echo date('Y'); ?> 4U.IA.BR &bull;
				<a href="privacidade.php" target="_blank">Privacidade</a> &bull;
				<a href="termos.php" target="_blank">Termos</a> &bull;
				<a href="suporte.php" target="_blank">Suporte</a>
			</div>
		</div>
	</div>
	<div class="mobile_menu">
		<button class="left_mobile_menu" id="left_mobile_menu_button" type="button">
			<span class="sr_only">Toggle Menu</span>
		</button>
		<button class="right_mobile_menu" id="mobile_menu_button" type="button">
			<span class="sr_only">Toggle Menu</span>
		</button>
	</div>
	<div class="hidden" id="tmp"></div>
	<div id="popups"></div>

</body>
</html>
