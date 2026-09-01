import app from './../../app.js';
import config from './../../config.js';
import Base_gui_class from './../../core/base-gui.js';
import Base_layers_class from './../../core/base-layers.js';
import Helper_class from './../../libs/helpers.js';
import Dialog_class from './../../libs/popup.js';
import Tools_settings_class from './../tools/settings.js';

const PRESETS = [
	{ icon: '📱', name: 'Post Instagram', desc: 'Feed Quadrado', width: 1080, height: 1080 },
	{ icon: '📲', name: 'Stories / Reels / TikTok', desc: 'Vertical 9:16', width: 1080, height: 1920 },
	{ icon: '🎬', name: 'Capa / Thumb YouTube', desc: 'HD 720p', width: 1280, height: 720 },
	{ icon: '🖥️', name: 'Full HD / Vídeo', desc: '1080p Widescreen', width: 1920, height: 1080 },
	{ icon: '🖼️', name: 'Post Facebook / Banner', desc: 'Feed Horizontal', width: 1200, height: 630 },
	{ icon: '🖨️', name: 'Papel A4 (300 DPI)', desc: 'Impressão Alta Res.', width: 2480, height: 3508 },
	{ icon: '📇', name: 'Cartão de Visita', desc: '9x5 cm (300 DPI)', width: 1050, height: 600 },
	{ icon: '📄', name: 'Panfleto / Flyer A5', desc: 'Impressão 300 DPI', width: 1417, height: 1984 },
	{ icon: '📺', name: '4K Ultra HD', desc: '3840 x 2160', width: 3840, height: 2160 }
];

/** 
 * manages files / new
 * 
 * @author ViliusL
 */
class File_new_class {

	constructor() {
		this.Base_gui = new Base_gui_class();
		this.Base_layers = new Base_layers_class();
		this.POP = new Dialog_class();
		this.Helper = new Helper_class();
		this.Tools_settings = new Tools_settings_class();
		this.selected_preset_name = '';
	}

	new () {
		var _this = this;
		var width = config.WIDTH;
		var height = config.HEIGHT;
		var common_dimensions = this.Base_gui.common_dimensions;
		var resolution_types = ['Custom'];
		var units = this.Tools_settings.get_setting('default_units');
		var resolution = this.Tools_settings.get_setting('resolution');
		this.selected_preset_name = '';

		for (var i in common_dimensions) {
			var value = common_dimensions[i];
			resolution_types.push(value[0] + 'x' + value[1] + ' - ' + value[2]);
		}

		var transparency_cookie = this.Helper.getCookie('transparency');
		if (transparency_cookie === null) {
			transparency_cookie = true;
		}
		var transparency = !!transparency_cookie;

		// Convert units
		width = this.Helper.get_user_unit(width, units, resolution);
		height = this.Helper.get_user_unit(height, units, resolution);

		var settings = {
			title: 'Novo Arquivo / Projeto',
			className: 'wide',
			params: [
				{name: "width", title: "Largura:", value: width, comment: units},
				{name: "height", title: "Altura:", value: height, comment: units},
				{name: "resolution_type", title: "Resolução:", values: resolution_types},
				{name: "layout", title: "Orientação:", value: "Custom", values: ["Custom", "Landscape", "Portrait"]},
				{name: "transparency", title: "Transparente:", value: transparency},
			],
			on_load: function (params, popup) {
				var paramsContainer = popup.el.querySelector('[data-id="params_content"]');
				if (!paramsContainer) return;

				var presetsWrapper = document.createElement('div');
				presetsWrapper.className = 'new-doc-presets-container';

				var isEn = config.LANG === 'en';
				var presetsHeader = `<div class="new-doc-presets-title">${isEn ? '📐 Quick Canvas Presets for Social Media & Print:' : '✨ Tamanhos Rápidos para Redes Sociais & Impressão:'}</div>`;
				var presetsGrid = `<div class="new-doc-presets-grid">`;

				PRESETS.forEach(function (preset, idx) {
					presetsGrid += `
						<div class="new-doc-preset-card" data-idx="${idx}">
							<div class="new-doc-preset-icon">${preset.icon}</div>
							<div class="new-doc-preset-info">
								<span class="new-doc-preset-name">${preset.name}</span>
								<span class="new-doc-preset-dim">${preset.width} × ${preset.height}</span>
							</div>
						</div>
					`;
				});

				presetsGrid += `</div>`;
				presetsWrapper.innerHTML = presetsHeader + presetsGrid;

				paramsContainer.parentNode.insertBefore(presetsWrapper, paramsContainer);

				// Click handler for preset cards
				var cards = presetsWrapper.querySelectorAll('.new-doc-preset-card');
				cards.forEach(function (card) {
					card.addEventListener('click', function () {
						cards.forEach(c => c.classList.remove('active'));
						this.classList.add('active');

						var idx = parseInt(this.dataset.idx);
						var p = PRESETS[idx];
						_this.selected_preset_name = p.name;
						_this.selected_preset_width = p.width;
						_this.selected_preset_height = p.height;

						var widthInput = popup.el.querySelector('#pop_data_width') || popup.el.querySelector('input[name="width"]');
						var heightInput = popup.el.querySelector('#pop_data_height') || popup.el.querySelector('input[name="height"]');
						var resSelect = popup.el.querySelector('#pop_data_resolution_type') || popup.el.querySelector('select[name="resolution_type"]');
						var layoutSelect = popup.el.querySelector('#pop_data_layout') || popup.el.querySelector('select[name="layout"]');

						if (widthInput) widthInput.value = p.width;
						if (heightInput) heightInput.value = p.height;
						if (resSelect) resSelect.value = 'Custom';
						if (layoutSelect) layoutSelect.value = 'Custom';
					});

					// Double click to instantly create
					card.addEventListener('dblclick', function () {
						var idx = parseInt(this.dataset.idx);
						var p = PRESETS[idx];
						_this.selected_preset_name = p.name;
						_this.selected_preset_width = p.width;
						_this.selected_preset_height = p.height;

						var widthInput = popup.el.querySelector('#pop_data_width') || popup.el.querySelector('input[name="width"]');
						var heightInput = popup.el.querySelector('#pop_data_height') || popup.el.querySelector('input[name="height"]');
						var resSelect = popup.el.querySelector('#pop_data_resolution_type') || popup.el.querySelector('select[name="resolution_type"]');
						var layoutSelect = popup.el.querySelector('#pop_data_layout') || popup.el.querySelector('select[name="layout"]');

						if (widthInput) widthInput.value = p.width;
						if (heightInput) heightInput.value = p.height;
						if (resSelect) resSelect.value = 'Custom';
						if (layoutSelect) layoutSelect.value = 'Custom';

						var okBtn = popup.el.querySelector('[data-id="popup_ok"]');
						if (okBtn) okBtn.click();
					});
				});
			},
			on_finish: function (params) {
				_this.new_handler(params);
			},
		};
		this.POP.show(settings);
	}

	async new_handler(response) {
		var width = parseFloat(response.width);
		var height = parseFloat(response.height);
		var resolution_type = response.resolution_type;
		var transparency = response.transparency;
		var units = this.Tools_settings.get_setting('default_units');
		var resolution = this.Tools_settings.get_setting('resolution');

		if (this.selected_preset_name && this.selected_preset_width && this.selected_preset_height) {
			width = this.selected_preset_width;
			height = this.selected_preset_height;
		}
		else if (resolution_type != 'Custom') {
			var dim = resolution_type.split(" ");
			dim = dim[0].split("x");
			width = parseInt(dim[0]);
			height = parseInt(dim[1]);

			if (response.layout == 'Portrait') {
				var tmp = width;
				width = height;
				height = tmp;
			}
		}
		else {
			// Convert units
			width = this.Helper.get_internal_unit(width, units, resolution);
			height = this.Helper.get_internal_unit(height, units, resolution);
		}

		var tabTitle = this.selected_preset_name 
			? `${this.selected_preset_name} (${parseInt(width)}x${parseInt(height)})`
			: `Sem Título (${parseInt(width)}x${parseInt(height)})`;

		// Prepare layers		
		app.State.do_action(
			new app.Actions.Bundle_action('new_file', 'New File', [
				new app.Actions.Refresh_action_attributes_action('undo'),
				new app.Actions.Prepare_canvas_action('undo'),
				new app.Actions.Update_config_action({
					TRANSPARENCY: !!transparency,
					WIDTH: parseInt(width),
					HEIGHT: parseInt(height),
					ALPHA: 255,
					COLOR: '#008000',
					mouse: {},
					visible_width: null,
					visible_height: null,
					user_fonts: {},
					is_custom_document: true
				}),
				new app.Actions.Prepare_canvas_action('do'),
				new app.Actions.Refresh_action_attributes_action('do'),
				new app.Actions.Reset_layers_action(),
				new app.Actions.Init_canvas_zoom_action(),
				new app.Actions.Insert_layer_action({
					name: 'Plano de Fundo',
					width: parseInt(width),
					height: parseInt(height)
				})
			])
		);

		if (app.GUI && app.GUI.GUI_tabs) {
			app.GUI.GUI_tabs.set_active_tab_name(tabTitle);
		}

		// Sleep, wait till DOM is finished
		await new Promise(r => setTimeout(r, 10));

		// Fit to screen
		this.Base_gui.GUI_preview.zoom_auto(true);

		// Save transparency
		if (transparency) {
			this.Helper.setCookie('transparency', 1);
		}
		else {
			this.Helper.setCookie('transparency', 0);
		}
	}

}

export default File_new_class;