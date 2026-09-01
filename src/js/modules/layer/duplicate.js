import app from './../../app.js';
import config from './../../config.js';
import Base_layers_class from './../../core/base-layers.js';
import Helper_class from './../../libs/helpers.js';

var instance = null;

class Layer_duplicate_class {

	constructor() {
		//singleton
		if (instance) {
			return instance;
		}
		instance = this;

		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();

		this.set_events();
	}

	set_events() {
		document.addEventListener('keydown', (event) => {
			var code = event.keyCode;
			if (this.Helper.is_input(event.target))
				return;

			// Ctrl + J or Cmd + J (Photoshop standard)
			if ((event.ctrlKey || event.metaKey) && (code == 74 || event.key === 'j' || event.key === 'J')) {
				event.preventDefault();
				this.duplicate();
			}
			else if (code == 68 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
				// D - duplicate (legacy single key)
				this.duplicate();
				event.preventDefault();
			}
		}, false);
	}

	async duplicate(offset = 10) {
		if (!config.layer) return null;

		var params = JSON.parse(JSON.stringify(config.layer));
		delete params.id;
		delete params.order;

		// Generate name
		var name_number = params.name.match(/^(.*) #([0-9]+)$/);
		if (name_number == null) {
			// First duplicate
			params.name = params.name + " #2";
		}
		else {
			// Nth duplicate - name like "query #17"
			params.name = name_number[1] + " #" + (parseInt(name_number[2]) + 1);
		}

		if (offset > 0 && (params.x != 0 || params.y != 0 || params.width != config.WIDTH || params.height != config.HEIGHT)) {
			params.x += offset;
			params.y += offset;
		}

		for (var i in params) {
			// Remove private attributes
			if (i[0] == '_')
				delete params[i];
		}

		if (params.type == 'image' && config.layer.link) {
			// Image
			params.link = config.layer.link.cloneNode(true);
		}

		await app.State.do_action(
			new app.Actions.Bundle_action('duplicate_layer', 'Duplicate Layer', [
				new app.Actions.Insert_layer_action(params)
			])
		);

		return config.layer;
	}

}

export default Layer_duplicate_class;