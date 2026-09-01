import app from './../../app.js';
import config from './../../config.js';
import Base_tools_class from './../../core/base-tools.js';
import Base_layers_class from './../../core/base-layers.js';

class Star_class extends Base_tools_class {

	constructor(ctx) {
		super();
		this.Base_layers = new Base_layers_class();
		this.ctx = ctx;
		this.name = 'star';
		this.layer = {};
		this.best_ratio = 1;
		this.coords = [];
		this.snap_line_info = {x: null, y: null};
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

	generate_coords(spikes, innerRadius) {
		var inner = parseInt(innerRadius || 40) / 2;
		if (isNaN(inner)) inner = 20;
		inner = Math.min(Math.max(inner, 0), 100);

		var count = parseInt(spikes || 5);
		if (isNaN(count) || count < 3) count = 5;

		var outerRadius = 50;
		if (count == 5) {
			outerRadius = 53;
		}

		var cx = 50;
		var cy = 50;
		if (count == 5) {
			cy = 55;
		}

		var rot = Math.PI / 2 * 3;
		var x = cx;
		var y = cy;
		var step = Math.PI / count;
		this.coords = [];
		this.coords.push([cx, cy - outerRadius]);
		for (var i = 0; i < count; i++) {
			x = cx + Math.cos(rot) * outerRadius;
			y = cy + Math.sin(rot) * outerRadius;
			this.coords.push([x, y]);
			rot += step;

			x = cx + Math.cos(rot) * inner;
			y = cy + Math.sin(rot) * inner;
			this.coords.push([x, y]);
			rot += step;
		}
		this.coords.push([cx, cy - outerRadius]);
	}

	demo(ctx, x, y, width, height) {
		this.generate_coords(5, 40);
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
		var corners = parseInt(params.corners || 5);
		if (isNaN(corners) || corners < 3) corners = 5;
		var inner_radius = parseInt(params.inner_radius || 40);
		if (isNaN(inner_radius) || inner_radius < 1) inner_radius = 40;

		this.generate_coords(corners, inner_radius);

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

export default Star_class;
