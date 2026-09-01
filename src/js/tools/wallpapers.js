import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Dialog_class from './../libs/popup.js';
import alertify from './../../../node_modules/alertifyjs/build/alertify.min.js';

var instance = null;

class Wallpapers_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.POP = new Dialog_class();
		this.name = 'wallpapers';
		this.cache = {};
		this.page = 1;
		this.per_page = 24;
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
			'4k': 'wallpaper 4k ultra hd landscape',
			'cyberpunk': 'cyberpunk neon night city futuristic',
			'marmore': 'marble texture luxury stone pattern',
			'mármore': 'marble texture luxury stone pattern',
			'madeira': 'wood texture background timber rustic',
			'espaco': 'space galaxy stars nebula cosmos universe',
			'espaço': 'space galaxy stars nebula cosmos universe',
			'abstrato': 'abstract 3d render gradient wallpaper',
			'minimalista': 'minimalist clean aesthetic modern',
			'montanhas': 'mountain landscape nature peak 4k',
			'montanha': 'mountain landscape nature peak 4k',
			'cidades': 'city skyline architecture night buildings',
			'cidade': 'city skyline architecture night buildings',
			'carros': 'supercar luxury automotive car sport',
			'carro': 'supercar luxury automotive car sport',
			'arte digital': 'digital art fantasy painting illustration',
			'escuro': 'dark black background texture luxury',
			'fundo escuro': 'dark black background texture luxury',
			'gradiente': 'gradient smooth colorful aesthetic background',
			'fogo': 'fire flames energy burning blaze',
			'geometrico': 'geometric abstract modern pattern',
			'geométrico': 'geometric abstract modern pattern',
			'estudio': 'studio background backdrop podium lighting',
			'estúdio': 'studio background backdrop podium lighting',
			'praia': 'tropical beach ocean sea paradise palm',
			'natureza': 'nature forest landscape trees green'
		};

		if (dict[q]) return dict[q];
		for (const [k, v] of Object.entries(dict)) {
			if (q.includes(k)) return q.replace(k, v);
		}
		return q;
	}

	search(initialQuery = '') {
		var _this = this;
		const isEn = config.LANG === 'en';

		const txtTitle = isEn ? '🖼️ 4K Wallpapers & Ultra HD Backgrounds' : '🖼️ Wallpapers 4K & Planos de Fundo Ultra HD';
		const txtPlaceholder = isEn ? '🔍 Search 4K wallpapers (e.g. cyberpunk, marble, space, luxury car, dark)...' : '🔍 Buscar wallpapers 4K (ex: cyberpunk, mármore, espaço, carro luxo, escuro)...';
		const txtSearchBtn = isEn ? 'Search' : 'Buscar';
		const txtLoading = isEn ? 'Searching 4K & Ultra HD wallpapers...' : 'Buscando wallpapers e fundos em 4K...';
		const txtLoadingMore = isEn ? 'Loading more wallpapers...' : 'Carregando mais wallpapers...';
		const txtNoResults = isEn ? 'No wallpapers found for' : 'Nenhum wallpaper encontrado para';
		const txtNoResultsHint = isEn ? 'Try another keyword or select a category above!' : 'Tente pesquisar outra palavra ou escolha uma das categorias acima!';
		const txtTipLeft = isEn ? '⚡ 100% Free & Royalty-Free 4K Ultra HD Backgrounds (Free Commercial Use).' : '⚡ 100% Gratuito & Livre para Uso Comercial em 4K Ultra HD.';
		const txtTipRight = isEn ? 'Infinite Scroll • 1-Click Insert' : 'Rolagem Infinita • Inserção em 1 Clique';
		const txtUse = isEn ? '+ Use' : '+ Usar';

		var modalHtml = `
			<div style="text-align:left; width:100%; box-sizing:border-box;">
				<!-- Search Header -->
				<div style="display:flex; gap:8px; margin-bottom:10px; align-items:center; width:100%;">
					<div style="flex:1; position:relative;">
						<input type="text" id="wall_search_input" placeholder="${txtPlaceholder}" value="${initialQuery}" style="width:100%; box-sizing:border-box; padding:9px 14px; font-size:13px; background:#0f172a; border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff;" />
					</div>
					<button type="button" id="btn_wall_search_trigger" style="padding:9px 20px; background:#3b82f6; color:#ffffff; font-weight:700; font-size:13px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; flex-shrink:0;">
						${txtSearchBtn}
					</button>
				</div>

				<!-- Quick Tag Pills (Symmetric 2 Rows Grid) -->
				<div style="display:grid; grid-template-columns: repeat(8, 1fr); gap:6px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
					<button type="button" class="wall_pill_btn active" data-q="wallpaper 4k ultra hd landscape" style="padding:6px 2px; font-size:11px; font-weight:600; background:#3b82f6; color:#ffffff; border:none; border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💎 4K Ultra HD</button>
					<button type="button" class="wall_pill_btn" data-q="cyberpunk neon night city futuristic" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌆 Cyberpunk</button>
					<button type="button" class="wall_pill_btn" data-q="marble texture luxury stone pattern" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏛️ ${isEn ? 'Marble' : 'Mármore'}</button>
					<button type="button" class="wall_pill_btn" data-q="wood texture background timber rustic" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🪵 ${isEn ? 'Wood' : 'Madeira'}</button>
					<button type="button" class="wall_pill_btn" data-q="space galaxy stars nebula cosmos" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌌 ${isEn ? 'Space' : 'Espaço'}</button>
					<button type="button" class="wall_pill_btn" data-q="abstract 3d render gradient wallpaper" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌀 ${isEn ? 'Abstract 3D' : 'Abstrato 3D'}</button>
					<button type="button" class="wall_pill_btn" data-q="minimalist clean aesthetic modern" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">⚪ Minimal</button>
					<button type="button" class="wall_pill_btn" data-q="mountain landscape nature peak 4k" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏔️ ${isEn ? 'Mountains' : 'Montanhas'}</button>

					<button type="button" class="wall_pill_btn" data-q="city skyline architecture night buildings" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏙️ ${isEn ? 'Cities' : 'Cidades'}</button>
					<button type="button" class="wall_pill_btn" data-q="supercar luxury automotive car sport" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏎️ ${isEn ? 'Luxury Cars' : 'Carros Luxo'}</button>
					<button type="button" class="wall_pill_btn" data-q="digital art fantasy painting illustration" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🎨 ${isEn ? 'Digital Art' : 'Arte Digital'}</button>
					<button type="button" class="wall_pill_btn" data-q="dark black background texture luxury" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">⬛ ${isEn ? 'Dark Black' : 'Dark Escuro'}</button>
					<button type="button" class="wall_pill_btn" data-q="gradient smooth colorful aesthetic background" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌈 ${isEn ? 'Gradients' : 'Gradientes'}</button>
					<button type="button" class="wall_pill_btn" data-q="fire flames energy burning blaze" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🔥 ${isEn ? 'Fire & Energy' : 'Fogo & Energia'}</button>
					<button type="button" class="wall_pill_btn" data-q="geometric abstract modern pattern" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📐 ${isEn ? 'Geometric' : 'Geométrico'}</button>
					<button type="button" class="wall_pill_btn" data-q="studio background backdrop podium lighting" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📸 ${isEn ? 'Studio' : 'Estúdio'}</button>
				</div>

				<!-- Wallpapers Grid with Smooth Infinite Scroll -->
				<div id="wallpapers_grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap:12px; max-height:480px; overflow-y:auto; padding:4px; min-height:240px; scroll-behavior:smooth;">
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
			className: 'wide extra-wide wallpaper-gallery-popup',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				const grid = document.getElementById('wallpapers_grid');
				const input = document.getElementById('wall_search_input');
				const btnSearch = document.getElementById('btn_wall_search_trigger');
				const pillBtns = document.querySelectorAll('.wall_pill_btn');

				let currentQuery = initialQuery || 'wallpaper 4k ultra hd landscape';
				let currentPage = 1;
				let isLoadingMore = false;
				let hasMore = true;
				let renderedIds = new Set();

				function renderCardHtml(p) {
					return `
						<div class="wallpaper-card" data-url="${p.largeUrl || p.url}" data-title="${p.title || 'Wallpaper 4K'}" style="position:relative; aspect-ratio:16/9; border-radius:6px; overflow:hidden; background:#0f172a; cursor:pointer; border:1px solid rgba(255,255,255,0.08); transition:all 0.2s ease; box-shadow:0 2px 8px rgba(0,0,0,0.25);">
							<img src="${p.thumbUrl || p.url}" alt="${p.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;" />
							<div class="wallpaper-overlay" style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%); opacity:0; transition:opacity 0.2s ease; display:flex; flex-direction:column; justify-content:space-between; padding:8px;">
								<span style="align-self:flex-end; font-size:9.5px; background:rgba(0,0,0,0.7); color:#38bdf8; padding:1px 5px; border-radius:3px; border:1px solid #38bdf8;">
									${p.width && p.height ? `${p.width}x${p.height}` : '4K Ultra HD'}
								</span>
								<div style="display:flex; align-items:center; justify-content:space-between;">
									<span style="font-size:11px; color:#fff; font-weight:700; text-shadow:0 1px 3px rgba(0,0,0,0.8); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:130px;">
										${p.title || 'Wallpaper'}
									</span>
									<span style="font-size:11px; background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">
										${txtUse}
									</span>
								</div>
							</div>
						</div>
					`;
				}

				function bindCardEvents(container) {
					container.querySelectorAll('.wallpaper-card:not([data-bound="true"])').forEach(card => {
						card.setAttribute('data-bound', 'true');
						card.addEventListener('mouseenter', () => {
							const ov = card.querySelector('.wallpaper-overlay');
							if (ov) ov.style.opacity = '1';
							card.style.transform = 'scale(1.02)';
							card.style.borderColor = '#3b82f6';
						});
						card.addEventListener('mouseleave', () => {
							const ov = card.querySelector('.wallpaper-overlay');
							if (ov) ov.style.opacity = '0';
							card.style.transform = 'scale(1)';
							card.style.borderColor = 'rgba(255,255,255,0.08)';
						});
						card.addEventListener('click', function() {
							const url = this.dataset.url;
							const title = this.dataset.title;
							_this.insert_wallpaper_into_project(url, title);
						});
					});
				}

				function loadWallpapers(q, page, isAppend) {
					if (!isAppend) {
						grid.innerHTML = `
							<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
								<div style="font-size:32px; margin-bottom:8px;">⏳</div>
								<div>${txtLoading}</div>
							</div>
						`;
						currentPage = 1;
						hasMore = true;
						renderedIds = new Set();
					} else {
						const spinner = document.createElement('div');
						spinner.id = 'wall_loading_more';
						spinner.style.cssText = 'grid-column:1/-1; text-align:center; padding:16px; color:#38bdf8; font-size:12px; font-weight:600;';
						spinner.innerHTML = `⏳ ${txtLoadingMore}`;
						grid.appendChild(spinner);
					}

					const translatedQuery = _this.translate_pt_to_en(q);
					_this.fetch_wallpapers(translatedQuery, page, function(walls) {
						const spinner = document.getElementById('wall_loading_more');
						if (spinner) spinner.remove();

						if (!walls || walls.length === 0) {
							if (!isAppend) {
								grid.innerHTML = `
									<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
										<div style="font-size:32px; margin-bottom:8px;">🔍</div>
										<div style="font-weight:bold; font-size:13px;">${txtNoResults} "${q}"</div>
										<div style="font-size:11.5px; color:#64748b; margin-top:4px;">${txtNoResultsHint}</div>
									</div>
								`;
							}
							hasMore = false;
							isLoadingMore = false;
							return;
						}

						if (walls.length < _this.per_page) {
							hasMore = false;
						}

						const uniqueWalls = walls.filter(p => !renderedIds.has(p.id));
						uniqueWalls.forEach(p => renderedIds.add(p.id));

						let html = uniqueWalls.map(p => renderCardHtml(p)).join('');

						if (!isAppend) {
							grid.innerHTML = html;
						} else {
							grid.insertAdjacentHTML('beforeend', html);
						}

						bindCardEvents(grid);
						isLoadingMore = false;
					});
				}

				function doSearch(q) {
					currentQuery = q || 'wallpaper 4k ultra hd landscape';
					currentPage = 1;
					isLoadingMore = false;
					hasMore = true;
					loadWallpapers(currentQuery, 1, false);
				}

				grid.addEventListener('scroll', () => {
					if (isLoadingMore || !hasMore) return;
					if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 180) {
						isLoadingMore = true;
						currentPage++;
						loadWallpapers(currentQuery, currentPage, true);
					}
				});

				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						currentQuery = input.value.trim();
						doSearch(currentQuery);
					}
				});

				btnSearch.addEventListener('click', () => {
					currentQuery = input.value.trim();
					doSearch(currentQuery);
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
						doSearch(q);
					});
				});

				loadWallpapers(currentQuery, 1, false);
			}
		};

		this.POP.show(settings);
	}

	fetch_wallpapers(query, page, callback) {
		const _this = this;
		const cleanQ = encodeURIComponent(query);
		const key = '7141209-20aeb812fa33edf3fa8dc2ac3';
		const pageNum = page || 1;

		const URL = `https://pixabay.com/api/?key=${key}&page=${pageNum}&per_page=${this.per_page}&safesearch=true&image_type=photo&category=backgrounds&q=${cleanQ}`;

		if (this.cache[URL]) {
			callback(this.cache[URL]);
			return;
		}

		fetch(URL)
			.then(res => res.json())
			.then(data => {
				if (data && data.hits && data.hits.length > 0) {
					const formatted = data.hits.map(h => ({
						id: h.id,
						title: h.tags.split(',')[0] || 'Wallpaper 4K',
						author: h.user,
						thumbUrl: h.webformatURL,
						largeUrl: h.largeImageURL || h.webformatURL,
						width: h.imageWidth,
						height: h.imageHeight
					}));
					_this.cache[URL] = formatted;
					callback(formatted);
				} else {
					_this.fetch_pixabay_fallback(query, pageNum, callback);
				}
			})
			.catch(err => {
				console.warn('Wallpaper API error, fallback:', err);
				_this.fetch_pixabay_fallback(query, pageNum, callback);
			});
	}

	fetch_pixabay_fallback(query, pageNum, callback) {
		const _this = this;
		const cleanQ = encodeURIComponent(query);
		const key = '7141209-20aeb812fa33edf3fa8dc2ac3';
		const URL = `https://pixabay.com/api/?key=${key}&page=${pageNum}&per_page=${this.per_page}&safesearch=true&image_type=photo&q=${cleanQ}`;

		fetch(URL)
			.then(res => res.json())
			.then(data => {
				if (data && data.hits && data.hits.length > 0) {
					const formatted = data.hits.map(h => ({
						id: h.id,
						title: h.tags.split(',')[0] || 'Wallpaper HD',
						author: h.user,
						thumbUrl: h.webformatURL,
						largeUrl: h.largeImageURL || h.webformatURL,
						width: h.imageWidth,
						height: h.imageHeight
					}));
					callback(formatted);
				} else {
					callback([]);
				}
			})
			.catch(() => callback([]));
	}

	async insert_wallpaper_into_project(url, title) {
		this.POP.hide();
		alertify.message(`⏳ Baixando wallpaper em 4K...`);

		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = async function() {
			const imgW = img.naturalWidth || img.width;
			const imgH = img.naturalHeight || img.height;

			if (config.layers.length <= 1 && config.layers[0] && config.layers[0].data == null && config.layers[0].link == null) {
				await app.State.do_action(
					new app.Actions.Bundle_action('open_wallpaper', 'Open 4K Wallpaper', [
						new app.Actions.Insert_layer_action({
							name: title || 'Wallpaper 4K',
							type: 'image',
							link: img,
							width: imgW,
							height: imgH,
							width_original: imgW,
							height_original: imgH
						}),
						new app.Actions.Autoresize_canvas_action(imgW, imgH, null, true, true)
					])
				);
			} else {
				let targetW = Math.round(config.WIDTH);
				let targetH = Math.round(targetW * (imgH / imgW));

				const posX = Math.round((config.WIDTH - targetW) / 2);
				const posY = Math.round((config.HEIGHT - targetH) / 2);

				const new_layer = {
					name: title || 'Wallpaper 4K',
					type: 'image',
					link: img,
					x: posX,
					y: posY,
					width: targetW,
					height: targetH,
					width_original: imgW,
					height_original: imgH
				};

				await app.State.do_action(
					new app.Actions.Insert_layer_action(new_layer, false)
				);
			}

			if (app.GUI && app.GUI.GUI_preview && typeof app.GUI.GUI_preview.zoom_auto === 'function') {
				app.GUI.GUI_preview.zoom_auto();
			}

			alertify.success(`🎉 Wallpaper "${title || '4K'}" inserido com sucesso!`);
		};

		img.onerror = function() {
			alertify.error('Erro ao baixar wallpaper.');
		};

		img.src = url;
	}

}

export default Wallpapers_class;
