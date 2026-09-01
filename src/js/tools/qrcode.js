import app from './../app.js';
import config from './../config.js';
import Base_tools_class from './../core/base-tools.js';
import Tools_qrcode_class from './../modules/tools/qrcode.js';

var instance = null;

class Qrcode_tool_class extends Base_tools_class {

	constructor(ctx) {
		super();
		if (instance) {
			return instance;
		}
		instance = this;

		this.name = 'qrcode';
		this.Tools_qrcode = new Tools_qrcode_class();

		this.set_events();
	}

	set_events() {
		document.addEventListener('keydown', (event) => {
			var code = event.keyCode;
			if (this.Helper && this.Helper.is_input(event.target))
				return;

			if (code == 81) {
				// Q
				this.on_activate();
			}
		}, false);
	}

	load() {
		//nothing
	}

	render(ctx, layer) {
		//nothing
	}

	on_activate() {
		this.Tools_qrcode.qrcode();
	}

}

export default Qrcode_tool_class;
