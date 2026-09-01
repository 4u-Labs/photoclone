import app from './../../app.js';
import config from './../../config.js';
import Base_layers_class from './../../core/base-layers.js';
import Base_gui_class from './../../core/base-gui.js';
import Dialog_class from './../../libs/popup.js';
import Helper_class from './../../libs/helpers.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';
import filesaver from './../../../../node_modules/file-saver/dist/FileSaver.min.js';

var instance = null;

class File_recent_projects_class {

	constructor() {
		if (instance) {
			return instance;
		}
		instance = this;

		this.Base_layers = new Base_layers_class();
		this.Base_gui = new Base_gui_class();
		this.POP = new Dialog_class();
		this.Helper = new Helper_class();

		this.dbName = 'PhotoClone_Projects_DB';
		this.dbVersion = 1;
		this.storeName = 'projects';
		this.db = null;

		this.currentProjectId = null;
		this.lastSavedJsonHash = '';
		this.autoSaveTimer = null;
		this.isAutoSaving = false;
		this.searchQuery = '';

		this.init_db();
		this.init_auto_save();
	}

	async init_db() {
		return new Promise((resolve, reject) => {
			if (this.db) {
				resolve(this.db);
				return;
			}
			if (!window.indexedDB) {
				console.warn('IndexedDB not supported on this browser.');
				resolve(null);
				return;
			}

			const request = window.indexedDB.open(this.dbName, this.dbVersion);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
					store.createIndex('updated_at', 'updated_at', { unique: false });
				}
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
				resolve(this.db);
				this.check_and_prompt_recovery();
			};

			request.onerror = (event) => {
				console.error('IndexedDB open error:', event.target.error);
				resolve(null);
			};
		});
	}

	init_auto_save() {
		// Periodically auto-save every 4 seconds if changes are detected
		setInterval(() => {
			this.trigger_auto_save();
		}, 4000);
	}

	async trigger_auto_save() {
		if (this.isAutoSaving) return;
		if (!config.layers || config.layers.length === 0) return;

		// Check if canvas has actual content (not just a 0x0 empty state)
		const hasContent = config.layers.some(l => (l.width > 0 && l.height > 0) || l.data != null || l.link != null);
		if (!hasContent) return;

		if (!app.FileSave || typeof app.FileSave.export_as_json !== 'function') return;

		try {
			const currentJson = app.FileSave.export_as_json();
			if (!currentJson || currentJson === this.lastSavedJsonHash) {
				return; // No changes since last save
			}

			this.isAutoSaving = true;
			await this.save_project_record(currentJson);
			this.lastSavedJsonHash = currentJson;
		} catch (err) {
			console.warn('Auto-save error:', err);
		} finally {
			this.isAutoSaving = false;
		}
	}

	generate_thumbnail() {
		try {
			const thumbCanvas = document.createElement('canvas');
			const maxDim = 220;
			let w = config.WIDTH || 800;
			let h = config.HEIGHT || 600;

			if (w > h) {
				thumbCanvas.width = maxDim;
				thumbCanvas.height = Math.max(20, Math.round((h / w) * maxDim));
			} else {
				thumbCanvas.height = maxDim;
				thumbCanvas.width = Math.max(20, Math.round((w / h) * maxDim));
			}

			const ctx = thumbCanvas.getContext('2d');
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'medium';

			this.Base_layers.convert_layers_to_canvas(ctx, null, false);
			return thumbCanvas.toDataURL('image/jpeg', 0.75);
		} catch (e) {
			return '';
		}
	}

	get_project_title() {
		if (app.GUI && app.GUI.GUI_tabs && app.GUI.GUI_tabs.active_tab) {
			const tabTitle = app.GUI.GUI_tabs.active_tab.name;
			if (tabTitle && !tabTitle.includes('untitled') && !tabTitle.includes('Sem título')) {
				return tabTitle;
			}
		}
		if (config.layers && config.layers[0] && config.layers[0].name) {
			return config.layers[0].name.replace(/\.[^/.]+$/, "");
		}
		return `Projeto ${config.WIDTH}x${config.HEIGHT}`;
	}

	async save_project_record(jsonString) {
		const db = await this.init_db();
		if (!db) return;

		if (!this.currentProjectId) {
			this.currentProjectId = 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
		}

		const title = this.get_project_title();
		const thumbnail = this.generate_thumbnail();
		const now = Date.now();

		const projectData = {
			id: this.currentProjectId,
			title: title,
			width: config.WIDTH,
			height: config.HEIGHT,
			layers_count: config.layers.length,
			thumbnail: thumbnail,
			json: jsonString,
			updated_at: now,
			created_at: now
		};

		return new Promise((resolve) => {
			const tx = db.transaction([this.storeName], 'readwrite');
			const store = tx.objectStore(this.storeName);

			// Check if project already exists to keep its created_at
			const getReq = store.get(this.currentProjectId);
			getReq.onsuccess = () => {
				if (getReq.result && getReq.result.created_at) {
					projectData.created_at = getReq.result.created_at;
				}
				store.put(projectData);
			};

			tx.oncomplete = () => {
				this.prune_old_projects();
				resolve(projectData);
			};

			tx.onerror = () => resolve(null);
		});
	}

	async prune_old_projects() {
		const db = await this.init_db();
		if (!db) return;

		const maxProjects = 25;
		const all = await this.get_all_projects();
		if (all.length > maxProjects) {
			const toRemove = all.slice(maxProjects);
			const tx = db.transaction([this.storeName], 'readwrite');
			const store = tx.objectStore(this.storeName);
			toRemove.forEach(p => store.delete(p.id));
		}
	}

	async get_all_projects() {
		const db = await this.init_db();
		if (!db) return [];

		return new Promise((resolve) => {
			const tx = db.transaction([this.storeName], 'readonly');
			const store = tx.objectStore(this.storeName);
			const req = store.getAll();

			req.onsuccess = () => {
				const list = req.result || [];
				list.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
				resolve(list);
			};

			req.onerror = () => resolve([]);
		});
	}

	async delete_project(id) {
		const db = await this.init_db();
		if (!db) return;

		return new Promise((resolve) => {
			const tx = db.transaction([this.storeName], 'readwrite');
			const store = tx.objectStore(this.storeName);
			store.delete(id);
			tx.oncomplete = () => {
				if (this.currentProjectId === id) {
					this.currentProjectId = null;
				}
				resolve(true);
			};
			tx.onerror = () => resolve(false);
		});
	}

	async clear_all_projects() {
		const db = await this.init_db();
		if (!db) return;

		return new Promise((resolve) => {
			const tx = db.transaction([this.storeName], 'readwrite');
			const store = tx.objectStore(this.storeName);
			store.clear();
			tx.oncomplete = () => {
				this.currentProjectId = null;
				resolve(true);
			};
			tx.onerror = () => resolve(false);
		});
	}

	format_time_ago(timestamp) {
		if (!timestamp) return 'Recentemente';
		const diff = Math.floor((Date.now() - timestamp) / 1000);

		if (diff < 60) return 'Salvo agora há pouco';
		if (diff < 3600) return `Salvo há ${Math.floor(diff / 60)} min`;
		if (diff < 86400) {
			const h = Math.floor(diff / 3600);
			return `Salvo há ${h} hora${h > 1 ? 's' : ''}`;
		}
		const days = Math.floor(diff / 86400);
		if (days === 1) return 'Ontem';
		if (days < 7) return `Salvo há ${days} dias`;

		const d = new Date(timestamp);
		return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} às ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
	}

	async check_and_prompt_recovery() {
		// Only check if user is on blank workspace and hasn't started yet
		setTimeout(async () => {
			if (config.layers.length <= 1 && config.layers[0] && config.layers[0].data == null && config.layers[0].link == null) {
				const all = await this.get_all_projects();
				if (all.length > 0) {
					const latest = all[0];
					const elapsedHours = (Date.now() - (latest.updated_at || 0)) / (1000 * 3600);
					if (elapsedHours < 24) {
						alertify.notify(
							`<div style="display:flex; align-items:center; gap:8px;">
								<span style="font-size:20px;">💾</span>
								<div>
									<strong>Continuar projeto anterior?</strong><br>
									<span style="font-size:11px; opacity:0.85;">"${latest.title}" (${latest.width}x${latest.height})</span>
								</div>
							</div>`,
							'custom',
							7,
							() => {
								this.load_project_by_id(latest.id);
							}
						);
					}
				}
			}
		}, 1200);
	}

	async load_project_by_id(projectId) {
		const all = await this.get_all_projects();
		const p = all.find(item => item.id === projectId);
		if (!p || !p.json) {
			alertify.error('Erro ao carregar o projeto selecionado.');
			return;
		}

		this.POP.hide();
		this.currentProjectId = p.id;
		this.lastSavedJsonHash = p.json;

		alertify.message(`⏳ Carregando "${p.title}"...`);

		if (app.FileOpen) {
			await app.FileOpen.load_json(p.json);
			if (app.GUI && app.GUI.GUI_tabs) {
				app.GUI.GUI_tabs.set_active_tab_name(p.title);
			}
			alertify.success(`🎉 Projeto "${p.title}" restaurado com sucesso!`);
		}
	}

	export_project_json(projectId) {
		this.get_all_projects().then(all => {
			const p = all.find(item => item.id === projectId);
			if (!p || !p.json) return;

			const blob = new Blob([p.json], { type: 'application/json' });
			const safeName = (p.title || 'projeto').replace(/[/\\?%*:|"<>]/g, '-');
			filesaver.saveAs(blob, `${safeName}.json`);
			alertify.success(`💾 Arquivo "${safeName}.json" salvo no seu computador!`);
		});
	}

	async show_recent() {
		var _this = this;

		var modalHtml = `
			<div style="text-align:left; max-width:880px; margin:0 auto;">
				<!-- Top Header & Search Bar -->
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:10px; flex-wrap:wrap;">
					<div style="flex:1; min-width:240px; position:relative;">
						<input type="text" id="recent_search_input" placeholder="🔍 Pesquisar em meus projetos salvos..." style="width:100%; box-sizing:border-box; padding:8px 12px; font-size:12.5px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
					</div>
					<div style="display:flex; gap:8px;">
						<button type="button" id="btn_save_current_now" style="padding:8px 12px; font-size:12px; font-weight:700; background:#16a34a; color:#fff; border:none; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:4px;">
							<span>💾</span> Salvar Agora
						</button>
						<button type="button" id="btn_clear_all_recent" style="padding:8px 12px; font-size:12px; font-weight:600; background:#ef4444; color:#fff; border:none; border-radius:6px; cursor:pointer;">
							🗑️ Limpar Todos
						</button>
					</div>
				</div>

				<!-- Grid of Recent Projects -->
				<div id="recent_projects_grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:14px; max-height:460px; overflow-y:auto; padding:2px; min-height:220px;">
					<div style="grid-column:1/-1; text-align:center; padding:40px; color:#94a3b8;">
						<div style="font-size:32px; margin-bottom:8px;">⏳</div>
						<div>Carregando projetos salvos no navegador...</div>
					</div>
				</div>

				<div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; font-size:11px; color:#64748b; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
					<span>🔒 Seus projetos ficam salvos de forma segura e 100% privada no seu navegador (IndexedDB).</span>
					<span>⚡ Auto-Save ativado (salva a cada 4 segundos)</span>
				</div>
			</div>
		`;

		var settings = {
			title: '💾 Meus Projetos Recentes (Salvos no Navegador)',
			className: 'wide',
			params: [
				{ html: modalHtml }
			],
			on_load: async function() {
				const grid = document.getElementById('recent_projects_grid');
				const searchInput = document.getElementById('recent_search_input');
				const btnSaveNow = document.getElementById('btn_save_current_now');
				const btnClearAll = document.getElementById('btn_clear_all_recent');

				async function renderProjects() {
					const all = await _this.get_all_projects();
					const q = (_this.searchQuery || '').toLowerCase().trim();

					const filtered = all.filter(p => {
						if (!q) return true;
						return (p.title || '').toLowerCase().includes(q);
					});

					if (filtered.length === 0) {
						grid.innerHTML = `
							<div style="grid-column: 1 / -1; text-align:center; padding:50px 10px; color:#94a3b8;">
								<div style="font-size:40px; margin-bottom:8px;">📁</div>
								<div style="font-size:15px; font-weight:bold; color:#f1f5f9;">Nenhum projeto recente encontrado</div>
								<div style="font-size:12px; color:#64748b; margin-top:6px; max-width:400px; margin-left:auto; margin-right:auto;">
									Comece a desenhar ou importar fotos! O PhotoClone salva automaticamente seu trabalho em segundo plano.
								</div>
							</div>
						`;
						return;
					}

					let html = '';
					filtered.forEach(p => {
						const timeStr = _this.format_time_ago(p.updated_at);
						const thumbSrc = p.thumbnail || '';

						html += `
							<div class="recent-project-card" data-id="${p.id}" style="background:#1e293b; border:1px solid rgba(255,255,255,0.1); border-radius:8px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 4px 12px rgba(0,0,0,0.25); transition:transform 0.15s ease, border-color 0.15s ease;">
								<!-- Thumbnail Header -->
								<div style="height:140px; background:#0f172a; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; border-bottom:1px solid rgba(255,255,255,0.08);">
									${thumbSrc ? `<img src="${thumbSrc}" alt="${p.title}" style="max-width:100%; max-height:100%; object-fit:contain; display:block;" />` : `<div style="font-size:36px; opacity:0.3;">🎨</div>`}
									<span style="position:absolute; top:8px; left:8px; font-size:10px; font-weight:700; background:rgba(0,0,0,0.7); color:#38bdf8; padding:2px 6px; border-radius:4px; border:1px solid rgba(56,189,248,0.4);">
										${p.width}x${p.height}
									</span>
									<span style="position:absolute; top:8px; right:8px; font-size:10px; font-weight:700; background:rgba(0,0,0,0.7); color:#a855f7; padding:2px 6px; border-radius:4px; border:1px solid rgba(168,85,247,0.4);">
										📑 ${p.layers_count || 1} camada${p.layers_count > 1 ? 's' : ''}
									</span>
								</div>

								<!-- Card Body -->
								<div style="padding:10px 12px; display:flex; flex-direction:column; gap:6px; flex:1; justify-content:space-between;">
									<div>
										<div style="font-size:13px; font-weight:700; color:#f8fafc; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${p.title}">
											${p.title}
										</div>
										<div style="font-size:11px; color:#94a3b8; margin-top:2px;">
											🕒 ${timeStr}
										</div>
									</div>

									<!-- Action Buttons -->
									<div style="display:flex; gap:6px; margin-top:8px;">
										<button type="button" class="btn-load-recent" data-id="${p.id}" style="flex:1; padding:7px 4px; background:linear-gradient(135deg, #3b82f6, #2563eb); color:#ffffff; font-weight:700; font-size:11.5px; border-radius:6px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
											<span>📂</span> Abrir
										</button>
										<button type="button" class="btn-export-recent" data-id="${p.id}" title="Baixar arquivo .JSON no computador" style="padding:7px 8px; background:#334155; color:#f8fafc; font-size:12px; border-radius:6px; border:1px solid rgba(255,255,255,0.1); cursor:pointer;">
											💾
										</button>
										<button type="button" class="btn-delete-recent" data-id="${p.id}" title="Excluir este projeto recente" style="padding:7px 8px; background:rgba(239,68,68,0.15); color:#ef4444; font-size:12px; border-radius:6px; border:1px solid rgba(239,68,68,0.3); cursor:pointer;">
											🗑️
										</button>
									</div>
								</div>
							</div>
						`;
					});

					grid.innerHTML = html;

					// Attach listeners
					grid.querySelectorAll('.btn-load-recent').forEach(btn => {
						btn.onclick = function() {
							_this.load_project_by_id(this.dataset.id);
						};
					});

					grid.querySelectorAll('.btn-export-recent').forEach(btn => {
						btn.onclick = function() {
							_this.export_project_json(this.dataset.id);
						};
					});

					grid.querySelectorAll('.btn-delete-recent').forEach(btn => {
						btn.onclick = async function() {
							if (confirm('Deseja excluir este projeto dos recentes?')) {
								await _this.delete_project(this.dataset.id);
								alertify.success('Projeto removido.');
								renderProjects();
							}
						};
					});
				}

				// Search input
				searchInput.addEventListener('input', (e) => {
					_this.searchQuery = e.target.value;
					renderProjects();
				});

				// Save Current Now button
				btnSaveNow.onclick = async () => {
					if (!config.layers || config.layers.length === 0) {
						alertify.error('Nenhum projeto ativo para salvar.');
						return;
					}
					const jsonString = app.FileSave.export_as_json();
					await _this.save_project_record(jsonString);
					alertify.success('💾 Projeto salvo com sucesso nos Recentes!');
					renderProjects();
				};

				// Clear All button
				btnClearAll.onclick = async () => {
					if (confirm('Tem certeza de que deseja limpar todos os projetos recentes do navegador?')) {
						await _this.clear_all_projects();
						alertify.success('Histórico de projetos limpo com sucesso.');
						renderProjects();
					}
				};

				renderProjects();
			}
		};

		this.POP.show(settings);
	}

}

export default File_recent_projects_class;
