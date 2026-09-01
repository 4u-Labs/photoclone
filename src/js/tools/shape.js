import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Dialog_class from './../libs/popup.js';
import GUI_tools_class from './../core/gui/gui-tools.js';

var instance = null;

class Shape_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.GUI_tools = new GUI_tools_class();
		this.POP = new Dialog_class();
		this.ctx = ctx;
		this.name = 'shape';

		this.set_events();
	}

	set_events() {
		document.addEventListener('keydown', (event) => {
			var code = event.keyCode;
			if (this.Helper.is_input(event.target))
				return;

			if (code == 72) {
				// H
				this.show_hub();
			}
		}, false);
	}

	load() {
		// Nothing
	}

	on_activate() {
		this.show_hub();
	}

	render(ctx, layer) {
		// Nothing
	}

	show_hub() {
		var _this = this;
		const isEn = config.LANG === 'en';

		const txtTitle = isEn ? '🌟 Creative Assets Hub' : '🌟 Banco de Recursos Criativos';
		const txtSubtitle = isEn ? 'Choose a resource category to search and insert into your design:' : 'Escolha a categoria de elementos visuais que deseja buscar e inserir na sua arte:';

		const services = [
			{
				id: 'media',
				icon: '📷',
				badge: 'HD Stock',
				badgeBg: '#0284c7',
				title: isEn ? 'Free HD Stock Photos' : 'Fotos Gratuitas em HD',
				desc: isEn ? 'Millions of royalty-free stock photos, food, business, fitness, travel & backgrounds.' : 'Milhões de fotos profissionais gratuitas: lanches, pessoas, negócios, viagens, fitness e texturas.',
				btnText: isEn ? 'Search Photos ➔' : 'Abrir Fotos ➔',
				gradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
				border: '#0284c7'
			},
			{
				id: 'illustrations',
				icon: '🎨',
				badge: 'Flat & 3D Art',
				badgeBg: '#a855f7',
				title: isEn ? 'Vector & 3D Illustrations' : 'Ilustrações & Arte Conceitual',
				desc: isEn ? 'Conceptual illustrations, startup, corporate, education, healthcare & modern 3D artwork.' : 'Ilustrações conceituais, startup, corporativo, medicina, educação e arte moderna 3D.',
				btnText: isEn ? 'Search Illustrations ➔' : 'Abrir Ilustrações ➔',
				gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
				border: '#a855f7'
			},
			{
				id: 'icons',
				icon: '🎯',
				badge: '+200k SVGs',
				badgeBg: '#3b82f6',
				title: isEn ? 'Global Vector Icons (+200k)' : 'Ícones & Vetores Globais (+200k)',
				desc: isEn ? 'Over 200,000 SVG icons from top libraries with real-time color customizer.' : 'Mais de 200.000 ícones vetoriais com seletor de paleta de cores em tempo real e busca inteligente.',
				btnText: isEn ? 'Search Icons ➔' : 'Abrir Ícones ➔',
				gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
				border: '#3b82f6'
			},
			{
				id: 'wallpapers',
				icon: '🖼️',
				badge: '4K Ultra HD',
				badgeBg: '#10b981',
				title: isEn ? '4K Wallpapers & Backgrounds' : 'Wallpapers & Fundos 4K',
				desc: isEn ? 'Ultra HD wallpapers, marble textures, space, wood, cyberpunk, dark & gradients.' : 'Papéis de parede em 4K, texturas de mármore, espaço, madeira, cyberpunk, dark e gradientes.',
				btnText: isEn ? 'Search Wallpapers ➔' : 'Abrir Wallpapers ➔',
				gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
				border: '#10b981'
			},
			{
				id: 'stickers',
				icon: '🏹',
				badge: '100% Transparente',
				badgeBg: '#f59e0b',
				title: isEn ? 'Transparent Stickers & Doodles' : 'Adesivos, Setas & Doodles',
				desc: isEn ? 'Transparent PNG stickers, neon arrows, promo badges (50% OFF, Free Shipping), sparkles & fire.' : 'Fundo transparente: setas neon, selos de promoção (50% OFF, Frete Grátis), chamas e rabiscos.',
				btnText: isEn ? 'Search Stickers ➔' : 'Abrir Adesivos ➔',
				gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
				border: '#f59e0b'
			},
			{
				id: 'emojis',
				icon: '💥',
				badge: '1.777 Emojis HD',
				badgeBg: '#ec4899',
				title: isEn ? 'World Emojis Hub (1,777 Emojis)' : 'Central de Emojis do Mundo (1.777)',
				desc: isEn ? 'Complete official Unicode emoji collection rendered in 1024px HD with transparent background.' : 'Coleção oficial com todos os 1.777 emojis mundiais em 1024px com transparência e busca em português.',
				btnText: isEn ? 'Search Emojis ➔' : 'Abrir Emojis ➔',
				gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
				border: '#ec4899'
			}
		];

		var modalHtml = `
			<div style="text-align:left; width:100%; box-sizing:border-box; padding:4px 2px;">
				<div style="font-size:12.5px; color:#94a3b8; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">
					${txtSubtitle}
				</div>

				<!-- Perfectly Symmetrical 2 Columns x 3 Rows Grid -->
				<div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px;">
					${services.map(s => `
						<div class="creative-service-card" data-service="${s.id}" style="background:${s.gradient}; border:1px solid ${s.border}55; border-radius:10px; padding:14px 16px; cursor:pointer; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 12px rgba(0,0,0,0.3); position:relative; overflow:hidden;">
							<div>
								<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
									<div style="display:flex; align-items:center; gap:8px;">
										<span style="font-size:24px; line-height:1; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">${s.icon}</span>
										<span style="font-size:13.5px; font-weight:700; color:#ffffff;">${s.title}</span>
									</div>
									<span style="font-size:10px; font-weight:700; background:${s.badgeBg}; color:#ffffff; padding:2px 7px; border-radius:12px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
										${s.badge}
									</span>
								</div>
								<div style="font-size:11.5px; color:#94a3b8; line-height:1.45; margin-bottom:12px;">
									${s.desc}
								</div>
							</div>
							<div style="display:flex; justify-content:flex-end;">
								<button type="button" class="btn-service-launch" data-service="${s.id}" style="padding:6px 14px; background:${s.border}; color:#ffffff; font-weight:700; font-size:11.5px; border:none; border-radius:6px; cursor:pointer; transition:transform 0.15s ease;">
									${s.btnText}
								</button>
							</div>
						</div>
					`).join('')}
				</div>

				<div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; font-size:11px; color:#64748b; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
					<span>⚡ 100% Gratuito & Integrado ao PhotoClone</span>
					<span>Atalho: Tecla <strong>H</strong></span>
				</div>
			</div>
		`;

		var settings = {
			title: txtTitle,
			className: 'wide creative-hub-popup',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				const cards = document.querySelectorAll('.creative-service-card');
				cards.forEach(card => {
					card.addEventListener('mouseenter', function() {
						this.style.transform = 'translateY(-2px) scale(1.01)';
						this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.45)';
						this.style.borderColor = 'rgba(255,255,255,0.4)';
					});
					card.addEventListener('mouseleave', function() {
						this.style.transform = 'translateY(0) scale(1)';
						this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
						this.style.borderColor = '';
					});
					card.addEventListener('click', function(e) {
						const serviceId = this.dataset.service;
						_this.POP.hide();
						setTimeout(() => {
							_this.GUI_tools.activate_tool(serviceId);
						}, 50);
					});
				});
			}
		};

		this.POP.show(settings);
	}

}

export default Shape_class;
