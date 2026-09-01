/*
 * PhotoClone - Multi-Document Tabs System (Photoshop / Photopea Style)
 * Full State & Layer Isolation via config.layers
 */

import app from './../../app.js';
import config from './../../config.js';
import Base_gui_class from './../base-gui.js';
import Base_layers_class from './../base-layers.js';
import Helper_class from './../../libs/helpers.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

class GUI_tabs_class {

	constructor() {
		this.Base_gui = new Base_gui_class();
		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();
		this.documents = [];
		this.active_doc_id = null;
		this.doc_counter = 1;
	}

	init() {
		// Capture initial document from config.layers
		const initialDoc = {
			id: 'doc_' + Date.now() + '_1',
			name: 'Projeto 1',
			width: config.WIDTH || 1280,
			height: config.HEIGHT || 720,
			layers: this.clone_layers(config.layers || []),
			auto_increment: this.Base_layers.auto_increment || 1,
			active_layer_id: config.layer ? config.layer.id : (config.layers && config.layers[0] ? config.layers[0].id : 1),
			action_history: app.State && app.State.action_history ? app.State.action_history.slice() : [],
			action_history_index: app.State ? app.State.action_history_index || 0 : 0
		};
		this.documents.push(initialDoc);
		this.active_doc_id = initialDoc.id;

		this.render_tabs();
	}

	clone_layer(layer) {
		if (!layer) return null;
		const clone = Object.assign({}, layer);

		// Deep clone offscreen canvas bitmap
		if (layer.link_canvas && typeof layer.link_canvas.getContext === 'function') {
			const c = document.createElement('canvas');
			c.width = layer.link_canvas.width;
			c.height = layer.link_canvas.height;
			const ctx = c.getContext('2d');
			ctx.drawImage(layer.link_canvas, 0, 0);
			clone.link_canvas = c;
		} else if (layer.link_canvas) {
			clone.link_canvas = layer.link_canvas;
		}

		if (layer.link && layer.link instanceof HTMLImageElement) {
			clone.link = layer.link;
		}

		if (layer.data) {
			if (typeof layer.data === 'object' && layer.data !== null) {
				clone.data = Object.assign({}, layer.data);
			} else {
				clone.data = layer.data;
			}
		}

		if (layer.filters && Array.isArray(layer.filters)) {
			clone.filters = JSON.parse(JSON.stringify(layer.filters));
		}

		if (layer.params && typeof layer.params === 'object' && layer.params !== null) {
			clone.params = Object.assign({}, layer.params);
		} else {
			clone.params = {};
		}

		return clone;
	}

	clone_layers(layers) {
		if (!layers || !Array.isArray(layers)) return [];
		return layers.map(l => this.clone_layer(l)).filter(Boolean);
	}

	set_active_tab_name(name) {
		const currentDoc = this.documents.find(d => d.id === this.active_doc_id);
		if (currentDoc && name) {
			currentDoc.name = name;
			this.render_tabs();
		}
	}

	render_tabs() {
		const tabsBar = document.getElementById('photoclone_tabs_bar');
		if (!tabsBar) return;

		let html = '';

		for (let doc of this.documents) {
			const isActive = doc.id === this.active_doc_id;
			html += `
				<div class="doc_tab ${isActive ? 'active' : ''}" data-id="${doc.id}" title="${doc.name} (${doc.width}x${doc.height}px)">
					<span class="tab_icon">🖼️</span>
					<span class="tab_name">${doc.name}</span>
					<span class="tab_close" data-id="${doc.id}" title="Fechar aba">✕</span>
				</div>
			`;
		}

		html += `
			<button type="button" id="tab_new_btn" class="tab_new_btn" title="Nova Aba (+)">+</button>
		`;

		tabsBar.innerHTML = html;
		this.set_events();
	}

	set_events() {
		const tabsBar = document.getElementById('photoclone_tabs_bar');
		if (!tabsBar) return;

		// Click tab to switch
		tabsBar.querySelectorAll('.doc_tab').forEach(tabEl => {
			tabEl.onclick = (e) => {
				if (e.target.classList.contains('tab_close')) return;
				const id = tabEl.getAttribute('data-id');
				this.switch_tab(id);
			};
		});

		// Click close button
		tabsBar.querySelectorAll('.tab_close').forEach(closeBtn => {
			closeBtn.onclick = (e) => {
				e.stopPropagation();
				const id = closeBtn.getAttribute('data-id');
				this.close_tab(id);
			};
		});

		// Click new tab button
		const newBtn = document.getElementById('tab_new_btn');
		if (newBtn) {
			newBtn.onclick = () => {
				this.new_tab();
			};
		}
	}

	save_current_state() {
		const currentDoc = this.documents.find(d => d.id === this.active_doc_id);
		if (!currentDoc) return;

		currentDoc.width = config.WIDTH;
		currentDoc.height = config.HEIGHT;
		currentDoc.zoom = config.ZOOM || 1;
		currentDoc.is_custom_document = config.is_custom_document;
		if (app.GUI && app.GUI.GUI_preview && app.GUI.GUI_preview.zoom_data) {
			currentDoc.zoom_data = Object.assign({}, app.GUI.GUI_preview.zoom_data);
		}
		// Clone active layers from config.layers
		currentDoc.layers = this.clone_layers(config.layers || []);
		currentDoc.auto_increment = this.Base_layers.auto_increment;
		currentDoc.active_layer_id = config.layer ? config.layer.id : null;

		if (app.State) {
			currentDoc.action_history = app.State.action_history ? app.State.action_history.slice() : [];
			currentDoc.action_history_index = app.State.action_history_index || 0;
		}
	}

	switch_tab(id) {
		if (id === this.active_doc_id && this.documents.length > 1) {
			return;
		}

		this.save_current_state();

		const targetDoc = this.documents.find(d => d.id === id);
		if (!targetDoc) return;

		this.active_doc_id = targetDoc.id;

		// Restore dimensions
		config.WIDTH = targetDoc.width;
		config.HEIGHT = targetDoc.height;
		config.is_custom_document = !!targetDoc.is_custom_document;

		// Restore isolated layers directly into config.layers
		config.layers = this.clone_layers(targetDoc.layers);
		this.Base_layers.auto_increment = targetDoc.auto_increment || (config.layers.length + 1);

		if (config.layers.length > 0) {
			const foundLayer = config.layers.find(l => l.id === targetDoc.active_layer_id);
			config.layer = foundLayer || config.layers[0];
		} else {
			config.layer = null;
		}

		// Restore isolated undo history
		if (app.State) {
			app.State.action_history = targetDoc.action_history ? targetDoc.action_history.slice() : [];
			app.State.action_history_index = targetDoc.action_history_index || 0;
		}

		// Clear main canvas and prepare geometry
		this.Base_layers.stable_dimensions = [-1, -1];
		this.Base_layers.init_zoom_lib();

		const mainCanvas = document.getElementById('canvas_minipaint');
		if (mainCanvas) {
			const mCtx = mainCanvas.getContext('2d');
			mCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		}

		if (app.GUI && app.GUI.GUI_preview) {
			const targetZoom = targetDoc.zoom || 1;
			app.GUI.GUI_preview.zoom(targetZoom * 100);
		} else {
			this.Base_gui.prepare_canvas();
		}

		// Force canvas re-render immediately
		config.need_render = true;
		this.Base_layers.render();

		if (app.GUI) {
			if (app.GUI.GUI_layers) {
				app.GUI.GUI_layers.render_layers();
			}
			if (app.GUI.GUI_information) {
				app.GUI.GUI_information.show_size();
			}
			if (app.GUI.GUI_details) {
				app.GUI.GUI_details.render_details();
			}
			if (app.GUI.GUI_preview) {
				app.GUI.GUI_preview.render_preview_active_zone();
			}
		}

		this.render_tabs();
	}

	new_tab(customName = null) {
		this.save_current_state();

		this.doc_counter++;
		const name = customName || `Projeto ${this.doc_counter}`;
		
		const newDoc = {
			id: 'doc_' + Date.now() + '_' + this.doc_counter,
			name: name,
			width: 1280,
			height: 720,
			layers: [
				{
					id: 1,
					parent_id: 0,
					name: 'Camada 1',
					type: null,
					link: null,
					x: 0,
					y: 0,
					width: null,
					width_original: null,
					height: null,
					height_original: null,
					visible: true,
					is_vector: false,
					hide_selection_if_active: false,
					opacity: 100,
					order: 1,
					composition: 'source-over',
					rotate: 0,
					data: null,
					params: {},
					status: null,
					color: config.COLOR,
					filters: [],
					render_function: null
				}
			],
			auto_increment: 2,
			active_layer_id: 1,
			action_history: [],
			action_history_index: 0,
			zoom: 1,
			zoom_data: { x: 0, y: 0, move_pos: null }
		};

		this.documents.push(newDoc);
		this.switch_tab(newDoc.id);
	}

	close_tab(id) {
		if (this.documents.length <= 1) {
			alertify.message("Este é o único documento aberto.");
			return;
		}

		const index = this.documents.findIndex(d => d.id === id);
		if (index === -1) return;

		this.documents.splice(index, 1);

		if (this.active_doc_id === id) {
			const nextDoc = this.documents[Math.max(0, index - 1)];
			this.switch_tab(nextDoc.id);
		} else {
			this.render_tabs();
		}
	}
}

export default GUI_tabs_class;
