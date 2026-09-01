/*
 * PhotoClone - https://github.com/viliusle/PhotoClone
 * author: Vilius L.
 */

import app from './../../app.js';
import config from './../../config.js';
import Helper_class from './../../libs/helpers.js';
import Tools_translate_class from './../../modules/tools/translate.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';
import Base_gui_class from '../base-gui.js';

var instance = null;

/**
 * GUI class responsible for rendering left sidebar tools
 */
class GUI_tools_class {

	constructor(GUI_class) {
		//singleton
		if (instance) {
			return instance;
		}
		instance = this;

		this.Helper = new Helper_class();
		this.Tools_translate = new Tools_translate_class();
		this.Base_gui = new Base_gui_class();

		//active tool
		this.active_tool = 'brush';
		this.tools_modules = {};

		this.set_events();
	}

	load_plugins() {
		var _this = this;
		var ctx = document.getElementById('canvas_minipaint').getContext("2d");
		var plugins_context = require.context("./../../tools/", true, /\.js$/);
		plugins_context.keys().forEach(function (key) {
			if (key.indexOf('Base' + '/') < 0) {
				var moduleKey = key.replace('./', '').replace('.js', '');
				var full_key = moduleKey;
				if (moduleKey.indexOf('/') > -1) {
					var parts = moduleKey.split("/");
					moduleKey = parts[parts.length - 1];
				}

				var classObj = plugins_context(key);
				var object = new classObj.default(ctx);

				var title = _this.Helper.ucfirst(object.name);
				title = title.replace(/_/, ' ');

				_this.tools_modules[moduleKey] = {
					key: moduleKey,
					full_key: full_key,
					name: object.name,
					title: title,
					object: object,
				};

				//init events once
				if(typeof object.load != "undefined") {
					object.load();
				}
			}
		});
	}

	render_main_tools() {
		this.load_plugins();

		this.render_tools();
	}

	render_tools() {
		var target_id = "tools_container";
		var _this = this;
		var saved_tool = this.Helper.getCookie('active_tool');
		if(saved_tool == 'media' || saved_tool == 'shape' || saved_tool == 'qrcode' || saved_tool == 'illustrations' || saved_tool == 'icons' || saved_tool == 'wallpapers' || saved_tool == 'stickers' || saved_tool == 'emojis') {
			//bringing this back by default gives bad UX
			saved_tool = null;
		}
		if (saved_tool != null) {
			this.active_tool = saved_tool;
		}

		//left menu
		for (var i in config.TOOLS) {
			var item = config.TOOLS[i];
			if(item.title)
				var title = item.title;
			else
				var title = this.Helper.ucfirst(item.name).replace(/_/, ' ');

			var itemDom = document.createElement('span');
			itemDom.id = item.name;
			itemDom.title = title;
			if (item.name == this.active_tool) {
				itemDom.className = 'item trn active ' + item.name;
			}
			else {
				itemDom.className = 'item trn ' + item.name;
			}
			if(item.visible === false){
				itemDom.style.display = 'none';
			}

			//event
			itemDom.addEventListener('click', function (event) {
				_this.activate_tool(this.id);
			});

			//register
			document.getElementById(target_id).appendChild(itemDom);
		}

		this.show_action_attributes();
		new app.Actions.Activate_tool_action(this.active_tool, true).do();
		this.Base_gui.check_canvas_offset();
	}

	async activate_tool(key) {
		return app.State.do_action(
			new app.Actions.Activate_tool_action(key)
		);
	}

	action_data() {
		for (var i in config.TOOLS) {
			if (config.TOOLS[i].name == this.active_tool)
				return config.TOOLS[i];
		}

		//something wrong - select first tool
		this.active_tool = config.TOOLS[0].name;
		return config.TOOLS[0];
	}

	/**
	 * used strings: 
	 * "Fill", "Square", "Circle", "Radial", "Anti aliasing", "Circle", "Strict", "Burn"
	 */
	show_action_attributes() {
		var _this = this;
		var target_id = "action_attributes";

		const itemContainer = document.getElementById(target_id);

		itemContainer.innerHTML = "";

		const attributes = this.action_data().attributes;

		let itemDom;
		let currentButtonGroup = null;
		for (var k in attributes) {
			var item = attributes[k];

			var title = k[0].toUpperCase() + k.slice(1);
			title = title.replace("_", " ");

			if (typeof item == 'object' && typeof item.value == 'boolean' && item.icon) {
				if (currentButtonGroup == null) {
					currentButtonGroup = document.createElement('div');
					currentButtonGroup.className = 'ui_button_group no_wrap';
					itemDom = document.createElement('div');
					itemDom.className = 'item ' + k;
					itemContainer.appendChild(itemDom);
					itemDom.appendChild(currentButtonGroup);
				} else {
					itemDom.classList.add(k);
				}
			} else {
				itemDom = document.createElement('div');
				itemDom.className = 'item ' + k;
				itemContainer.appendChild(itemDom);
				currentButtonGroup = null;
			}

			if (typeof item == 'boolean' || (typeof item == 'object' && typeof item.value == 'boolean')) {
				//boolean - true, false

				let value = item;
				let icon = null;
				if (typeof item == 'object') {
					value = item.value;
					if (item.icon) {
						icon = item.icon;
					}
				}

				const element = document.createElement('button');
				element.className = 'trn';
				element.type = 'button';
				element.id = k;
				element.innerHTML = title;
				element.setAttribute('aria-pressed', value);
				if (icon) {
					element.classList.add('ui_icon_button');
					element.classList.add('input_height');
					element.innerHTML = icon;
					element.title = k;
					element.innerHTML = '<img style="width:16px;height:16px;" alt="'+title+'" src="images/icons/'+icon+'" />';
				} else {
					element.classList.add('ui_toggle_button');
				}
				//event
				element.addEventListener('click', (event) => {
					//toggle boolean
					var new_value = element.getAttribute('aria-pressed') !== 'true';
					const actionData = this.action_data();
					const attributes = actionData.attributes;
					const id = event.target.closest('button').id;
					if (typeof attributes[id] === 'object') {
						attributes[id].value = new_value;
					} else {
						attributes[id] = new_value;
					}
					element.setAttribute('aria-pressed', new_value);
					if (actionData.on_update != undefined) {
						//send event
						var moduleKey = actionData.name;
						var functionName = actionData.on_update;
						this.tools_modules[moduleKey].object[functionName]({ key: id, value: new_value });
					}
				});

				if (currentButtonGroup) {
					currentButtonGroup.appendChild(element);
				} else {
					itemDom.appendChild(element);
				}
			}
			else if (typeof item == 'number' || (typeof item == 'object' && typeof item.value == 'number')) {
				//numbers
				let min = 1;
				let max = k === 'power' ? 100 : 999;
				let value = item;
				let step = null;
				if (typeof item == 'object') {
					value = item.value;
					if (item.min != null) {
						min = item.min;
					}
					if (item.max != null) {
						max = item.max;
					}
					if (item.step != null) {
						step = item.step;
					}
				}

				var elementTitle = document.createElement('label');
				elementTitle.innerHTML = title + ':';
				elementTitle.id = 'attribute_label_' + k;
				elementTitle.className = 'trn';

				const elementInput = document.createElement('input');
				elementInput.type = 'number';
				elementInput.setAttribute('aria-labelledby', 'attribute_label_' + k);
				const $numberInput = $(elementInput)
					.uiNumberInput({
						id: k,
						min,
						max,
						value,
						step: step || 1,
						exponentialStepButtons: !step
					})
					.on('input', () => {
						let value = $numberInput.uiNumberInput('get_value');
						const id = $numberInput.uiNumberInput('get_id');
						const actionData = this.action_data();
						const attributes = actionData.attributes;
						if (typeof attributes[id] === 'object') {
							attributes[id].value = value;
						} else {
							attributes[id] = value;
						}

						if (actionData.on_update != undefined) {
							//send event
							var moduleKey = actionData.name;
							var functionName = actionData.on_update;
							this.tools_modules[moduleKey].object[functionName]({ key: id, value: value });
						}
					});

				itemDom.appendChild(elementTitle);
				itemDom.appendChild($numberInput[0]);
			}
			else if (typeof item == 'object') {
				//select

				var elementTitle = document.createElement('label');
				elementTitle.innerHTML = title + ':';
				elementTitle.for = k;
				elementTitle.className = 'trn';

				var selectList = document.createElement("select");
				selectList.id = k;
				const values = typeof item.values === 'function' ? item.values() : item.values;
				for (let j in values) {
					var option = document.createElement("option");
					if (item.value == values[j]) {
						option.selected = 'selected';
					}
					option.className = 'trn';
					option.name = values[j];
					option.value = values[j];
					option.text = values[j];
					selectList.appendChild(option);
				}
				//event
				selectList.addEventListener('change', (event) => {
					const actionData = this.action_data();
					actionData.attributes[event.target.id].value = event.target.value;

					if (actionData.on_update != undefined) {
						//send event
						var moduleKey = actionData.name;
						var functionName = actionData.on_update;
						const result = this.tools_modules[moduleKey].object[functionName]({ key: event.target.id, value: event.target.value });
						if (result) {
							// Allow the on_update function to modify the attribute value if necessary.
							if (result.new_values) {
								for (let key in result.new_values) {
									actionData.attributes[key].value = result.new_values[key];
								}
							}
						}
					}

					this.show_action_attributes();
				});

				itemDom.appendChild(elementTitle);
				itemDom.appendChild(selectList);
			}
			else if (typeof item == 'string' && item[0] == '#') {
				//color

				var elementTitle = document.createElement('label');
				elementTitle.innerHTML = title + ':';
				elementTitle.for = k;
				elementTitle.className = 'trn';

				var colorInput = document.createElement('input');
				colorInput.type = 'color';
				const $colorInput = $(colorInput)
					.uiColorInput({
						id: k,
						value: item
					})
					.on('change', () => {
						let value = $colorInput.uiColorInput('get_value');
						const id = $colorInput.uiColorInput('get_id');
						const actionData = this.action_data();
						actionData.attributes[id] = value;
						if (actionData.on_update != undefined) {
							//send event
							var moduleKey = actionData.name;
							var functionName = actionData.on_update;
							this.tools_modules[moduleKey].object[functionName]({ key: id, value: value });
						}
					});

				itemDom.appendChild(elementTitle);
				itemDom.appendChild($colorInput[0]);
			}
			else {
				alertify.error('Error: unsupported attribute type:' + typeof item + ', ' + k);
			}
		}

		// Inject Quick Text Effects directly into Top Toolbar when Text tool is active
		if (this.action_data().name === 'text') {
			const effectsDiv = document.createElement('div');
			effectsDiv.className = 'item text_quick_effects';
			effectsDiv.style.cssText = 'display:inline-flex; align-items:center; gap:4px; margin-left:8px;';
			
			const layer = config.layer;
			const isShadow = layer && layer.params && layer.params.shadow;
			const isStroke = layer && layer.params && layer.params.stroke;
			const isGlow = layer && layer.params && layer.params.glow;
			const isBox = layer && layer.params && layer.params.bg_box;

			const activeBtnStyle = 'background:linear-gradient(135deg, rgba(168,85,247,0.5), rgba(56,189,248,0.5)); border:1px solid #a855f7; color:#ffffff; font-weight:700; border-radius:4px; padding:2px 7px; font-size:11px; height:24px; cursor:pointer;';
			const normalBtnStyle = 'background:#1e293b; border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:4px; padding:2px 7px; font-size:11px; height:24px; cursor:pointer;';

			const isEn = config.LANG === 'en';
			const txtShadow = isEn ? 'Shadow' : 'Sombra';
			const txtStroke = isEn ? 'Stroke' : 'Contorno';
			const txtNeon = 'Neon';
			const txtBox = isEn ? 'Banner' : 'Tarja';

			const titleShadow = isEn ? 'Drop Shadow' : 'Sombra Projetada';
			const titleStroke = isEn ? 'Stroke Outline' : 'Contorno';
			const titleNeon = isEn ? 'Neon Glow' : 'Brilho Neon';
			const titleBox = isEn ? 'Highlight Box / Banner' : 'Tarja Fundo / Destaque';

			effectsDiv.innerHTML = `
				<div class="ui_button_group no_wrap" style="display:flex; gap:3px;">
					<button type="button" id="top_btn_text_shadow" title="${titleShadow}" style="${isShadow ? activeBtnStyle : normalBtnStyle}">
						🕶️ ${txtShadow}
					</button>
					<button type="button" id="top_btn_text_stroke" title="${titleStroke}" style="${isStroke ? activeBtnStyle : normalBtnStyle}">
						🎨 ${txtStroke}
					</button>
					<button type="button" id="top_btn_text_glow" title="${titleNeon}" style="${isGlow ? activeBtnStyle : normalBtnStyle}">
						✨ ${txtNeon}
					</button>
					<button type="button" id="top_btn_text_box" title="${titleBox}" style="${isBox ? activeBtnStyle : normalBtnStyle}">
						🏷️ ${txtBox}
					</button>
				</div>
			`;

			itemContainer.appendChild(effectsDiv);

			// Wire click events
			effectsDiv.querySelector('#top_btn_text_shadow').addEventListener('click', () => {
				if (!config.layer || config.layer.type !== 'text') return;
				config.layer.params.shadow = !config.layer.params.shadow;
				if (config.layer.params.shadow) {
					config.layer.params.shadow_color = config.layer.params.shadow_color || 'rgba(0, 0, 0, 0.85)';
					config.layer.params.shadow_blur = config.layer.params.shadow_blur || 10;
					config.layer.params.shadow_x = config.layer.params.shadow_x != null ? config.layer.params.shadow_x : 4;
					config.layer.params.shadow_y = config.layer.params.shadow_y != null ? config.layer.params.shadow_y : 4;
					config.layer.params.glow = false;
					alertify.success('🕶️ Sombra projetada aplicada!');
				} else {
					alertify.message('Sombra desativada');
				}
				if (_this.tools_modules['text'] && _this.tools_modules['text'].object) {
					_this.tools_modules['text'].object.hasValueChanged = true;
				}
				config.need_render = true;
				config.need_render_changed_params = true;
				_this.Base_gui.Base_layers.render();
				_this.show_action_attributes();
				if (app.GUI && app.GUI.GUI_details) app.GUI.GUI_details.render_text(false);
			});

			effectsDiv.querySelector('#top_btn_text_stroke').addEventListener('click', () => {
				if (!config.layer || config.layer.type !== 'text') return;
				config.layer.params.stroke = !config.layer.params.stroke;
				if (config.layer.params.stroke) {
					config.layer.params.stroke_size = config.layer.params.stroke_size || 4;
					config.layer.params.stroke_color = config.layer.params.stroke_color || '#000000';
					alertify.success('🎨 Contorno aplicado!');
				} else {
					alertify.message('Contorno desativado');
				}
				if (_this.tools_modules['text'] && _this.tools_modules['text'].object) {
					_this.tools_modules['text'].object.hasValueChanged = true;
				}
				config.need_render = true;
				config.need_render_changed_params = true;
				_this.Base_gui.Base_layers.render();
				_this.show_action_attributes();
				if (app.GUI && app.GUI.GUI_details) app.GUI.GUI_details.render_text(false);
			});

			effectsDiv.querySelector('#top_btn_text_glow').addEventListener('click', () => {
				if (!config.layer || config.layer.type !== 'text') return;
				config.layer.params.glow = !config.layer.params.glow;
				if (config.layer.params.glow) {
					config.layer.params.glow_color = config.layer.params.glow_color || '#00e5ff';
					config.layer.params.glow_blur = config.layer.params.glow_blur || 18;
					config.layer.params.shadow = false;
					alertify.success('✨ Brilho Neon aplicado!');
				} else {
					alertify.message('Brilho Neon desativado');
				}
				if (_this.tools_modules['text'] && _this.tools_modules['text'].object) {
					_this.tools_modules['text'].object.hasValueChanged = true;
				}
				config.need_render = true;
				config.need_render_changed_params = true;
				_this.Base_gui.Base_layers.render();
				_this.show_action_attributes();
				if (app.GUI && app.GUI.GUI_details) app.GUI.GUI_details.render_text(false);
			});

			effectsDiv.querySelector('#top_btn_text_box').addEventListener('click', () => {
				if (!config.layer || config.layer.type !== 'text') return;
				config.layer.params.bg_box = !config.layer.params.bg_box;
				if (config.layer.params.bg_box) {
					config.layer.params.bg_box_color = config.layer.params.bg_box_color || '#000000';
					config.layer.params.bg_box_padding = config.layer.params.bg_box_padding || 12;
					config.layer.params.bg_box_radius = config.layer.params.bg_box_radius != null ? config.layer.params.bg_box_radius : 8;
					config.layer.params.bg_box_opacity = config.layer.params.bg_box_opacity != null ? config.layer.params.bg_box_opacity : 0.85;
					alertify.success('🏷️ Tarja de destaque aplicada!');
				} else {
					alertify.message('Tarja de destaque desativada');
				}
				if (_this.tools_modules['text'] && _this.tools_modules['text'].object) {
					_this.tools_modules['text'].object.hasValueChanged = true;
				}
				config.need_render = true;
				config.need_render_changed_params = true;
				_this.Base_gui.Base_layers.render();
				_this.show_action_attributes();
				if (app.GUI && app.GUI.GUI_details) app.GUI.GUI_details.render_text(false);
			});
		}

		if (config.LANG != 'en') {
			//retranslate
			this.Tools_translate.translate(config.LANG);
		}
	}

	set_events() {
		document.addEventListener('keydown', (event) => {
			if (this.Helper.is_input(event.target)) return;
			if (event.ctrlKey || event.metaKey || event.altKey) return;

			if (event.key === '[' || event.keyCode === 219) {
				this.adjust_tool_size(-1);
				event.preventDefault();
			} else if (event.key === ']' || event.keyCode === 221) {
				this.adjust_tool_size(1);
				event.preventDefault();
			}
		});
	}

	adjust_tool_size(delta) {
		const actionData = this.action_data();
		if (!actionData || !actionData.attributes) return;

		const attributes = actionData.attributes;
		if (typeof attributes.size === 'undefined') return;

		let currentSize = typeof attributes.size === 'object' ? attributes.size.value : attributes.size;
		let step = delta > 0 ? (currentSize >= 20 ? 5 : 2) : (currentSize > 20 ? -5 : -2);
		if (currentSize <= 3 && delta < 0) step = -1;
		if (currentSize <= 2 && delta > 0) step = 1;

		let newSize = Math.max(1, Math.min(500, currentSize + step));

		if (typeof attributes.size === 'object') {
			attributes.size.value = newSize;
		} else {
			attributes.size = newSize;
		}

		// Update UI input if present
		const numberInput = document.querySelector('#action_attributes input[type="number"]');
		if (numberInput) {
			$(numberInput).uiNumberInput('set_value', newSize);
		}

		if (actionData.on_update != undefined) {
			var moduleKey = actionData.name;
			var functionName = actionData.on_update;
			if (this.tools_modules[moduleKey] && this.tools_modules[moduleKey].object[functionName]) {
				this.tools_modules[moduleKey].object[functionName]({ key: 'size', value: newSize });
			}
		}

		alertify.message(`Tamanho do Pincel: ${newSize}px`, 1);
	}

}

export default GUI_tools_class;
