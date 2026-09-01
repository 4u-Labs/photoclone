import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Dialog_class from './../libs/popup.js';
import alertify from './../../../node_modules/alertifyjs/build/alertify.min.js';

var instance = null;

class Icons_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.POP = new Dialog_class();
		this.name = 'icons';
		this.cache = {};
		this.per_page = 48;
		this.selected_color = '#ffffff';
	}

	load() {
		//nothing
	}

	render(ctx, layer) {
		//nothing
	}

	on_activate() {
		this.search();
	}

	translate_pt_to_en(query) {
		const q = (query || '').toLowerCase().trim();
		const dict = {
			'usuario': 'user',
			'usuário': 'user',
			'usuarios': 'user',
			'usuários': 'user',
			'perfil': 'user',
			'pessoa': 'user',
			'redes': 'social',
			'redes sociais': 'social',
			'instagram': 'instagram',
			'whatsapp': 'whatsapp',
			'facebook': 'facebook',
			'youtube': 'youtube',
			'tiktok': 'tiktok',
			'vendas': 'shopping',
			'loja': 'store',
			'carrinho': 'cart',
			'sacola': 'bag',
			'midia': 'play',
			'mídia': 'play',
			'musica': 'music',
			'música': 'music',
			'video': 'video',
			'vídeo': 'video',
			'som': 'audio',
			'setas': 'arrow',
			'seta': 'arrow',
			'chat': 'chat',
			'mensagem': 'message',
			'email': 'email',
			'e-mail': 'email',
			'contato': 'phone',
			'telefone': 'phone',
			'celular': 'phone',
			'financas': 'money',
			'finanças': 'money',
			'dinheiro': 'money',
			'pix': 'qr',
			'banco': 'bank',
			'cartao': 'card',
			'cartão': 'card',
			'configuracoes': 'settings',
			'configurações': 'settings',
			'ajustes': 'settings',
			'engrenagem': 'gear',
			'seguranca': 'lock',
			'segurança': 'lock',
			'cadeado': 'lock',
			'escudo': 'shield',
			'comida': 'food',
			'restaurante': 'restaurant',
			'hamburguer': 'burger',
			'hambúrguer': 'burger',
			'pizza': 'pizza',
			'cafe': 'coffee',
			'café': 'coffee',
			'carro': 'car',
			'carros': 'car',
			'veiculo': 'car',
			'veículo': 'car',
			'moto': 'motorcycle',
			'curtidas': 'heart',
			'curtida': 'heart',
			'coracao': 'heart',
			'coração': 'heart',
			'amor': 'heart',
			'estrelas': 'star',
			'estrela': 'star',
			'avaliacao': 'star',
			'avaliação': 'star',
			'dispositivos': 'laptop',
			'computador': 'laptop',
			'notebook': 'laptop',
			'empresas': 'building',
			'empresa': 'building',
			'negocios': 'business',
			'negócios': 'business',
			'escritorio': 'office',
			'escritório': 'office',
			'clima': 'sun',
			'tempo': 'weather',
			'sol': 'sun',
			'chuva': 'rain',
			'nuvem': 'cloud',
			'casa': 'home',
			'localizacao': 'pin',
			'localização': 'pin',
			'mapa': 'map',
			'fogo': 'fire',
			'chama': 'fire',
			'brilho': 'sparkle',
			'lampada': 'lightbulb',
			'lâmpada': 'lightbulb',
			'ideia': 'lightbulb',
			'trofeu': 'trophy',
			'troféu': 'trophy',
			'foguete': 'rocket'
		};

		if (dict[q]) return dict[q];
		for (const [k, v] of Object.entries(dict)) {
			if (q.includes(k)) return v;
		}
		return q.split(' ')[0] || 'user';
	}

	search(initialQuery = '') {
		var _this = this;
		const isEn = config.LANG === 'en';

		const txtTitle = isEn ? '🎯 Global Vector Icons (+200,000 SVGs)' : '🎯 Banco de Ícones & Vetores (+200.000 Ícones SVG)';
		const txtPlaceholder = isEn ? '🔍 Search icons (e.g. user, heart, whatsapp, car, star, shopping)...' : '🔍 Buscar ícones (ex: usuário, coração, whatsapp, carro, estrela, carrinho)...';
		const txtSearchBtn = isEn ? 'Search' : 'Buscar';
		const txtLoading = isEn ? 'Searching 200,000+ vector icons...' : 'Buscando em mais de 200.000 ícones vetoriais...';
		const txtLoadingMore = isEn ? 'Loading more icons...' : 'Carregando mais ícones...';
		const txtNoIcons = isEn ? 'No icons found for' : 'Nenhum ícone encontrado para';
		const txtNoIconsHint = isEn ? 'Try another single keyword in English or Portuguese!' : 'Tente pesquisar uma palavra simples ou clique nas categorias rápidas!';
		const txtTipLeft = isEn ? '⚡ 100% Free & Open Source SVGs via Iconify (FontAwesome, Material, Lucide, Tabler, Brands).' : '⚡ 100% Gratuito & Vetorial via Iconify (FontAwesome, Material, Lucide, Tabler, Marcas).';
		const txtTipRight = isEn ? 'Infinite Scroll • Pick Color • 1-Click Insert' : 'Rolagem Infinita • Escolha a Cor • Inserção em 1 Clique';
		const txtUse = isEn ? '+ Use' : '+ Usar';

		const colorPresets = [
			{ color: '#ffffff', title: 'Branco' },
			{ color: '#000000', title: 'Preto' },
			{ color: '#3b82f6', title: 'Azul' },
			{ color: '#ef4444', title: 'Vermelho' },
			{ color: '#22c55e', title: 'Verde' },
			{ color: '#facc15', title: 'Amarelo' },
			{ color: '#a855f7', title: 'Roxo' },
			{ color: '#ec4899', title: 'Rosa' },
			{ color: '#06b6d4', title: 'Ciano' },
			{ color: '#f97316', title: 'Laranja' }
		];

		var modalHtml = `
			<div style="text-align:left; width:100%; box-sizing:border-box;">
				<!-- Search Header & Color Bar -->
				<div style="display:flex; gap:8px; margin-bottom:8px; align-items:center; width:100%;">
					<div style="flex:1; position:relative;">
						<input type="text" id="icon_search_input" placeholder="${txtPlaceholder}" value="${initialQuery}" style="width:100%; box-sizing:border-box; padding:9px 14px; font-size:13px; background:#0f172a; border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff;" />
					</div>
					<button type="button" id="btn_icon_search_trigger" style="padding:9px 20px; background:#3b82f6; color:#ffffff; font-weight:700; font-size:13px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; flex-shrink:0;">
						${txtSearchBtn}
					</button>
				</div>

				<!-- Color Selector Palette Bar -->
				<div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding:6px 12px; background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:8px;">
					<span style="font-size:11.5px; color:#94a3b8; font-weight:700;">🎨 ${isEn ? 'Icon Color:' : 'Cor do Ícone:'}</span>
					<div style="display:flex; gap:6px; align-items:center;">
						${colorPresets.map(cp => `
							<div class="icon-palette-dot ${cp.color === _this.selected_color ? 'active' : ''}" data-color="${cp.color}" title="${cp.title}" style="width:20px; height:20px; border-radius:50%; background:${cp.color}; cursor:pointer; border:2px solid ${cp.color === _this.selected_color ? '#3b82f6' : 'rgba(255,255,255,0.2)'}; transition:all 0.15s ease;"></div>
						`).join('')}
						<input type="color" id="icon_custom_color" value="${_this.selected_color}" style="width:24px; height:24px; border:none; border-radius:4px; cursor:pointer; background:transparent; padding:0;" title="Cor Personalizada" />
					</div>
					<span style="margin-left:auto; font-size:10.5px; color:#64748b;">+200k SVGs • Iconify</span>
				</div>

				<!-- Quick Tag Pills (Symmetric 2 Rows Grid) -->
				<div style="display:grid; grid-template-columns: repeat(8, 1fr); gap:6px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
					<button type="button" class="icon_pill_btn active" data-q="user" style="padding:6px 2px; font-size:11px; font-weight:600; background:#3b82f6; color:#ffffff; border:none; border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">👤 ${isEn ? 'Users' : 'Usuários'}</button>
					<button type="button" class="icon_pill_btn" data-q="social" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📱 ${isEn ? 'Social' : 'Redes'}</button>
					<button type="button" class="icon_pill_btn" data-q="cart" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🛒 ${isEn ? 'Shopping' : 'Vendas'}</button>
					<button type="button" class="icon_pill_btn" data-q="play" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">▶️ ${isEn ? 'Media' : 'Mídia'}</button>
					<button type="button" class="icon_pill_btn" data-q="arrow" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">➡️ ${isEn ? 'Arrows' : 'Setas'}</button>
					<button type="button" class="icon_pill_btn" data-q="chat" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💬 Chat</button>
					<button type="button" class="icon_pill_btn" data-q="money" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💰 ${isEn ? 'Finance' : 'Finanças'}</button>
					<button type="button" class="icon_pill_btn" data-q="settings" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">⚙️ ${isEn ? 'Settings' : 'Ajustes'}</button>

					<button type="button" class="icon_pill_btn" data-q="lock" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🔒 ${isEn ? 'Security' : 'Segurança'}</button>
					<button type="button" class="icon_pill_btn" data-q="food" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🍔 ${isEn ? 'Food' : 'Comida'}</button>
					<button type="button" class="icon_pill_btn" data-q="car" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🚗 ${isEn ? 'Cars' : 'Carros'}</button>
					<button type="button" class="icon_pill_btn" data-q="heart" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">❤️ ${isEn ? 'Likes' : 'Curtidas'}</button>
					<button type="button" class="icon_pill_btn" data-q="star" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">⭐ ${isEn ? 'Stars' : 'Estrelas'}</button>
					<button type="button" class="icon_pill_btn" data-q="laptop" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💻 Devices</button>
					<button type="button" class="icon_pill_btn" data-q="building" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏢 ${isEn ? 'Business' : 'Empresas'}</button>
					<button type="button" class="icon_pill_btn" data-q="sun" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">☀️ ${isEn ? 'Weather' : 'Clima'}</button>
				</div>

				<!-- Icons Grid with Smooth Infinite Scroll -->
				<div id="icons_grid_container" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap:10px; max-height:480px; overflow-y:auto; padding:4px; min-height:240px; scroll-behavior:smooth;">
					<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
						<div style="font-size:32px; margin-bottom:8px;">⏳</div>
						<div>${txtLoading}</div>
					</div>
				</div>

				<div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:11px; color:#64748b; border-top:1px solid rgba(255,255,255,0.08); padding-top:6px;">
					<span>${txtTipLeft}</span>
					<span>${txtTipRight}</span>
				</div>
			</div>
		`;

		var settings = {
			title: txtTitle,
			className: 'wide extra-wide icon-gallery-popup',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				const grid = document.getElementById('icons_grid_container');
				const input = document.getElementById('icon_search_input');
				const btnSearch = document.getElementById('btn_icon_search_trigger');
				const pillBtns = document.querySelectorAll('.icon_pill_btn');
				const paletteDots = document.querySelectorAll('.icon-palette-dot');
				const customColor = document.getElementById('icon_custom_color');

				let currentQuery = initialQuery || 'user';
				let currentOffset = 0;
				let isLoadingMore = false;
				let hasMore = true;
				let allFoundIcons = [];
				let renderedIcons = new Set();

				function renderIconCard(iconName) {
					const encodedColor = encodeURIComponent(_this.selected_color);
					const iconUrl = `https://api.iconify.design/${iconName.replace(':', '/')}.svg?color=${encodedColor}`;
					const cleanTitle = iconName.split(':')[1] || iconName;

					return `
						<div class="icon-item-card" data-icon="${iconName}" style="position:relative; aspect-ratio:1/1; border-radius:8px; overflow:hidden; background:#1e293b; cursor:pointer; border:1px solid rgba(255,255,255,0.1); transition:all 0.18s ease; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px; box-shadow:0 2px 6px rgba(0,0,0,0.25);">
							<img src="${iconUrl}" alt="${cleanTitle}" loading="lazy" style="width:44px; height:44px; object-fit:contain; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3)); pointer-events:none;" />
							<div style="font-size:10px; color:#94a3b8; margin-top:8px; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%;">
								${cleanTitle}
							</div>
							<div class="icon-hover-overlay" style="position:absolute; inset:0; background:rgba(59,130,246,0.25); border:2px solid #3b82f6; border-radius:8px; opacity:0; transition:opacity 0.15s ease; display:flex; align-items:center; justify-content:center;">
								<span style="background:#3b82f6; color:#fff; font-size:10.5px; font-weight:bold; padding:3px 7px; border-radius:4px;">
									${txtUse}
								</span>
							</div>
						</div>
					`;
				}

				function bindCardEvents(container) {
					container.querySelectorAll('.icon-item-card:not([data-bound="true"])').forEach(card => {
						card.setAttribute('data-bound', 'true');
						card.addEventListener('mouseenter', () => {
							const ov = card.querySelector('.icon-hover-overlay');
							if (ov) ov.style.opacity = '1';
							card.style.transform = 'translateY(-2px)';
						});
						card.addEventListener('mouseleave', () => {
							const ov = card.querySelector('.icon-hover-overlay');
							if (ov) ov.style.opacity = '0';
							card.style.transform = 'translateY(0)';
						});
						card.addEventListener('click', function() {
							const iconName = this.dataset.icon;
							_this.insert_icon_as_layer(iconName, _this.selected_color);
						});
					});
				}

				function renderCurrentBatch(isAppend = false) {
					const batch = allFoundIcons.slice(currentOffset, currentOffset + _this.per_page);
					if (batch.length === 0) {
						if (!isAppend) {
							grid.innerHTML = `
								<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
									<div style="font-size:32px; margin-bottom:8px;">🔍</div>
									<div style="font-weight:bold; font-size:13px;">${txtNoIcons} "${currentQuery}"</div>
									<div style="font-size:11.5px; color:#64748b; margin-top:4px;">${txtNoIconsHint}</div>
								</div>
							`;
						}
						hasMore = false;
						isLoadingMore = false;
						return;
					}

					const uniqueBatch = batch.filter(icon => !renderedIcons.has(icon));
					uniqueBatch.forEach(icon => renderedIcons.add(icon));

					const html = uniqueBatch.map(icon => renderIconCard(icon)).join('');
					if (!isAppend) {
						grid.innerHTML = html;
					} else {
						grid.insertAdjacentHTML('beforeend', html);
					}

					bindCardEvents(grid);
					currentOffset += batch.length;
					hasMore = currentOffset < allFoundIcons.length;
					isLoadingMore = false;
				}

				function loadIcons(q) {
					grid.innerHTML = `
						<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
							<div style="font-size:32px; margin-bottom:8px;">⏳</div>
							<div>${txtLoading}</div>
						</div>
					`;
					currentOffset = 0;
					hasMore = true;
					renderedIcons = new Set();

					const translatedQ = _this.translate_pt_to_en(q);
					_this.fetch_iconify(translatedQ, function(icons) {
						allFoundIcons = icons || [];
						renderCurrentBatch(false);
					});
				}

				function rerenderColors() {
					grid.querySelectorAll('.icon-item-card').forEach(card => {
						const iconName = card.dataset.icon;
						const encodedColor = encodeURIComponent(_this.selected_color);
						const iconUrl = `https://api.iconify.design/${iconName.replace(':', '/')}.svg?color=${encodedColor}`;
						const img = card.querySelector('img');
						if (img) img.src = iconUrl;
					});
				}

				paletteDots.forEach(dot => {
					dot.addEventListener('click', function() {
						paletteDots.forEach(d => {
							d.style.borderColor = 'rgba(255,255,255,0.2)';
							d.classList.remove('active');
						});
						this.style.borderColor = '#3b82f6';
						this.classList.add('active');
						_this.selected_color = this.dataset.color;
						customColor.value = _this.selected_color;
						rerenderColors();
					});
				});

				customColor.addEventListener('input', function() {
					_this.selected_color = this.value;
					paletteDots.forEach(d => d.style.borderColor = 'rgba(255,255,255,0.2)');
					rerenderColors();
				});

				grid.addEventListener('scroll', () => {
					if (isLoadingMore || !hasMore) return;
					if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 160) {
						isLoadingMore = true;
						renderCurrentBatch(true);
					}
				});

				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						currentQuery = input.value.trim();
						loadIcons(currentQuery);
					}
				});

				btnSearch.addEventListener('click', () => {
					currentQuery = input.value.trim();
					loadIcons(currentQuery);
				});

				pillBtns.forEach(btn => {
					btn.addEventListener('click', function() {
						pillBtns.forEach(b => {
							b.style.background = '#1e293b';
							b.style.color = '#94a3b8';
							b.style.border = '1px solid rgba(255,255,255,0.1)';
							b.classList.remove('active');
						});
						this.style.background = '#3b82f6';
						this.style.color = '#ffffff';
						this.style.border = 'none';
						this.classList.add('active');

						const q = this.dataset.q;
						input.value = '';
						currentQuery = q;
						loadIcons(q);
					});
				});

				loadIcons(currentQuery);
			}
		};

		this.POP.show(settings);
	}

	fetch_iconify(query, callback) {
		const _this = this;
		const cleanQ = encodeURIComponent(query || 'user');
		const URL = `https://api.iconify.design/search?query=${cleanQ}&limit=200`;

		if (this.cache[URL]) {
			callback(this.cache[URL]);
			return;
		}

		fetch(URL)
			.then(res => res.json())
			.then(data => {
				if (data && data.icons && data.icons.length > 0) {
					_this.cache[URL] = data.icons;
					callback(data.icons);
				} else {
					callback([]);
				}
			})
			.catch(err => {
				console.error('Iconify API error:', err);
				callback([]);
			});
	}

	async insert_icon_as_layer(iconName, color = '#ffffff') {
		this.POP.hide();
		const cleanTitle = iconName.split(':')[1] || iconName;
		alertify.message(`⏳ Carregando ícone ${cleanTitle}...`);

		const encodedColor = encodeURIComponent(color);
		const iconSvgUrl = `https://api.iconify.design/${iconName.replace(':', '/')}.svg?color=${encodedColor}`;

		try {
			const res = await fetch(iconSvgUrl);
			let svgText = await res.text();

			if (!svgText.includes('xmlns="http://www.w3.org/2000/svg"')) {
				svgText = svgText.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
			}

			const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
			const blobUrl = URL.createObjectURL(svgBlob);

			const svgImg = new Image();
			svgImg.onload = async function() {
				URL.revokeObjectURL(blobUrl);

				const renderSize = 512;
				const canvas = document.createElement('canvas');
				canvas.width = renderSize;
				canvas.height = renderSize;
				const ctx = canvas.getContext('2d');
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(svgImg, 0, 0, renderSize, renderSize);

				const pngImg = new Image();
				pngImg.onload = async function() {
					let targetSize = 240;
					const maxAllowed = Math.min(config.WIDTH, config.HEIGHT) * 0.6;
					if (targetSize > maxAllowed) {
						targetSize = Math.round(maxAllowed);
					}

					const posX = Math.round((config.WIDTH - targetSize) / 2);
					const posY = Math.round((config.HEIGHT - targetSize) / 2);

					const new_layer = {
						name: `Ícone ${cleanTitle}`,
						type: 'image',
						link: pngImg,
						x: posX,
						y: posY,
						width: targetSize,
						height: targetSize,
						width_original: renderSize,
						height_original: renderSize
					};

					await app.State.do_action(
						new app.Actions.Insert_layer_action(new_layer, false)
					);

					if (app.GUI && app.GUI.GUI_preview && typeof app.GUI.GUI_preview.zoom_auto === 'function') {
						app.GUI.GUI_preview.zoom_auto();
					}

					alertify.success(`🎉 Ícone "${cleanTitle}" inserido com sucesso!`);
				};
				pngImg.src = canvas.toDataURL('image/png');
			};

			svgImg.onerror = function(err) {
				URL.revokeObjectURL(blobUrl);
				console.error('Error loading icon SVG:', err);
				alertify.error(`Erro ao inserir ícone ${cleanTitle}`);
			};

			svgImg.src = blobUrl;
		} catch (err) {
			console.error('Error fetching icon from Iconify:', err);
			alertify.error(`Erro ao baixar ícone.`);
		}
	}

}

export default Icons_class;
