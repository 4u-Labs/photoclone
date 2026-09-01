import app from './../../app.js';
import config from './../../config.js';
import Base_tools_class from './../../core/base-tools.js';
import Base_layers_class from './../../core/base-layers.js';

class Triangle_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Base_layers = new Base_layers_class();
		this.ctx = ctx;
		this.name = 'triangle';
		this.layer = {};
		this.best_ratio = 2 / Math.sqrt(3);
		this.snap_line_info = {x: null, y: null};
		this.coords = [
			[50, 0],
			[100, 100],
			[0, 100],
			[50, 0],
		];
	}

	load() {
		this.default_events();
	}

	mousedown(e) {
		this.shape_mousedown(e);
	}

	mousemove(e) {
		this.shape_mousemove(e);
	}

	mouseup(e) {
		this.shape_mouseup(e);
	}

	render_overlay(ctx){
		var ctx = this.Base_layers.ctx;
		this.render_overlay_parent(ctx);
	}

	demo(ctx, x, y, width, height) {
		this.draw_shape(ctx, x, y, width, height, this.coords);
	}

	render(ctx, layer) {
		var params = layer.params || {};
		var fill = typeof params.fill === 'boolean' ? params.fill : true;
		var border = typeof params.border === 'boolean' ? params.border : true;
		var fill_color = params.fill_color || layer.color || '#3b82f6';
		var border_color = params.border_color || '#1d4ed8';
		var border_size = parseInt(params.border_size || params.size || 4);
		if (isNaN(border_size) || border_size < 1) border_size = 4;

		ctx.save();

		//set styles
		ctx.strokeStyle = 'transparent';
		ctx.fillStyle = 'transparent';
		if (border) ctx.strokeStyle = border_color;
		if (fill) ctx.fillStyle = fill_color;
		ctx.lineWidth = border_size;

		//draw with rotation support
		ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
		ctx.rotate(((layer.rotate || 0) * Math.PI) / 180);
		this.draw_shape(ctx, -layer.width / 2, -layer.height / 2, layer.width, layer.height, this.coords, false);

		ctx.restore();
	}

}

export default Triangle_class;
