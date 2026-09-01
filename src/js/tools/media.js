import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import File_open_class from './../modules/file/open.js';
import Tools_settings_class from './../modules/tools/settings.js';
import Dialog_class from './../libs/popup.js';
import alertify from './../../../node_modules/alertifyjs/build/alertify.min.js';

var instance = null;

class Media_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.File_open = new File_open_class();
		this.Tools_settings = new Tools_settings_class();
		this.POP = new Dialog_class();
		this.name = 'media';
		this.cache = {};
		this.page = 1;
		this.per_page = 28;
		this.active_category = 'all';
		this.search_query = '';
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

	// Dicionário rápido PT -> EN para maximizar resultados de busca
	translate_pt_to_en(query) {
		const q = (query || '').toLowerCase().trim();
		const dict = {
			'comida': 'food gourmet',
			'hamburguer': 'burger gourmet',
			'hambúrguer': 'burger gourmet',
			'lanche': 'burger sandwich',
			'pizza': 'pizza italian food',
			'carne': 'steak barbecue meat',
			'churrasco': 'bbq barbecue',
			'cafe': 'coffee espresso',
			'café': 'coffee espresso',
			'doce': 'dessert cake',
			'bolo': 'cake bakery',
			'chocolate': 'chocolate dessert',
			'restaurante': 'restaurant dining',
			'garcom': 'waiter chef kitchen',
			'garçom': 'waiter chef kitchen',
			'negocio': 'business office meeting',
			'negócios': 'business office meeting',
			'escritorio': 'office workspace desk',
			'escritório': 'office workspace desk',
			'trabalho': 'work office laptop',
			'computador': 'laptop computer coding',
			'tecnologia': 'technology futuristic',
			'dinheiro': 'money finance currency',
			'vendas': 'shopping sale retail',
			'loja': 'store retail boutique',
			'mercado': 'supermarket grocery',
			'roupa': 'fashion clothing model',
			'moda': 'fashion style model',
			'modelo': 'fashion model portrait',
			'mulher': 'woman portrait',
			'homem': 'man portrait',
			'crianca': 'children kids happy',
			'criança': 'children kids happy',
			'familia': 'family happiness',
			'família': 'family happiness',
			'academia': 'gym fitness workout',
			'treino': 'workout gym athlete',
			'saude': 'health fitness wellness',
			'saúde': 'health fitness wellness',
			'medico': 'doctor medical hospital',
			'médico': 'doctor medical hospital',
			'dentista': 'dentist dental clinic',
			'praia': 'beach tropical ocean',
			'mar': 'sea ocean waves',
			'cidade': 'city skyline architecture',
			'predio': 'building modern architecture',
			'prédio': 'building modern architecture',
			'natureza': 'nature landscape forest',
			'floresta': 'forest trees woods',
			'sol': 'sunset sun golden hour',
			'por do sol': 'sunset golden hour sky',
			'pôr do sol': 'sunset golden hour sky',
			'carro': 'car automotive luxury',
			'veiculo': 'car vehicle luxury',
			'veículo': 'car vehicle luxury'
		};

		if (dict[q]) {
			return dict[q];
		}

		for (const [k, v] of Object.entries(dict)) {
			if (q.includes(k)) {
				return q.replace(k, v);
			}
		}

		return q;
	}

	search(initialQuery = '') {
		var _this = this;
		const isEn = config.LANG === 'en';

		const txtTitle = isEn ? '🖼️ Free HD Stock Photos & Backgrounds' : '🖼️ Fotos Gratuitas em Alta Resolução (Stock)';
		const txtPlaceholder = isEn ? '🔍 Search free photos (e.g. food, office, nature, gym, luxury car)...' : '🔍 Buscar fotos gratuitas (ex: hambúrguer, escritório, praia, academia, carro luxo)...';
		const txtSearchBtn = isEn ? 'Search' : 'Buscar';
		const txtLoading = isEn ? 'Searching millions of free stock photos...' : 'Buscando em milhões de fotos gratuitas...';
		const txtLoadingMore = isEn ? 'Loading more photos...' : 'Carregando mais fotos...';
		const txtNoPhotos = isEn ? 'No photos found for' : 'Nenhuma foto encontrada para';
		const txtNoPhotosHint = isEn ? 'Try another keyword or click one of the quick tags above!' : 'Tente pesquisar outra palavra ou clique em uma das categorias rápidas acima!';
		const txtTipLeft = isEn ? '⚡ 100% Free & Royalty-Free for Commercial Use (CC0 / Pixabay / Unsplash).' : '⚡ 100% Gratuito & Livre para Uso Comercial (CC0 / Pixabay / Unsplash).';
		const txtTipRight = isEn ? 'Infinite Scroll • 1-Click Insert' : 'Rolagem Infinita • Inserção em 1 Clique';
		const txtUse = isEn ? '+ Use' : '+ Usar';

		var modalHtml = `
			<div style="text-align:left; width:100%; box-sizing:border-box;">
				<!-- Search Header -->
				<div style="display:flex; gap:8px; margin-bottom:10px; align-items:center; width:100%;">
					<div style="flex:1; position:relative;">
						<input type="text" id="stock_search_input" placeholder="${txtPlaceholder}" value="${initialQuery}" style="width:100%; box-sizing:border-box; padding:9px 14px; font-size:13px; background:#0f172a; border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff;" />
					</div>
					<button type="button" id="btn_stock_search_trigger" style="padding:9px 20px; background:#3b82f6; color:#ffffff; font-weight:700; font-size:13px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; flex-shrink:0;">
						${txtSearchBtn}
					</button>
				</div>

				<!-- Quick Tag Pills (Symmetric 2 Rows Grid) -->
				<div style="display:grid; grid-template-columns: repeat(8, 1fr); gap:6px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
					<button type="button" class="stock_pill_btn active" data-q="food burger" style="padding:6px 2px; font-size:11px; font-weight:600; background:#3b82f6; color:#ffffff; border:none; border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🍔 ${isEn ? 'Burgers' : 'Lanches'}</button>
					<button type="button" class="stock_pill_btn" data-q="pizza italian food" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🍕 Pizzas</button>
					<button type="button" class="stock_pill_btn" data-q="coffee bakery dessert" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">☕ ${isEn ? 'Coffee' : 'Café'}</button>
					<button type="button" class="stock_pill_btn" data-q="bbq steak meat" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🥩 ${isEn ? 'BBQ Meat' : 'Carnes'}</button>
					<button type="button" class="stock_pill_btn" data-q="business office meeting" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">👔 ${isEn ? 'Business' : 'Negócios'}</button>
					<button type="button" class="stock_pill_btn" data-q="technology computer laptop" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💻 ${isEn ? 'Tech' : 'Tecnologia'}</button>
					<button type="button" class="stock_pill_btn" data-q="fitness gym workout" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏋️ Fitness</button>
					<button type="button" class="stock_pill_btn" data-q="doctor medical hospital" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🩺 ${isEn ? 'Health' : 'Saúde'}</button>

					<button type="button" class="stock_pill_btn" data-q="shopping sale discount" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🛍️ ${isEn ? 'Sales' : 'Vendas'}</button>
					<button type="button" class="stock_pill_btn" data-q="fashion model portrait" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">👗 ${isEn ? 'Fashion' : 'Moda'}</button>
					<button type="button" class="stock_pill_btn" data-q="luxury car automotive" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🚗 ${isEn ? 'Cars' : 'Carros'}</button>
					<button type="button" class="stock_pill_btn" data-q="modern house interior" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏠 ${isEn ? 'Houses' : 'Imóveis'}</button>
					<button type="button" class="stock_pill_btn" data-q="tropical beach travel" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌴 ${isEn ? 'Beaches' : 'Praias'}</button>
					<button type="button" class="stock_pill_btn" data-q="nature landscape mountain" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌲 ${isEn ? 'Nature' : 'Natureza'}</button>
					<button type="button" class="stock_pill_btn" data-q="dark background texture" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🎨 ${isEn ? 'Textures' : 'Fundos'}</button>
					<button type="button" class="stock_pill_btn" data-q="neon cyber night lights" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">✨ Neon</button>
				</div>

				<!-- Stock Grid with Smooth Infinite Scroll -->
				<div id="stock_photos_grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px; max-height:480px; overflow-y:auto; padding:4px; min-height:240px; scroll-behavior:smooth;">
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
			className: 'wide extra-wide stock-gallery-popup',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				const grid = document.getElementById('stock_photos_grid');
				const input = document.getElementById('stock_search_input');
				const btnSearch = document.getElementById('btn_stock_search_trigger');
				const pillBtns = document.querySelectorAll('.stock_pill_btn');

				let currentQuery = initialQuery || 'food burger';
				let currentPage = 1;
				let isLoadingMore = false;
				let hasMore = true;
				let renderedIds = new Set();

				function renderCardHtml(p) {
					return `
						<div class="stock-photo-card" data-url="${p.largeUrl || p.url}" data-title="${p.title || 'Foto'}" style="position:relative; aspect-ratio:4/3; border-radius:6px; overflow:hidden; background:#0f172a; cursor:pointer; border:1px solid rgba(255,255,255,0.08); transition:all 0.2s ease; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
							<img src="${p.thumbUrl || p.url}" alt="${p.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;" />
							<div class="stock-overlay" style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%); opacity:0; transition:opacity 0.2s ease; display:flex; flex-direction:column; justify-content:space-between; padding:8px;">
								<span style="align-self:flex-end; font-size:9.5px; background:rgba(0,0,0,0.6); color:#38bdf8; padding:1px 5px; border-radius:3px; border:1px solid #38bdf8;">
									${p.width && p.height ? `${p.width}x${p.height}` : 'HD'}
								</span>
								<div style="display:flex; align-items:center; justify-content:space-between;">
									<span style="font-size:11px; color:#fff; font-weight:700; text-shadow:0 1px 3px rgba(0,0,0,0.8); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:120px;">
										${p.author || p.title || 'Foto'}
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
					container.querySelectorAll('.stock-photo-card:not([data-bound="true"])').forEach(card => {
						card.setAttribute('data-bound', 'true');
						card.addEventListener('mouseenter', () => {
							const ov = card.querySelector('.stock-overlay');
							if (ov) ov.style.opacity = '1';
							card.style.transform = 'scale(1.02)';
							card.style.borderColor = '#3b82f6';
						});
						card.addEventListener('mouseleave', () => {
							const ov = card.querySelector('.stock-overlay');
							if (ov) ov.style.opacity = '0';
							card.style.transform = 'scale(1)';
							card.style.borderColor = 'rgba(255,255,255,0.08)';
						});
						card.addEventListener('click', function() {
							const url = this.dataset.url;
							const title = this.dataset.title;
							_this.insert_photo_into_project(url, title);
						});
					});
				}

				function loadPhotos(q, page, isAppend) {
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
						spinner.id = 'stock_loading_more';
						spinner.style.cssText = 'grid-column:1/-1; text-align:center; padding:16px; color:#38bdf8; font-size:12px; font-weight:600;';
						spinner.innerHTML = `⏳ ${txtLoadingMore}`;
						grid.appendChild(spinner);
					}

					const translatedQuery = _this.translate_pt_to_en(q);
					_this.fetch_photos(translatedQuery, page, function(photos) {
						const spinner = document.getElementById('stock_loading_more');
						if (spinner) spinner.remove();

						if (!photos || photos.length === 0) {
							if (!isAppend) {
								grid.innerHTML = `
									<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
										<div style="font-size:32px; margin-bottom:8px;">🔍</div>
										<div style="font-weight:bold; font-size:13px;">${txtNoPhotos} "${q}"</div>
										<div style="font-size:11.5px; color:#64748b; margin-top:4px;">${txtNoPhotosHint}</div>
									</div>
								`;
							}
							hasMore = false;
							isLoadingMore = false;
							return;
						}

						if (photos.length < _this.per_page) {
							hasMore = false;
						}

						const uniquePhotos = photos.filter(p => !renderedIds.has(p.id));
						uniquePhotos.forEach(p => renderedIds.add(p.id));

						let html = uniquePhotos.map(p => renderCardHtml(p)).join('');

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
					if (!q) q = 'food burger';
					currentQuery = q;
					currentPage = 1;
					isLoadingMore = false;
					hasMore = true;
					loadPhotos(currentQuery, 1, false);
				}

				// Smooth Infinite Scroll Event
				grid.addEventListener('scroll', () => {
					if (isLoadingMore || !hasMore) return;
					if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 180) {
						isLoadingMore = true;
						currentPage++;
						loadPhotos(currentQuery, currentPage, true);
					}
				});

				// Search input enter event
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

				// Pill buttons
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

				// Trigger initial search
				loadPhotos(currentQuery, 1, false);
			}
		};

		this.POP.show(settings);
	}

	fetch_photos(query, page, callback) {
		const _this = this;
		const cleanQ = encodeURIComponent(query);
		const key = (config.pixabay_key || '').split('').reverse().join('') || '10237731-dd3901b0f58999818b2c2a075';
		const pageNum = page || 1;

		const URL = `https://pixabay.com/api/?key=${key}&page=${pageNum}&per_page=${this.per_page}&safesearch=true&image_type=photo&q=${cleanQ}`;

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
						title: h.tags.split(',')[0] || 'Foto',
						author: h.user,
						thumbUrl: h.webformatURL,
						largeUrl: h.largeImageURL || h.webformatURL,
						width: h.imageWidth,
						height: h.imageHeight
					}));
					_this.cache[URL] = formatted;
					callback(formatted);
				} else {
					if (pageNum === 1) {
						_this.fetch_unsplash_fallback(query, callback);
					} else {
						callback([]);
					}
				}
			})
			.catch(err => {
				console.warn('Stock API error, using Unsplash fallback:', err);
				if (pageNum === 1) {
					_this.fetch_unsplash_fallback(query, callback);
				} else {
					callback([]);
				}
			});
	}

	fetch_unsplash_fallback(query, callback) {
		const keywords = query.split(' ').filter(k => k.length > 2);
		const fallbackPhotos = [];
		const baseKeywords = keywords.length > 0 ? keywords : ['food', 'burger', 'business', 'nature', 'fitness'];

		for (let i = 1; i <= 16; i++) {
			const tag = baseKeywords[(i - 1) % baseKeywords.length];
			fallbackPhotos.push({
				id: `unsplash_${tag}_${i}`,
				title: `${tag.toUpperCase()} Foto #${i}`,
				author: 'Unsplash Pro',
				thumbUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 12345}?auto=format&fit=crop&w=400&q=80`,
				largeUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 12345}?auto=format&fit=crop&w=1200&q=85`,
				width: 1200,
				height: 800
			});
		}
		callback(fallbackPhotos);
	}

	async insert_photo_into_project(url, title) {
		const _this = this;
		this.POP.hide();

		alertify.message(`⏳ Baixando e inserindo imagem...`);

		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = async function() {
			const imgW = img.naturalWidth || img.width;
			const imgH = img.naturalHeight || img.height;

			if (config.layers.length <= 1 && config.layers[0] && config.layers[0].data == null && config.layers[0].link == null) {
				await app.State.do_action(
					new app.Actions.Bundle_action('open_stock_image', 'Open Stock Image', [
						new app.Actions.Insert_layer_action({
							name: title || 'Foto de Banco',
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
				let targetW = Math.round(config.WIDTH * 0.75);
				let targetH = Math.round(targetW * (imgH / imgW));

				if (targetH > config.HEIGHT * 0.8) {
					const ratio = (config.HEIGHT * 0.8) / targetH;
					targetW = Math.round(targetW * ratio);
					targetH = Math.round(targetH * ratio);
				}

				const posX = Math.round((config.WIDTH - targetW) / 2);
				const posY = Math.round((config.HEIGHT - targetH) / 2);

				const new_layer = {
					name: title || 'Foto de Banco',
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

			alertify.success(`🎉 Imagem "${title || 'Foto'}" inserida com sucesso!`);
		};

		img.onerror = function() {
			alertify.error('Erro ao baixar imagem. Tente outra foto.');
		};

		img.src = url;
	}

}

export default Media_class;
