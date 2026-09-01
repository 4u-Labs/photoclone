import app from './../../app.js';
import config from './../../config.js';
import Base_tools_class from './../../core/base-tools.js';
import Base_layers_class from './../../core/base-layers.js';

class Line_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Base_layers = new Base_layers_class();
		this.ctx = ctx;
		this.name = 'line';
		this.layer = {};
		this.best_ratio = 1;
		this.snap_line_info = {x: null, y: null};
		this.mouse_click = {x: null, y: null};
	}

	load() {
		this.default_events();
	}

	mousedown(e) {
		var mouse = this.get_mouse_info(e);
		if (mouse.click_valid == false)
			return;

		var mouse_x = mouse.x;
		var mouse_y = mouse.y;

		var snap_info = this.calc_snap_position(e, mouse_x, mouse_y);
		if (snap_info != null) {
			if (snap_info.x != null) mouse_x = snap_info.x;
			if (snap_info.y != null) mouse_y = snap_info.y;
		}

		this.mouse_click.x = mouse_x;
		this.mouse_click.y = mouse_y;

		var params = this.clone(this.getParams());
		var color = params.fill_color || params.border_color || config.COLOR || '#3b82f6';

		this.layer = {
			type: this.name,
			params: params,
			status: 'draft',
			render_function: [this.name, 'render'],
			x: Math.round(mouse_x),
			y: Math.round(mouse_y),
			rotate: null,
			is_vector: true,
			color: color
		};
		app.State.do_action(
			new app.Actions.Bundle_action('new_line_layer', 'New Line Layer', [
				new app.Actions.Insert_layer_action(this.layer)
			])
		);
	}

	mousemove(e) {
		var mouse = this.get_mouse_info(e);
		if (mouse.is_drag == false || mouse.click_valid == false)
			return;

		var mouse_x = Math.round(mouse.x);
		var mouse_y = Math.round(mouse.y);

		var snap_info = this.calc_snap_position(e, mouse_x, mouse_y, config.layer.id);
		if (snap_info != null) {
			if (snap_info.x != null) mouse_x = snap_info.x;
			if (snap_info.y != null) mouse_y = snap_info.y;
		}

		var width = mouse_x - this.layer.x;
		var height = mouse_y - this.layer.y;

		if (e.shiftKey == true || e.ctrlKey == true || e.metaKey) {
			var angle = Math.atan2(height, width);
			var dist = Math.sqrt(width * width + height * height);
			var snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
			width = Math.round(dist * Math.cos(snapAngle));
			height = Math.round(dist * Math.sin(snapAngle));
		}

		config.layer.width = width;
		config.layer.height = height;

		this.Base_layers.render();
	}

	mouseup(e) {
		var mouse = this.get_mouse_info(e);
		if (mouse.click_valid == false) {
			config.layer.status = null;
			return;
		}

		var mouse_x = Math.round(mouse.x);
		var mouse_y = Math.round(mouse.y);

		var snap_info = this.calc_snap_position(e, mouse_x, mouse_y, config.layer.id);
		if (snap_info != null) {
			if (snap_info.x != null) mouse_x = snap_info.x;
			if (snap_info.y != null) mouse_y = snap_info.y;
		}
		this.snap_line_info = {x: null, y: null};

		var width = mouse_x - this.layer.x;
		var height = mouse_y - this.layer.y;

		if (width == 0 && height == 0) {
			app.State.scrap_last_action();
			return;
		}

		if (e.shiftKey == true || e.ctrlKey == true || e.metaKey) {
			var angle = Math.atan2(height, width);
			var dist = Math.sqrt(width * width + height * height);
			var snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
			width = Math.round(dist * Math.cos(snapAngle));
			height = Math.round(dist * Math.sin(snapAngle));
		}

		app.State.do_action(
			new app.Actions.Update_layer_action(config.layer.id, {
				width,
				height,
				status: null
			}),
			{ merge_with_history: 'new_line_layer' }
		);
	}

	render_overlay(ctx) {
		var ctx = this.Base_layers.ctx;
		this.render_overlay_parent(ctx);
	}

	demo(ctx, x, y, width, height) {
		ctx.strokeStyle = '#3b82f6';
		ctx.lineWidth = 4;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + width, y + height);
		ctx.stroke();
	}

	render(ctx, layer) {
		if (layer.width == 0 && layer.height == 0)
			return;

		var params = layer.params || {};
		var color = params.fill_color || params.border_color || layer.color || '#3b82f6';
		var size = parseInt(params.border_size || params.size || 6);
		if (isNaN(size) || size < 1) size = 6;

		ctx.save();
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
		ctx.lineCap = 'round';

		var width = layer.x + layer.width;
		var height = layer.y + layer.height;

		ctx.beginPath();
		ctx.moveTo(layer.x, layer.y);
		ctx.lineTo(width, height);
		ctx.stroke();
		ctx.restore();
	}

}

export default Line_class;
