/*
 * PhotoClone - https://github.com/viliusle/PhotoClone
 * author: Vilius L.
 */

import app from './../../app.js';
import config from './../../config.js';
import Base_layers_class from './../base-layers.js';
import Helper_class from './../../libs/helpers.js';
import Layer_rename_class from './../../modules/layer/rename.js';
import Effects_browser_class from './../../modules/effects/browser.js';
import Layer_duplicate_class from './../../modules/layer/duplicate.js';
import Layer_raster_class from './../../modules/layer/raster.js';
import Tools_translate_class from './../../modules/tools/translate.js';

var template = `
	<div class="sidebar_tabs_header" style="display:flex; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:8px; gap:4px;">
		<button type="button" class="sidebar_tab_btn" id="tab_layers" style="flex:1; padding:6px 4px; font-size:11px; font-weight:700; background:#1e293b; color:#cbd5e1; border:1px solid rgba(255,255,255,0.15); border-radius:6px 6px 0 0; cursor:pointer; text-align:center; transition:all 0.2s ease;">
			📑 Camadas
		</button>
		<button type="button" class="sidebar_tab_btn" id="tab_history" style="flex:1; padding:6px 4px; font-size:11px; font-weight:600; background:#0f172a; color:#94a3b8; border:1px solid rgba(255,255,255,0.08); border-radius:6px 6px 0 0; cursor:pointer; text-align:center; transition:all 0.2s ease;">
			📜 Histórico <span id="history_badge" style="font-size:10px; background:#3b82f6; color:#fff; padding:1px 5px; border-radius:10px; margin-left:2px;">0</span>
		</button>
	</div>

	<div id="layers_tab_pane">
		<button type="button" class="layer_add trn" id="insert_layer" title="Insert new layer">+</button>
		<button type="button" class="layer_duplicate trn" id="layer_duplicate" title="Duplicate layer">D</button>
		<button type="button" class="layer_raster trn" id="layer_raster" title="Convert layer to raster">R</button>

		<button type="button" class="layers_arrow trn" title="Move layer down" id="layer_down">&darr;</button>
		<button type="button" class="layers_arrow trn" title="Move layer up" id="layer_up">&uarr;</button>

		<div class="layers_list" id="layers"></div>
	</div>

	<div id="history_tab_pane" style="display:none;">
		<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 2px;">
			<span style="font-size:11px; color:#94a3b8;">Clique para voltar no tempo:</span>
			<button type="button" id="btn_history_jump_start" style="font-size:10.5px; padding:2px 7px; background:#334155; color:#f1f5f9; border:1px solid rgba(255,255,255,0.15); border-radius:4px; cursor:pointer;" title="Reverter para o estado inicial">↺ Início</button>
		</div>
		<div class="history_timeline_container" id="history_timeline_container" style="max-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:4px; padding-right:2px;"></div>
	</div>
`;

/**
 * GUI class responsible for rendering layers on right sidebar
 */
class GUI_layers_class {

	constructor(ctx) {
		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();
		this.Layer_rename = new Layer_rename_class();
		this.Effects_browser = new Effects_browser_class();
		this.Layer_duplicate = new Layer_duplicate_class();
		this.Layer_raster = new Layer_raster_class();
		this.Tools_translate = new Tools_translate_class();
		this.active_tab = 'layers';
	}

	render_main_layers() {
		document.getElementById('layers_base').innerHTML = template;
		if (config.LANG != 'en') {
			this.Tools_translate.translate(config.LANG, document.getElementById('layers_base'));
		}
		this.render_layers();
		this.render_history();
		this.set_events();
	}

	set_events() {
		var _this = this;

		document.getElementById('layers_base').addEventListener('click', async function (event) {
			var target = event.target;
			if (target.id == 'insert_layer') {
				//new layer
				app.State.do_action(
					new app.Actions.Insert_layer_action()
				);
			}
			else if (target.id == 'layer_duplicate') {
				//duplicate
				_this.Layer_duplicate.duplicate();
			}
			else if (target.id == 'layer_raster') {
				//raster
				_this.Layer_raster.raster();
			}
			else if (target.id == 'layer_up') {
				//move layer up
				app.State.do_action(
					new app.Actions.Reorder_layer_action(config.layer.id, 1)
				);
			}
			else if (target.id == 'layer_down') {
				//move layer down
				app.State.do_action(
					new app.Actions.Reorder_layer_action(config.layer.id, -1)
				);
			}
			else if (target.id == 'visibility') {
				//change visibility
				console.log('Toggle visibility clicked for layer id:', target.dataset.id);
				try {
					return await app.State.do_action(
						new app.Actions.Toggle_layer_visibility_action(target.dataset.id)
					);
				} catch (err) {
					console.error('Error toggling visibility:', err);
					alertify.error('Erro de visibilidade: ' + err.message);
				}
			}
			else if (target.id == 'delete') {
				//delete layer
				console.log('Delete clicked for layer id:', target.dataset.id);
				try {
					await app.State.do_action(
						new app.Actions.Delete_layer_action(target.dataset.id)
					);
				} catch (err) {
					console.error('Error deleting layer:', err);
					alertify.error('Erro ao deletar: ' + err.message);
				}
			}
			else if (target.id == 'layer_name') {
				//select layer
				if (target.dataset.id == config.layer.id)
					return;
				app.State.do_action(
					new app.Actions.Select_layer_action(target.dataset.id)
				);
			}
			else if (target.id == 'delete_filter') {
				//delete filter
				app.State.do_action(
					new app.Actions.Delete_layer_filter_action(target.dataset.pid, target.dataset.id)
				);
			}
			else if (target.id == 'filter_name') {
				//edit filter
				var effects = _this.Effects_browser.get_effects_list();
				var key = target.dataset.filter.toLowerCase();
				for (var i in effects) {
					if(effects[i].title.toLowerCase() == key){
						_this.Base_layers.select(target.dataset.pid);
						var function_name = _this.Effects_browser.get_function_from_path(key);
						effects[i].object[function_name](target.dataset.id);
					}
				}
			}
		});

		// Tab switching (Camadas vs Histórico)
		const tabLayers = document.getElementById('tab_layers');
		const tabHistory = document.getElementById('tab_history');
		const paneLayers = document.getElementById('layers_tab_pane');
		const paneHistory = document.getElementById('history_tab_pane');

		if (tabLayers && tabHistory && paneLayers && paneHistory) {
			tabLayers.addEventListener('click', () => {
				_this.active_tab = 'layers';
				tabLayers.style.background = '#1e293b';
				tabLayers.style.color = '#cbd5e1';
				tabLayers.style.fontWeight = '700';
				tabHistory.style.background = '#0f172a';
				tabHistory.style.color = '#94a3b8';
				tabHistory.style.fontWeight = '600';
				paneLayers.style.display = 'block';
				paneHistory.style.display = 'none';
			});

			tabHistory.addEventListener('click', () => {
				_this.active_tab = 'history';
				tabHistory.style.background = '#1e293b';
				tabHistory.style.color = '#cbd5e1';
				tabHistory.style.fontWeight = '700';
				tabLayers.style.background = '#0f172a';
				tabLayers.style.color = '#94a3b8';
				tabLayers.style.fontWeight = '600';
				paneLayers.style.display = 'none';
				paneHistory.style.display = 'block';
				_this.render_history();
			});
		}

		// Revert to start of project
		const btnJumpStart = document.getElementById('btn_history_jump_start');
		if (btnJumpStart) {
			btnJumpStart.addEventListener('click', async () => {
				if (app.State) {
					await app.State.jump_to_history(0);
					alertify.message('↺ Revertido para o início do projeto');
				}
			});
		}

		// History item click (time travel)
		document.getElementById('layers_base').addEventListener('click', async function (event) {
			const item = event.target.closest('.history_timeline_item');
			if (item && item.dataset.step != null) {
				const stepIndex = parseInt(item.dataset.step);
				if (app.State) {
					await app.State.jump_to_history(stepIndex);
				}
			}
		});

		document.getElementById('layers_base').addEventListener('dblclick', function (event) {
			var target = event.target;
			if (target.id == 'layer_name') {
				//rename layer
				_this.Layer_rename.rename(target.dataset.id);
			}
		});

	}

	/**
	 * renders layers list
	 */
	render_layers() {
		var target_id = 'layers';
		var container = document.getElementById(target_id);
		if (!container) return;

		var layers = config.layers.concat().sort(
			//sort function
				(a, b) => b.order - a.order
			);

		container.innerHTML = '';
		var html = '';
		
		if (config.layer) {
			for (var i in layers) {
				var value = layers[i];
				var class_extra = '';
				if(value.composition === 'source-atop'){
					class_extra += ' shorter';
				}
				if (value.id == config.layer.id){
					class_extra += ' active';
				}

				html += '<div class="item ' + class_extra + '">';
				if (value.visible == true)
					html += '	<button class="visibility visible trn" id="visibility" data-id="' + value.id + '" title="Hide"></button>';
				else
					html += '	<button class="visibility trn" id="visibility" data-id="' + value.id + '" title="Show"></button>';
				html += '	<button class="delete trn" id="delete" data-id="' + value.id + '" title="Delete"></button>';
				
				if(value.composition === 'source-atop'){
					html += '	<button class="arrow_down" data-id="' + value.id + '" ></button>';
				}

				var layer_title = this.Helper.escapeHtml(value.name);
				
				html += '	<button class="layer_name" id="layer_name" data-id="' + value.id + '">' + layer_title + '</button>';
				html += '	<div class="clear"></div>';
				html += '</div>';

				//show filters
				if (layers[i].filters.length > 0) {
					html += '<div class="filters">';
					for (var j in layers[i].filters) {
						var filter = layers[i].filters[j];
						var title = this.Helper.ucfirst(filter.name);
						title = title.replace(/-/g, ' ');

						html += '<div class="filter">';
						html += '	<span class="delete" id="delete_filter" data-pid="' + layers[i].id + '" data-id="' + filter.id + '" title="delete"></span>';
						html += '	<span class="layer_name" id="filter_name" data-pid="' + layers[i].id + '" data-id="' + filter.id + '" data-filter="' + filter.name + '">' + title + '</span>';
						html += '	<div class="clear"></div>';
						html += '</div>';
					}
					html += '</div>';
				}
			}
		}

		//register
		container.innerHTML = html;
		if (config.LANG != 'en') {
			this.Tools_translate.translate(config.LANG, container);
		}
	}

	/**
	 * renders history timeline
	 */
	render_history() {
		const container = document.getElementById('history_timeline_container');
		const badge = document.getElementById('history_badge');
		if (!app.State) return;

		const history = app.State.action_history || [];
		const activeIndex = app.State.action_history_index || 0;

		if (badge) {
			badge.innerText = history.length;
		}

		if (!container) return;

		let html = '';

		// 0. Base / Initial State
		const isInitialActive = activeIndex === 0;
		html += `
			<div class="history_timeline_item ${isInitialActive ? 'active' : (activeIndex > 0 ? 'past' : 'future')}" data-step="0" style="display:flex; align-items:center; gap:6px; padding:6px 8px; border-radius:6px; font-size:11.5px; cursor:pointer; transition:all 0.15s ease; ${isInitialActive ? 'background:linear-gradient(135deg, rgba(59,130,246,0.35), rgba(168,85,247,0.35)); border:1px solid #3b82f6; color:#ffffff; font-weight:700;' : 'background:#1e293b; border:1px solid rgba(255,255,255,0.06); color:#cbd5e1;'}">
				<span style="font-size:13px;">${isInitialActive ? '📍' : '📄'}</span>
				<span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Início do Projeto</span>
				${isInitialActive ? '<span style="font-size:10px; background:#3b82f6; color:#fff; padding:1px 5px; border-radius:4px;">Atual</span>' : ''}
			</div>
		`;

		// 1..N: Each action in history
		for (let i = 0; i < history.length; i++) {
			const stepIndex = i + 1;
			const action = history[i];
			const isCurrent = stepIndex === activeIndex;
			const isPast = stepIndex < activeIndex;
			const isFuture = stepIndex > activeIndex;

			const label = this.format_action_label(action);
			const icon = this.get_action_icon(action);

			let itemStyle = 'background:#1e293b; border:1px solid rgba(255,255,255,0.06); color:#cbd5e1;';
			let extraBadge = '';

			if (isCurrent) {
				itemStyle = 'background:linear-gradient(135deg, rgba(168,85,247,0.4), rgba(59,130,246,0.4)); border:1px solid #a855f7; color:#ffffff; font-weight:700; box-shadow:0 0 8px rgba(168,85,247,0.3);';
				extraBadge = '<span style="font-size:10px; background:#a855f7; color:#fff; padding:1px 5px; border-radius:4px;">Atual</span>';
			} else if (isFuture) {
				itemStyle = 'background:#0f172a; border:1px dashed rgba(255,255,255,0.1); color:#64748b; opacity:0.7;';
				extraBadge = '<span style="font-size:11px;" title="Refazer até aqui">↷</span>';
			}

			html += `
				<div class="history_timeline_item ${isCurrent ? 'active' : (isPast ? 'past' : 'future')}" data-step="${stepIndex}" style="display:flex; align-items:center; gap:6px; padding:6px 8px; border-radius:6px; font-size:11.5px; cursor:pointer; transition:all 0.15s ease; ${itemStyle}">
					<span style="font-size:13px;">${isCurrent ? '📍' : icon}</span>
					<span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${label}">${label}</span>
					${extraBadge}
				</div>
			`;
		}

		container.innerHTML = html;

		// Scroll active item into view
		const activeEl = container.querySelector('.history_timeline_item.active');
		if (activeEl) {
			activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		}
	}

	format_action_label(action) {
		if (!action) return 'Ação';
		let desc = action.action_description || action.action_id || 'Ação';
		const dict = {
			'Insert Layer': 'Nova Camada',
			'Delete Layer': 'Excluir Camada',
			'Update Layer': 'Editar Camada',
			'Change Layer Details': 'Alterar Detalhes',
			'Reorder Layer': 'Reordenar Camada',
			'Clear Layer': 'Limpar Camada',
			'Add Layer Filter': 'Aplicar Filtro',
			'Delete Layer Filter': 'Remover Filtro',
			'Set Selection': 'Selecionar Área',
			'Reset Selection': 'Cancelar Seleção',
			'Auto Resize Canvas': 'Redimensionar Tela',
			'Init Canvas Zoom': 'Ajustar Zoom',
			'Reset Layers': 'Resetar Camadas',
			'Toggle Layer Visibility': 'Alternar Visibilidade',
			'Stop Animation': 'Parar Animação'
		};
		if (dict[desc]) return dict[desc];
		if (desc.startsWith('Filter:')) return desc.replace('Filter:', 'Filtro:');
		if (desc.startsWith('Text:')) return desc;
		return desc;
	}

	get_action_icon(action) {
		if (!action) return '⚡';
		const desc = (action.action_description || action.action_id || '').toLowerCase();
		if (desc.includes('text') || desc.includes('texto')) return '🔤';
		if (desc.includes('insert') || desc.includes('nova')) return '➕';
		if (desc.includes('delete') || desc.includes('excluir') || desc.includes('remover')) return '🗑️';
		if (desc.includes('filter') || desc.includes('filtro') || desc.includes('effect')) return '🎨';
		if (desc.includes('reorder') || desc.includes('reordenar') || desc.includes('mover')) return '🔃';
		if (desc.includes('selection') || desc.includes('selecionar')) return '📐';
		if (desc.includes('visibility') || desc.includes('visibilidade')) return '👁️';
		if (desc.includes('details') || desc.includes('detalhes') || desc.includes('param')) return '⚙️';
		return '⚡';
	}
}

export default GUI_layers_class;

