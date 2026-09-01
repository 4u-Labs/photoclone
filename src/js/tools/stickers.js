import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Dialog_class from './../libs/popup.js';
import alertify from './../../../node_modules/alertifyjs/build/alertify.min.js';

var instance = null;

class Stickers_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.POP = new Dialog_class();
		this.name = 'stickers';
		this.cache = {};
		this.page = 1;
		this.per_page = 28;
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
			'setas neon': 'neon arrow',
			'seta neon': 'neon arrow',
			'setas': 'arrow',
			'seta': 'arrow',
			'rabisco': 'doodle arrow',
			'selos': 'sale badge',
			'selo': 'sale badge',
			'promocao': 'sale discount offer',
			'promoção': 'sale discount offer',
			'circulo': 'circle highlight doodle',
			'círculo': 'circle highlight doodle',
			'fita': 'tape washi',
			'fitas': 'tape washi',
			'fogo': 'fire flame',
			'chamas': 'fire flame blaze',
			'brilho': 'sparkles stars glitter',
			'brilhos': 'sparkles stars',
			'coracao': 'heart love',
			'coração': 'heart love',
			'reacoes': 'emoji sticker',
			'reações': 'emoji sticker',
			'presente': 'gift box',
			'coroa': 'crown gold',
			'frete gratis': 'shipping truck delivery',
			'frete grátis': 'shipping delivery',
			'garantia': 'guarantee seal badge',
			'black friday': 'black friday sale',
			'novidade': 'new label banner'
		};

		if (dict[q]) return dict[q];
		for (const [k, v] of Object.entries(dict)) {
			if (q.includes(k)) return v;
		}
		return q.split(' ')[0] || 'arrow';
	}

	search(initialQuery = '') {
		var _this = this;
		const isEn = config.LANG === 'en';

		const txtTitle = isEn ? '🏹 Transparent Stickers, Arrows & Doodles' : '🏹 Adesivos, Setas & Doodles Transparentes (Stickers)';
		const txtPlaceholder = isEn ? '🔍 Search transparent stickers (e.g. arrow, sale badge, sparkles, fire, heart)...' : '🔍 Buscar adesivos transparentes (ex: seta, promoção, brilho, fogo, coração)...';
		const txtSearchBtn = isEn ? 'Search' : 'Buscar';
		const txtLoading = isEn ? 'Searching transparent stickers & doodles...' : 'Buscando adesivos e setas transparentes...';
		const txtLoadingMore = isEn ? 'Loading more stickers...' : 'Carregando mais adesivos...';
		const txtNoResults = isEn ? 'No stickers found for' : 'Nenhum adesivo encontrado para';
		const txtNoResultsHint = isEn ? 'Try another keyword or select a category above!' : 'Tente pesquisar outra palavra ou clique nas categorias rápidas acima!';
		const txtTipLeft = isEn ? '⚡ 100% Transparent PNG Stickers & Badges (Free Commercial Use).' : '⚡ 100% Fundo Transparente PNG / Adesivos & Selos (Uso Comercial Livre).';
		const txtTipRight = isEn ? 'Infinite Scroll • 1-Click Insert' : 'Rolagem Infinita • Inserção em 1 Clique';
		const txtUse = isEn ? '+ Use' : '+ Usar';

		var modalHtml = `
			<div style="text-align:left; width:100%; box-sizing:border-box;">
				<!-- Search Header -->
				<div style="display:flex; gap:8px; margin-bottom:10px; align-items:center; width:100%;">
					<div style="flex:1; position:relative;">
						<input type="text" id="sticker_search_input" placeholder="${txtPlaceholder}" value="${initialQuery}" style="width:100%; box-sizing:border-box; padding:9px 14px; font-size:13px; background:#0f172a; border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff;" />
					</div>
					<button type="button" id="btn_sticker_search_trigger" style="padding:9px 20px; background:#3b82f6; color:#ffffff; font-weight:700; font-size:13px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; flex-shrink:0;">
						${txtSearchBtn}
					</button>
				</div>

				<!-- Quick Tag Pills (Symmetric 2 Rows Grid) -->
				<div style="display:grid; grid-template-columns: repeat(8, 1fr); gap:6px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
					<button type="button" class="sticker_pill_btn active" data-q="arrow" style="padding:6px 2px; font-size:11px; font-weight:600; background:#3b82f6; color:#ffffff; border:none; border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">⚡ Setas</button>
					<button type="button" class="sticker_pill_btn" data-q="sale badge" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏷️ Selos Promo</button>
					<button type="button" class="sticker_pill_btn" data-q="fire flame" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🔥 Fogo / Chamas</button>
					<button type="button" class="sticker_pill_btn" data-q="sparkles stars" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">✨ Sparkles</button>
					<button type="button" class="sticker_pill_btn" data-q="heart love" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💖 Corações</button>
					<button type="button" class="sticker_pill_btn" data-q="crown gold" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">👑 Coroas</button>
					<button type="button" class="sticker_pill_btn" data-q="gift box" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🎁 Presentes</button>
					<button type="button" class="sticker_pill_btn" data-q="tape washi" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🩹 Fitas Tape</button>

					<button type="button" class="sticker_pill_btn" data-q="circle highlight" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">⭕ Círculos</button>
					<button type="button" class="sticker_pill_btn" data-q="guarantee seal" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🛡️ Garantia</button>
					<button type="button" class="sticker_pill_btn" data-q="discount off" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏷️ 50% OFF</button>
					<button type="button" class="sticker_pill_btn" data-q="delivery truck" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🚚 Frete Grátis</button>
					<button type="button" class="sticker_pill_btn" data-q="black friday" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🛍️ Black Friday</button>
					<button type="button" class="sticker_pill_btn" data-q="comic pop" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💥 Pop Art</button>
					<button type="button" class="sticker_pill_btn" data-q="new label" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🆕 Novidades</button>
					<button type="button" class="sticker_pill_btn" data-q="ribbon banner" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🎀 Faixas</button>
				</div>

				<!-- Stickers Grid with Smooth Infinite Scroll -->
				<div id="stickers_grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px; max-height:480px; overflow-y:auto; padding:4px; min-height:240px; scroll-behavior:smooth;">
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
			className: 'wide extra-wide sticker-gallery-popup',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				const grid = document.getElementById('stickers_grid');
				const input = document.getElementById('sticker_search_input');
				const btnSearch = document.getElementById('btn_sticker_search_trigger');
				const pillBtns = document.querySelectorAll('.sticker_pill_btn');

				let currentQuery = initialQuery || 'arrow';
				let currentPage = 1;
				let isLoadingMore = false;
				let hasMore = true;
				let renderedIds = new Set();

				function renderCardHtml(s) {
					return `
						<div class="sticker-card" data-url="${s.largeUrl || s.url}" data-title="${s.title || 'Sticker'}" style="position:relative; aspect-ratio:1/1; border-radius:8px; overflow:hidden; background:#1e293b; cursor:pointer; border:1px solid rgba(255,255,255,0.08); transition:all 0.18s ease; display:flex; align-items:center; justify-content:center; padding:8px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
							<img src="${s.thumbUrl || s.url}" alt="${s.title}" loading="lazy" style="max-width:90%; max-height:90%; object-fit:contain; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.4));" />
							<div class="sticker-overlay" style="position:absolute; inset:0; background:rgba(59,130,246,0.25); border:2px solid #3b82f6; border-radius:8px; opacity:0; transition:opacity 0.15s ease; display:flex; align-items:center; justify-content:center;">
								<span style="background:#3b82f6; color:#fff; font-size:10.5px; font-weight:bold; padding:3px 7px; border-radius:4px;">
									${txtUse}
								</span>
							</div>
						</div>
					`;
				}

				function bindCardEvents(container) {
					container.querySelectorAll('.sticker-card:not([data-bound="true"])').forEach(card => {
						card.setAttribute('data-bound', 'true');
						card.addEventListener('mouseenter', () => {
							const ov = card.querySelector('.sticker-overlay');
							if (ov) ov.style.opacity = '1';
							card.style.transform = 'translateY(-2px)';
						});
						card.addEventListener('mouseleave', () => {
							const ov = card.querySelector('.sticker-overlay');
							if (ov) ov.style.opacity = '0';
							card.style.transform = 'translateY(0)';
						});
						card.addEventListener('click', function() {
							const url = this.dataset.url;
							const title = this.dataset.title;
							_this.insert_sticker_into_project(url, title);
						});
					});
				}

				function loadStickers(q, page, isAppend) {
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
						spinner.id = 'sticker_loading_more';
						spinner.style.cssText = 'grid-column:1/-1; text-align:center; padding:16px; color:#38bdf8; font-size:12px; font-weight:600;';
						spinner.innerHTML = `⏳ ${txtLoadingMore}`;
						grid.appendChild(spinner);
					}

					const translatedQuery = _this.translate_pt_to_en(q);
					_this.fetch_pixabay_vectors(translatedQuery, page, function(stickers) {
						const spinner = document.getElementById('sticker_loading_more');
						if (spinner) spinner.remove();

						if (!stickers || stickers.length === 0) {
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

						if (stickers.length < _this.per_page) {
							hasMore = false;
						}

						const uniqueStickers = stickers.filter(s => !renderedIds.has(s.id));
						uniqueStickers.forEach(s => renderedIds.add(s.id));

						let html = uniqueStickers.map(s => renderCardHtml(s)).join('');

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
					currentQuery = q || 'arrow';
					currentPage = 1;
					isLoadingMore = false;
					hasMore = true;
					loadStickers(currentQuery, 1, false);
				}

				grid.addEventListener('scroll', () => {
					if (isLoadingMore || !hasMore) return;
					if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 160) {
						isLoadingMore = true;
						currentPage++;
						loadStickers(currentQuery, currentPage, true);
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

				loadStickers(currentQuery, 1, false);
			}
		};

		this.POP.show(settings);
	}

	fetch_pixabay_vectors(query, page, callback) {
		const _this = this;
		const cleanQ = encodeURIComponent(query || 'arrow');
		const key = '7141209-20aeb812fa33edf3fa8dc2ac3';
		const pageNum = page || 1;

		const URL = `https://pixabay.com/api/?key=${key}&page=${pageNum}&per_page=${this.per_page}&safesearch=true&image_type=vector&q=${cleanQ}`;

		if (this.cache[URL]) {
			callback(this.cache[URL]);
			return;
		}

		fetch(URL)
			.then(res => res.json())
			.then(data => {
				if (data && data.hits && data.hits.length > 0) {
					const formatted = data.hits.map(item => ({
						id: item.id,
						title: item.tags.split(',')[0] || 'Adesivo',
						thumbUrl: item.webformatURL,
						largeUrl: item.largeImageURL || item.webformatURL,
						width: item.imageWidth,
						height: item.imageHeight
					}));
					_this.cache[URL] = formatted;
					callback(formatted);
				} else {
					callback([]);
				}
			})
			.catch(err => {
				console.error('Vector Stickers error:', err);
				callback([]);
			});
	}

	async insert_sticker_into_project(url, title) {
		this.POP.hide();
		alertify.message(`⏳ Baixando adesivo transparente...`);

		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = async function() {
			const imgW = img.naturalWidth || img.width;
			const imgH = img.naturalHeight || img.height;

			let targetW = 280;
			let targetH = Math.round(targetW * (imgH / imgW));

			const maxAllowed = Math.min(config.WIDTH, config.HEIGHT) * 0.5;
			if (targetW > maxAllowed) {
				const ratio = maxAllowed / targetW;
				targetW = Math.round(targetW * ratio);
				targetH = Math.round(targetH * ratio);
			}

			const posX = Math.round((config.WIDTH - targetW) / 2);
			const posY = Math.round((config.HEIGHT - targetH) / 2);

			const new_layer = {
				name: title || 'Adesivo Sticker',
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

			if (app.GUI && app.GUI.GUI_preview && typeof app.GUI.GUI_preview.zoom_auto === 'function') {
				app.GUI.GUI_preview.zoom_auto();
			}

			alertify.success(`🎉 Adesivo inserido com sucesso!`);
		};

		img.onerror = function() {
			alertify.error('Erro ao inserir adesivo.');
		};

		img.src = url;
	}

}

export default Stickers_class;
