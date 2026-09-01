import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Base_layers_class from './../core/base-layers.js';
import GUI_tools_class from './../core/gui/gui-tools.js';

var instance = null;

class Shapes_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.Base_layers = new Base_layers_class();
		this.GUI_tools = new GUI_tools_class();
		this.ctx = ctx;
		this.name = 'shapes';
		this.current_subtool = null;

		this.set_events();
	}

	set_events() {
		document.addEventListener('keydown', (event) => {
			var code = event.keyCode;
			if (this.Helper && this.Helper.is_input(event.target))
				return;

			if (code == 85 && !event.ctrlKey && !event.metaKey) {
				// U (Photoshop standard for Shapes)
				this.GUI_tools.activate_tool(this.name);
			}
		}, false);
	}

	load() {
		this.default_events();
	}

	get_active_shape_name() {
		const params = this.getParams();
		let shapeName = 'rectangle';
		if (params && params.shape) {
			shapeName = typeof params.shape === 'object' ? params.shape.value : params.shape;
		}
		return shapeName;
	}

	get_active_subtool() {
		const shapeName = this.get_active_shape_name();
		const tool = this.GUI_tools.tools_modules[shapeName];
		return tool ? tool.object : null;
	}

	get_combined_params() {
		const myParams = this.getParams() || {};
		const border_size = parseInt(typeof myParams.border_size === 'object' ? myParams.border_size.value : myParams.border_size) || 6;
		const fill_color = myParams.fill_color || '#3b82f6';
		const border_color = myParams.border_color || '#1d4ed8';
		const fill = typeof myParams.fill === 'boolean' ? myParams.fill : true;
		const border = typeof myParams.border === 'boolean' ? myParams.border : true;
		const radius = parseInt(typeof myParams.radius === 'object' ? myParams.radius.value : myParams.radius) || 0;

		return {
			...myParams,
			border_size: border_size,
			size: border_size,
			fill: fill,
			fill_color: fill_color,
			border: border,
			border_color: border_color,
			radius: radius,
			corners: 5,
			inner_radius: 40
		};
	}

	mousedown(e) {
		const subtool = this.get_active_subtool();
		if (!subtool) return;

		const combinedParams = this.get_combined_params();

		// Injeta getParams no subtool para que a criação da camada receba todos os parâmetros completos
		subtool.getParams = () => JSON.parse(JSON.stringify(combinedParams));

		if (typeof subtool.mousedown === 'function') {
			subtool.mousedown(e);
			if (config.layer) {
				config.layer.params = JSON.parse(JSON.stringify(combinedParams));
				config.layer.color = combinedParams.fill_color || combinedParams.border_color;
			}
		}
	}

	mousemove(e) {
		const subtool = this.get_active_subtool();
		if (subtool && typeof subtool.mousemove === 'function') {
			subtool.mousemove(e);
		}
	}

	mouseup(e) {
		const subtool = this.get_active_subtool();
		const combinedParams = this.get_combined_params();

		if (config.layer && config.layer.status === 'draft') {
			config.layer.params = JSON.parse(JSON.stringify(combinedParams));
			config.layer.color = combinedParams.fill_color || combinedParams.border_color;
		}

		if (subtool && typeof subtool.mouseup === 'function') {
			subtool.mouseup(e);
			if (config.layer) {
				config.layer.params = JSON.parse(JSON.stringify(combinedParams));
				config.layer.color = combinedParams.fill_color || combinedParams.border_color;
				app.State.do_action(
					new app.Actions.Update_layer_action(config.layer.id, {
						params: config.layer.params,
						color: config.layer.color,
						status: null
					})
				);
			}
		}
	}

	render_overlay(ctx) {
		const subtool = this.get_active_subtool();
		if (subtool && typeof subtool.render_overlay === 'function') {
			subtool.render_overlay(ctx);
		}
	}

}

export default Shapes_class;
