import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Dialog_class from './../libs/popup.js';
import alertify from './../../../node_modules/alertifyjs/build/alertify.min.js';

var instance = null;

class Illustrations_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.POP = new Dialog_class();
		this.name = 'illustrations';
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
			'negocios': 'business work office team',
			'negócios': 'business work office team',
			'trabalho': 'work office employee business',
			'escritorio': 'office work desk corporate',
			'escritório': 'office work desk corporate',
			'startup': 'startup technology coding developer',
			'tecnologia': 'technology coding software computer',
			'programacao': 'coding programming developer software',
			'programação': 'coding programming developer software',
			'vendas': 'shopping ecommerce retail commerce store',
			'loja': 'store shopping retail ecommerce',
			'saude': 'medical health doctor hospital clinic',
			'saúde': 'medical health doctor hospital clinic',
			'medico': 'doctor medical health patient nurse',
			'médico': 'doctor medical health patient nurse',
			'educacao': 'education study student school university',
			'educação': 'education study student school university',
			'estudos': 'study education student reading learning',
			'escola': 'school education student classroom teacher',
			'marketing': 'marketing social media analytics growth',
			'redes sociais': 'social media smartphone digital communication',
			'ia': 'artificial intelligence robot futuristic tech',
			'inteligencia artificial': 'artificial intelligence robot future ai tech',
			'inteligência artificial': 'artificial intelligence robot future ai tech',
			'financas': 'finance investment crypto money economy',
			'finanças': 'finance investment crypto money economy',
			'dinheiro': 'money currency cash dollar wealth',
			'fitness': 'fitness gym workout exercise training health',
			'academia': 'gym fitness workout training bodybuilding',
			'esporte': 'sports athletics running player game',
			'viagem': 'travel vacation tourism tourist airport suitcase',
			'turismo': 'tourism travel vacation holiday sightseeing',
			'comida': 'food cooking chef restaurant culinary cuisine',
			'culinaria': 'culinary food cooking chef kitchen dish',
			'culinária': 'culinary food cooking chef kitchen dish',
			'restaurante': 'restaurant food chef waiter dining',
			'natureza': 'nature landscape ecology trees forest',
			'ecologia': 'ecology environment green planet sustainability',
			'abstrato 3d': 'abstract 3d render geometric artwork',
			'arte 3d': '3d render art abstract modern sculpture',
			'yoga': 'yoga meditation wellness relax mindfulness',
			'meditacao': 'meditation mindfulness zen wellness peaceful',
			'meditação': 'meditation mindfulness zen wellness peaceful',
			'familia': 'family home love parents children lifestyle',
			'família': 'family home love parents children lifestyle',
			'casa': 'home house interior living building',
			'personagens': 'character cartoon people avatar creative',
			'criatividade': 'creativity creative design artist idea brainstorming'
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

		const txtTitle = isEn ? '🎨 Vector & 3D Conceptual Illustrations' : '🎨 Ilustrações Vetoriais & Arte Conceitual (Flat & 3D)';
		const txtPlaceholder = isEn ? '🔍 Search illustrations (e.g. business, startup, medical, marketing, 3d art)...' : '🔍 Buscar ilustrações (ex: negócios, startup, saúde, marketing, arte 3D)...';
		const txtSearchBtn = isEn ? 'Search' : 'Buscar';
		const txtLoading = isEn ? 'Searching artistic illustrations...' : 'Buscando ilustrações e arte vetorial...';
		const txtLoadingMore = isEn ? 'Loading more illustrations...' : 'Carregando mais ilustrações...';
		const txtNoResults = isEn ? 'No illustrations found for' : 'Nenhuma ilustração encontrada para';
		const txtNoResultsHint = isEn ? 'Try another keyword or select a category above!' : 'Tente pesquisar outra palavra ou selecione uma categoria acima!';
		const txtTipLeft = isEn ? '⚡ 100% Free & Royalty-Free Professional Illustrations (Pixabay Illustrations).' : '⚡ 100% Gratuito & Livre para Uso Comercial (Pixabay Illustrations).';
		const txtTipRight = isEn ? 'Infinite Scroll • 1-Click Insert' : 'Rolagem Infinita • Inserção em 1 Clique';
		const txtUse = isEn ? '+ Use' : '+ Usar';

		var modalHtml = `
			<div style="text-align:left; width:100%; box-sizing:border-box;">
				<!-- Search Header -->
				<div style="display:flex; gap:8px; margin-bottom:10px; align-items:center; width:100%;">
					<div style="flex:1; position:relative;">
						<input type="text" id="illust_search_input" placeholder="${txtPlaceholder}" value="${initialQuery}" style="width:100%; box-sizing:border-box; padding:9px 14px; font-size:13px; background:#0f172a; border:1px solid rgba(255,255,255,0.2); border-radius:6px; color:#fff;" />
					</div>
					<button type="button" id="btn_illust_search_trigger" style="padding:9px 20px; background:#3b82f6; color:#ffffff; font-weight:700; font-size:13px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; flex-shrink:0;">
						${txtSearchBtn}
					</button>
				</div>

				<!-- Quick Tag Pills (Symmetric 2 Rows Grid) -->
				<div style="display:grid; grid-template-columns: repeat(8, 1fr); gap:6px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
					<button type="button" class="illust_pill_btn active" data-q="business work office" style="padding:6px 2px; font-size:11px; font-weight:600; background:#3b82f6; color:#ffffff; border:none; border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💼 Negócios</button>
					<button type="button" class="illust_pill_btn" data-q="startup technology coding" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🚀 Startup & Tech</button>
					<button type="button" class="illust_pill_btn" data-q="shopping ecommerce sales" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🛒 Vendas / Loja</button>
					<button type="button" class="illust_pill_btn" data-q="medical health doctor" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🩺 Saúde & Med</button>
					<button type="button" class="illust_pill_btn" data-q="education study student" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🎓 Educação</button>
					<button type="button" class="illust_pill_btn" data-q="marketing social media" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📱 Marketing</button>
					<button type="button" class="illust_pill_btn" data-q="artificial intelligence robot future" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🤖 IA & Futuro</button>
					<button type="button" class="illust_pill_btn" data-q="finance crypto money investment" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">💰 Finanças</button>

					<button type="button" class="illust_pill_btn" data-q="fitness sport workout" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🚴 Fitness</button>
					<button type="button" class="illust_pill_btn" data-q="travel tourism vacation" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">✈️ Viagem</button>
					<button type="button" class="illust_pill_btn" data-q="food cooking chef restaurant" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🍔 Culinária</button>
					<button type="button" class="illust_pill_btn" data-q="nature ecology environment" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌿 Natureza</button>
					<button type="button" class="illust_pill_btn" data-q="abstract 3d render modern art" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🌀 Arte 3D</button>
					<button type="button" class="illust_pill_btn" data-q="yoga meditation wellness" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🧘 Bem-Estar</button>
					<button type="button" class="illust_pill_btn" data-q="family home lifestyle" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🏠 Família</button>
					<button type="button" class="illust_pill_btn" data-q="character creative design" style="padding:6px 2px; font-size:11px; font-weight:600; background:#1e293b; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); border-radius:15px; cursor:pointer; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">🎨 Criatividade</button>
				</div>

				<!-- Illustrations Grid with Smooth Infinite Scroll -->
				<div id="illust_grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap:12px; max-height:480px; overflow-y:auto; padding:4px; min-height:240px; scroll-behavior:smooth;">
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
			className: 'wide extra-wide illustration-gallery-popup',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				const grid = document.getElementById('illust_grid');
				const input = document.getElementById('illust_search_input');
				const btnSearch = document.getElementById('btn_illust_search_trigger');
				const pillBtns = document.querySelectorAll('.illust_pill_btn');

				let currentQuery = initialQuery || 'business work office';
				let currentPage = 1;
				let isLoadingMore = false;
				let hasMore = true;
				let renderedIds = new Set();

				function renderCardHtml(p) {
					return `
						<div class="illust-card" data-url="${p.largeUrl || p.url}" data-title="${p.title || 'Ilustração'}" style="position:relative; aspect-ratio:4/3; border-radius:8px; overflow:hidden; background:#0f172a; cursor:pointer; border:1px solid rgba(255,255,255,0.08); transition:all 0.2s ease; box-shadow:0 2px 8px rgba(0,0,0,0.25);">
							<img src="${p.thumbUrl || p.url}" alt="${p.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover; display:block;" />
							<div class="illust-overlay" style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%); opacity:0; transition:opacity 0.2s ease; display:flex; flex-direction:column; justify-content:space-between; padding:8px;">
								<span style="align-self:flex-end; font-size:9.5px; background:rgba(0,0,0,0.7); color:#a855f7; padding:1px 6px; border-radius:3px; border:1px solid #a855f7; font-weight:bold;">
									Arte Vetorial
								</span>
								<div style="display:flex; align-items:center; justify-content:space-between;">
									<span style="font-size:11px; color:#fff; font-weight:700; text-shadow:0 1px 3px rgba(0,0,0,0.8); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:120px;">
										${p.title || 'Ilustração'}
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
					container.querySelectorAll('.illust-card:not([data-bound="true"])').forEach(card => {
						card.setAttribute('data-bound', 'true');
						card.addEventListener('mouseenter', () => {
							const ov = card.querySelector('.illust-overlay');
							if (ov) ov.style.opacity = '1';
							card.style.transform = 'scale(1.02)';
							card.style.borderColor = '#3b82f6';
						});
						card.addEventListener('mouseleave', () => {
							const ov = card.querySelector('.illust-overlay');
							if (ov) ov.style.opacity = '0';
							card.style.transform = 'scale(1)';
							card.style.borderColor = 'rgba(255,255,255,0.08)';
						});
						card.addEventListener('click', function() {
							const url = this.dataset.url;
							const title = this.dataset.title;
							_this.insert_illustration_into_project(url, title);
						});
					});
				}

				function loadIllustrations(q, page, isAppend) {
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
						spinner.id = 'illust_loading_more';
						spinner.style.cssText = 'grid-column:1/-1; text-align:center; padding:16px; color:#a855f7; font-size:12px; font-weight:600;';
						spinner.innerHTML = `⏳ ${txtLoadingMore}`;
						grid.appendChild(spinner);
					}

					const translatedQuery = _this.translate_pt_to_en(q);
					_this.fetch_illustrations(translatedQuery, page, function(items) {
						const spinner = document.getElementById('illust_loading_more');
						if (spinner) spinner.remove();

						if (!items || items.length === 0) {
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

						if (items.length < _this.per_page) {
							hasMore = false;
						}

						const uniqueItems = items.filter(p => !renderedIds.has(p.id));
						uniqueItems.forEach(p => renderedIds.add(p.id));

						let html = uniqueItems.map(p => renderCardHtml(p)).join('');

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
					currentQuery = q || 'business work office';
					currentPage = 1;
					isLoadingMore = false;
					hasMore = true;
					loadIllustrations(currentQuery, 1, false);
				}

				grid.addEventListener('scroll', () => {
					if (isLoadingMore || !hasMore) return;
					if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 180) {
						isLoadingMore = true;
						currentPage++;
						loadIllustrations(currentQuery, currentPage, true);
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

				loadIllustrations(currentQuery, 1, false);
			}
		};

		this.POP.show(settings);
	}

	fetch_illustrations(query, page, callback) {
		const _this = this;
		const cleanQ = encodeURIComponent(query);
		const key = '7141209-20aeb812fa33edf3fa8dc2ac3';
		const pageNum = page || 1;

		const URL = `https://pixabay.com/api/?key=${key}&page=${pageNum}&per_page=${this.per_page}&safesearch=true&image_type=illustration&q=${cleanQ}`;

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
						title: h.tags.split(',')[0] || 'Ilustração',
						author: h.user,
						thumbUrl: h.webformatURL,
						largeUrl: h.largeImageURL || h.webformatURL,
						width: h.imageWidth,
						height: h.imageHeight
					}));
					_this.cache[URL] = formatted;
					callback(formatted);
				} else {
					callback([]);
				}
			})
			.catch(err => {
				console.warn('Illustrations API error:', err);
				callback([]);
			});
	}

	async insert_illustration_into_project(url, title) {
		this.POP.hide();
		alertify.message(`⏳ Baixando ilustração...`);

		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = async function() {
			const imgW = img.naturalWidth || img.width;
			const imgH = img.naturalHeight || img.height;

			let targetW = Math.round(config.WIDTH * 0.75);
			let targetH = Math.round(targetW * (imgH / imgW));

			const maxH = Math.round(config.HEIGHT * 0.75);
			if (targetH > maxH) {
				const ratio = maxH / targetH;
				targetW = Math.round(targetW * ratio);
				targetH = Math.round(targetH * ratio);
			}

			const posX = Math.round((config.WIDTH - targetW) / 2);
			const posY = Math.round((config.HEIGHT - targetH) / 2);

			const new_layer = {
				name: title || 'Ilustração Artística',
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

			alertify.success(`🎉 Ilustração "${title || 'Arte'}" inserida com sucesso!`);
		};

		img.onerror = function() {
			alertify.error('Erro ao baixar ilustração.');
		};

		img.src = url;
	}

}

export default Illustrations_class;
