import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Base_layers_class from './../core/base-layers.js';
import GUI_tools_class from './../core/gui/gui-tools.js';
import Base_gui_class from './../core/base-gui.js';
import Base_selection_class from './../core/base-selection.js';
import alertify from './../../../node_modules/alertifyjs/build/alertify.min.js';
import Dialog_class from './../libs/popup.js';

class Crop_class extends Base_tools_class {

	constructor(ctx) {
		super();
		var _this = this;
		this.Base_layers = new Base_layers_class();
		this.Base_gui = new Base_gui_class();
		this.GUI_tools = new GUI_tools_class();
		this.ctx = ctx;
		this.name = 'crop';
		this.type = null;
		this.selection = {
			x: null,
			y: null,
			width: null,
			height: null,
		};
		var sel_config = {
			enable_background: true,
			enable_borders: true,
			enable_controls: true,
			crop_lines: true,
			enable_rotation: false,
			enable_move: true,
			data_function: function () {
				return _this.selection;
			},
		};
		this.mousedown_selection = null;
		this.POP = new Dialog_class();
		this.keyboard_move_start_position = null;
		this.Base_selection = new Base_selection_class(ctx, sel_config, this.name);
	}

	on_activate() {
		if (this.selection.width == null || this.selection.width <= 0 || this.selection.height == null || this.selection.height <= 0) {
			this.selection = {
				x: 0,
				y: 0,
				width: config.WIDTH,
				height: config.HEIGHT,
			};
			config.need_render = true;
		}
	}

	load() {
		this.default_events();
		this.events();
	}

	default_dragStart(event) {
		this.is_mousedown_canvas = false;
		if (config.TOOL.name != this.name)
			return;
		if (!event.target.closest('#main_wrapper'))
			return;
		if (event.target.closest('.canvas_scrollbar'))
			return;
		if (event.button === 1 || event.which === 2)
			return;
		if (app.GUI && app.GUI.GUI_scroll && (app.GUI.GUI_scroll.is_space_pressed || app.GUI.GUI_scroll.is_panning))
			return;

		this.is_mousedown_canvas = true;
		this.mousedown(event);
	}

	mousedown(e) {
		var mouse = this.get_mouse_info(e);
		if (this.Base_selection.is_drag == false || mouse.click_valid == false)
			return;

		this.mousedown_selection = JSON.parse(JSON.stringify(this.selection));

		if (this.Base_selection.mouse_lock !== null) {
			this.type = 'resize';
			return;
		}

		// Se clicou dentro de uma seleção existente, ativa o modo de arrasto/deslocamento
		if (this.selection.width != null && this.selection.height != null
			&& this.selection.width > 0 && this.selection.height > 0
			&& mouse.x >= this.selection.x && mouse.x <= this.selection.x + this.selection.width
			&& mouse.y >= this.selection.y && mouse.y <= this.selection.y + this.selection.height) {
			this.type = 'move';
			return;
		}

		// Caso contrário, cria uma nova seleção
		this.type = 'create';
		this.Base_selection.set_selection(mouse.x, mouse.y, 0, 0);
	}

	mousemove(e) {
		var mouse = this.get_mouse_info(e);
		if (this.Base_selection.is_drag == false || mouse.is_drag == false) {
			return;
		}
		if (e.type == 'mousedown' && mouse.click_valid == false) {
			return;
		}
		if (this.Base_selection.mouse_lock !== null) {
			return;
		}

		if (app.GUI && app.GUI.GUI_scroll && (this.type == 'move' || this.type == 'create')) {
			app.GUI.GUI_scroll.check_edge_autoscroll(e.clientX, e.clientY);
		}

		if (this.type == 'move' && this.mousedown_selection && this.mousedown_selection.width != null) {
			var dx = Math.round(mouse.x - mouse.click_x);
			var dy = Math.round(mouse.y - mouse.click_y);

			var new_x = this.mousedown_selection.x + dx;
			var new_y = this.mousedown_selection.y + dy;

			const snapDist = Math.max(8, 10 / (config.ZOOM || 1));

			// Snapping magnético inteligente nas 4 extremidades
			if (Math.abs(new_x) <= snapDist || new_x < 0) {
				new_x = 0;
			}
			if (Math.abs(new_y) <= snapDist || new_y < 0) {
				new_y = 0;
			}
			if (Math.abs(new_x + this.mousedown_selection.width - config.WIDTH) <= snapDist || new_x + this.mousedown_selection.width > config.WIDTH) {
				new_x = config.WIDTH - this.mousedown_selection.width;
			}
			if (Math.abs(new_y + this.mousedown_selection.height - config.HEIGHT) <= snapDist || new_y + this.mousedown_selection.height > config.HEIGHT) {
				new_y = config.HEIGHT - this.mousedown_selection.height;
			}

			this.Base_selection.set_selection(new_x, new_y, null, null);
			return;
		}

		if (this.type == 'create') {
			var width = mouse.x - mouse.click_x;
			var height = mouse.y - mouse.click_y;
			var start_x = mouse.click_x;
			var start_y = mouse.click_y;

			const snapDist = Math.max(8, 10 / (config.ZOOM || 1));

			// Snapping nas extremidades durante a criação
			if (Math.abs(start_x) <= snapDist || start_x < 0) start_x = 0;
			if (Math.abs(start_y) <= snapDist || start_y < 0) start_y = 0;

			var end_x = start_x + width;
			var end_y = start_y + height;
			if (Math.abs(end_x - config.WIDTH) <= snapDist || end_x > config.WIDTH) end_x = config.WIDTH;
			if (Math.abs(end_y - config.HEIGHT) <= snapDist || end_y > config.HEIGHT) end_y = config.HEIGHT;
			if (Math.abs(end_x) <= snapDist || end_x < 0) end_x = 0;
			if (Math.abs(end_y) <= snapDist || end_y < 0) end_y = 0;

			width = end_x - start_x;
			height = end_y - start_y;
			
			// SHIFT: Trava em proporção 1:1 perfeita (quadrado simétrico estilo Photoshop)
			if (e.shiftKey == true) {
				var size = Math.max(Math.abs(width), Math.abs(height));
				width = (width < 0 ? -1 : 1) * size;
				height = (height < 0 ? -1 : 1) * size;
			}
			else if (e.ctrlKey == true || e.metaKey) {
				// CTRL / CMD: Trava na proporção da imagem / tela original
				var ratio = config.WIDTH / config.HEIGHT;
				var width_new = Math.round(height * ratio);
				var height_new = Math.round(width / ratio);

				if (Math.abs(width * 100 / width_new) > Math.abs(height * 100 / height_new)) {
					height = (width * 100 / width_new > 0) ? height_new : -height_new;
				} else {
					width = (height * 100 / height_new > 0) ? width_new : -width_new;
				}
			}

			// ALT: Expande simetricamente a partir do centro do clique
			if (e.altKey == true) {
				start_x = mouse.click_x - width;
				start_y = mouse.click_y - height;
				width = width * 2;
				height = height * 2;
			}

			this.Base_selection.set_selection(start_x, start_y, width, height);
		}
	}

	mouseup(e) {
		var mouse = this.get_mouse_info(e);

		if (!this.Base_selection.is_drag) {
			return;
		}
		if (e.type == 'mousedown' && mouse.click_valid == false) {
			return;
		}

		if (this.type == 'move') {
			this.type = null;
			if (this.mousedown_selection && this.selection.width != null) {
				if (this.mousedown_selection.x !== this.selection.x || this.mousedown_selection.y !== this.selection.y) {
					app.State.do_action(
						new app.Actions.Set_selection_action(this.selection.x, this.selection.y, this.selection.width, this.selection.height, this.mousedown_selection)
					);
				}
			}
			return;
		}

		var width = mouse.x - this.selection.x;
		var height = mouse.y - this.selection.y;

		if (width == 0 || height == 0) {
			//cancel selection
			this.Base_selection.reset_selection();
			config.need_render = true;
			this.type = null;
			return;
		}

		if (this.selection.width != null) {
			//make sure coords not negative
			var details = this.selection;
			var x = details.x;
			var y = details.y;
			if (details.width < 0) {
				x = x + details.width;
			}
			if (details.height < 0) {
				y = y + details.height;
			}
			this.selection = {
				x: x,
				y: y,
				width: Math.abs(details.width),
				height: Math.abs(details.height),
			};
		}

		//control boundaries
		if (this.selection.x < 0) {
			this.selection.width += this.selection.x;
			this.selection.x = 0;
		}
		if (this.selection.y < 0) {
			this.selection.height += this.selection.y;
			this.selection.y = 0;
		}
		if (this.selection.x + this.selection.width > config.WIDTH) {
			this.selection.width = config.WIDTH - this.selection.x;
		}
		if (this.selection.y + this.selection.height > config.HEIGHT) {
			this.selection.height = config.HEIGHT - this.selection.y;
		}

		app.State.do_action(
			new app.Actions.Set_selection_action(this.selection.x, this.selection.y, this.selection.width, this.selection.height, this.mousedown_selection)
		);
		this.type = null;
	}

	render(ctx, layer) {
		//nothing
	}

	/**
	 * do actual crop
	 */
	async on_params_update() {
		var params = this.getParams();
		var selection = this.selection;
		params.crop = true;
		this.GUI_tools.show_action_attributes();

		if (selection.width == null || selection.width == 0 || selection.height == 0) {
			alertify.error('Empty selection');
			return;
		}
		
		//check for rotation
		var rotated_name = false;
		for (var i in config.layers) {
			var link = config.layers[i];
			if (link.type == null)
				continue;
			
			if(link.rotate > 0){
				rotated_name = link.name;
				break;
			}
		}
		if (rotated_name !== false) {
			alertify.error('Crop on rotated layer is not supported. Convert it to raster to continue.' + '('+ rotated_name + ')');
			return;
		}

		//controll boundaries
		selection.x = Math.max(selection.x, 0);
		selection.y = Math.max(selection.y, 0);
		selection.width = Math.min(selection.width, config.WIDTH);
		selection.height = Math.min(selection.height, config.HEIGHT);

		let actions = [];

		for (var i in config.layers) {
			var link = config.layers[i];
			if (link.type == null)
				continue;

			let x = link.x;
			let y = link.y;
			let width = link.width;
			let height = link.height;
			let width_original = link.width_original;
			let height_original = link.height_original;

			//move
			x -= parseInt(selection.x);
			y -= parseInt(selection.y);

			if (link.type == 'image') {
				//also remove unvisible data
				let left = 0;
				if (x < 0)
					left = -x;
				let top = 0;
				if (y < 0)
					top = -y;
				let right = 0;
				if (x + width > selection.width)
					right = x + width - selection.width;
				let bottom = 0;
				if (y + height > selection.height)
					bottom = y + height - selection.height;
				let crop_width = width - left - right;
				let crop_height = height - top - bottom;

				//if image was streched
				let width_ratio = (width / width_original);
				let height_ratio = (height / height_original);

				//create smaller canvas
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext("2d");
				canvas.width = crop_width / width_ratio;
				canvas.height = crop_height / height_ratio;

				//cut required part
				ctx.translate(-left / width_ratio, -top / height_ratio);
				canvas.getContext("2d").drawImage(link.link, 0, 0);
				ctx.translate(0, 0);
				actions.push(
					new app.Actions.Update_layer_image_action(canvas, link.id)
				);

				//update attributes
				width = Math.ceil(canvas.width * width_ratio);
				height = Math.ceil(canvas.height * height_ratio);
				x += left;
				y += top;
				width_original = canvas.width;
				height_original = canvas.height;
			}

			actions.push(
				new app.Actions.Update_layer_action(link.id, {
					x,
					y,
					width,
					height,
					width_original,
					height_original
				})
			);
		}

		actions.push(
			new app.Actions.Prepare_canvas_action('undo'),
			new app.Actions.Update_config_action({
				WIDTH: parseInt(selection.width),
				HEIGHT: parseInt(selection.height)
			}),
			new app.Actions.Prepare_canvas_action('do'),
			new app.Actions.Reset_selection_action(this.selection)
		);
		await app.State.do_action(
			new app.Actions.Bundle_action('crop_tool', 'Crop Tool', actions)
		);
	}

	events() {
		document.addEventListener('keydown', (event) => {
			if (config.TOOL.name != this.name)
				return;
			if (this.POP && this.POP.get_active_instances && this.POP.get_active_instances() > 0) {
				return;
			}
			if (this.Helper.is_input(event.target))
				return;

			var k = event.key;

			if (k == "ArrowUp") {
				event.preventDefault();
				this.move(0, -1, event);
			}
			else if (k == "ArrowDown") {
				event.preventDefault();
				this.move(0, 1, event);
			}
			else if (k == "ArrowRight") {
				event.preventDefault();
				this.move(1, 0, event);
			}
			else if (k == "ArrowLeft") {
				event.preventDefault();
				this.move(-1, 0, event);
			}
			else if (k == "Enter") {
				event.preventDefault();
				this.on_params_update();
			}
			else if (k == "Escape") {
				event.preventDefault();
				this.Base_selection.reset_selection();
				this.selection.x = null;
				this.selection.y = null;
				this.selection.width = null;
				this.selection.height = null;
				config.need_render = true;
			}
		});

		document.addEventListener('keyup', (event) => {
			if (config.TOOL.name != this.name)
				return;
			if (this.POP && this.POP.get_active_instances && this.POP.get_active_instances() > 0) {
				return;
			}
			if (this.Helper.is_input(event.target))
				return;

			var k = event.key;
			if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) {
				if (this.keyboard_move_start_position) {
					if (this.selection.width != null && (
						this.keyboard_move_start_position.x !== this.selection.x ||
						this.keyboard_move_start_position.y !== this.selection.y ||
						this.keyboard_move_start_position.width !== this.selection.width ||
						this.keyboard_move_start_position.height !== this.selection.height
					)) {
						app.State.do_action(
							new app.Actions.Set_selection_action(
								this.selection.x,
								this.selection.y,
								this.selection.width,
								this.selection.height,
								this.keyboard_move_start_position
							)
						);
					}
					this.keyboard_move_start_position = null;
				}
			}
		});
	}

	move(direction_x, direction_y, event) {
		if (config.TOOL.name != this.name)
			return;
		if (this.Helper.is_input(event.target))
			return;

		if (this.selection.width == null || this.selection.width <= 0 || this.selection.height == null || this.selection.height <= 0) {
			this.selection.x = 0;
			this.selection.y = 0;
			this.selection.width = config.WIDTH;
			this.selection.height = config.HEIGHT;
		}

		if (!this.keyboard_move_start_position) {
			this.keyboard_move_start_position = JSON.parse(JSON.stringify(this.selection));
		}

		// Passo do movimento:
		// Normal: 1px (para máxima precisão nos movimentos)
		// Shift: 10px (deslocamento mais rápido)
		// Ctrl / Meta: 50px
		let step = 1;
		if (event.shiftKey) {
			step = 10;
		} else if (event.ctrlKey || event.metaKey) {
			step = 50;
		}

		if (event.altKey) {
			// ALT + Setas: Redimensiona a área de corte com precisão pixel a pixel
			let new_w = this.selection.width + direction_x * step;
			let new_h = this.selection.height + direction_y * step;

			if (new_w < 5) new_w = 5;
			if (new_h < 5) new_h = 5;
			if (this.selection.x + new_w > config.WIDTH) {
				new_w = config.WIDTH - this.selection.x;
			}
			if (this.selection.y + new_h > config.HEIGHT) {
				new_h = config.HEIGHT - this.selection.y;
			}

			this.Base_selection.set_selection(null, null, new_w, new_h);
		} else {
			// Setas normais: Desloca a caixa de corte mantendo o tamanho
			let new_x = this.selection.x + direction_x * step;
			let new_y = this.selection.y + direction_y * step;

			// Mantém a área de corte dentro dos limites da imagem / tela
			if (new_x < 0) new_x = 0;
			if (new_y < 0) new_y = 0;
			if (new_x + this.selection.width > config.WIDTH) {
				new_x = config.WIDTH - this.selection.width;
			}
			if (new_y + this.selection.height > config.HEIGHT) {
				new_y = config.HEIGHT - this.selection.height;
			}

			this.Base_selection.set_selection(new_x, new_y, null, null);
		}

		config.need_render = true;
	}

	on_leave() {
		this.selection.x = null;
		this.selection.y = null;
		this.selection.width = null;
		this.selection.height = null;
		return [
			new app.Actions.Reset_selection_action()
		];
	}

}

export default Crop_class;
