// main config file

const initialState = {
	TRANSPARENCY: false,
	TRANSPARENCY_TYPE: 'squares', // squares, green, grey
	LANG: 'pt',
	WIDTH: null,
	HEIGHT: null,
	visible_width: null,
	visible_height: null,
	COLOR: '#008000',
	ALPHA: 255,
	ZOOM: 1,
	SNAP: true,
	pixabay_key: '3ca2cd8af3fde33af218bea02-9021417',
	safe_search_can_be_disabled: true,
	google_webfonts_key: 'AIzaSyAC_Tx8RKkvN235fXCUyi_5XhSaRCzNhMg',
	layers: [],
	layer: null,
	need_render: false,
	need_render_changed_params: false, // Set specifically when param change in layer details triggered render
	is_custom_document: true,
	mouse: {},
	mouse_lock: null,
	swatches: {
		default: []
	},
	user_fonts: {},
	guides_enabled: true,
	guides: [],
	ruler_active: false,
	enable_autoresize_by_default: true,
	themes: ['dark', 'light', 'green'],
	FONTS: [
		"Arial", "Courier", "Impact", "Helvetica", "Monospace", "Tahoma", "Times New Roman", "Verdana",
		"Amatic SC", "Arimo", "Codystar", "Creepster", "Indie Flower", "Lato", "Lora", "Merriweather",
		"Monoton", "Montserrat", "Mukta", "Muli", "Nosifer", "Nunito", "Oswald", "Orbitron",
		"Pacifico", "PT Sans", "PT Serif", "Playfair Display", "Poppins", "Raleway", "Roboto",
		"Rubik", "Special Elite", "Tangerine", "Titillium Web", "Ubuntu"
	],
	TOOLS: [
		{
			name: 'select',
			title: 'Select object tool',
			attributes: { auto_select: true },
		},
		{
			name: 'selection',
			attributes: {},
			on_leave: 'on_leave',
		},
		{
			name: 'brush',
			attributes: { size: 4, pressure: false },
		},
		{
			name: 'pencil',
			attributes: { size: 1, pressure: false },
		},
		{
			name: 'pick_color',
			attributes: { global: false },
		},
		{
			name: 'erase',
			on_update: 'on_params_update',
			attributes: { size: 30, circle: true, strict: true },
		},
		{
			name: 'magic_erase',
			title: 'Magic Eraser Tool',
			attributes: { power: 15, anti_aliasing: true, contiguous: false },
		},
		{
			name: 'fill',
			attributes: { power: 5, anti_aliasing: false, contiguous: false },
		},
		{
			name: 'shape',
			on_activate: 'on_activate',
			title: 'Creative Assets (H)',
			attributes: { size: 3 },
		},
		{
			name: 'qrcode',
			on_activate: 'on_activate',
			title: 'QR Code & PIX Generator (Q)',
		},
		{
			name: 'shapes',
			title: 'Geometric Shapes (U)',
			attributes: {
				shape: {
					value: 'rectangle',
					values: ['rectangle', 'ellipse', 'triangle', 'star', 'heart', 'arrow', 'line', 'polygon', 'hexagon', 'callout'],
				},
				border_size: { value: 6, min: 1, max: 100 },
				fill: true,
				fill_color: '#3b82f6',
				border: true,
				border_color: '#1d4ed8',
				radius: { value: 0, min: 0, max: 200 },
			},
		},
		{
			name: 'line',
			visible: false,
			attributes: { border_size: { value: 6, min: 1, max: 100 }, border_color: '#1d4ed8' },
		},
		{
			name: 'arrow',
			visible: false,
			attributes: { border_size: { value: 6, min: 1, max: 100 }, border_color: '#1d4ed8' },
		},
		{
			name: 'rectangle',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
				radius: { value: 0, min: 0 },
				square: false,
			},
		},
		{
			name: 'ellipse',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
				circle: false,
			},
		},
		{
			name: 'media',
			title: 'Search Images',
			on_activate: 'on_activate',
			visible: false,
		},
		{
			name: 'illustrations',
			title: 'Search Illustrations',
			on_activate: 'on_activate',
			visible: false,
		},
		{
			name: 'icons',
			title: 'Search Icons',
			on_activate: 'on_activate',
			visible: false,
		},
		{
			name: 'wallpapers',
			title: 'Search Wallpapers',
			on_activate: 'on_activate',
			visible: false,
		},
		{
			name: 'stickers',
			title: 'Search Stickers',
			on_activate: 'on_activate',
			visible: false,
		},
		{
			name: 'emojis',
			title: 'Search Emojis',
			on_activate: 'on_activate',
			visible: false,
		},
		{
			name: 'triangle',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'right_triangle',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'romb',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'parallelogram',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'trapezoid',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'plus',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'pentagon',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'hexagon',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'star',
			visible: false,
			attributes: {
				border_size: 4,
				corners: 5,
				inner_radius: 40,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'heart',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'cylinder',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'human',
			visible: false,
			attributes: {
				border_size: 4,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'tear',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'cog',
			visible: false,
			attributes: { fill_color: '#555555' },
		},
		{
			name: 'bezier_curve',
			visible: false,
			attributes: { size: 4 },
		},
		{
			name: 'moon',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'callout',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
		{
			name: 'text',
			on_update: 'on_params_update',
			attributes: {
				font: {
					value: 'Arial',
					values() {
						const user_font_names = Object.keys(config.user_fonts);
						return ['', '[Add Font...]', ...Array.from(new Set([...config.FONTS, ...user_font_names].sort()))];
					}
				},
				size: 40,
				bold: { value: false, icon: `bold.svg` },
				italic: { value: false, icon: `italic.svg` },
				underline: { value: false, icon: `underline.svg` },
				strikethrough: { value: false, icon: `strikethrough.svg` },
				fill: '#008800',
				stroke: '#000000',
				stroke_size: { value: 0, min: 0, step: 0.1 },
				kerning: { value: 0, min: -999, max: 999, step: 1 },
				leading: { value: 0, min: -999, max: 999, step: 1 }
			},
		},
		{
			name: 'gradient',
			attributes: {
				color_1: '#008000',
				color_2: '#ffffff',
				alpha: 0,
				radial: false,
				radial_power: 50,
			},
		},
		{
			name: 'clone',
			attributes: {
				size: 30,
				anti_aliasing: true,
				source_layer: { value: 'Current', values: ['Current', 'Previous'] },
			},
		},
		{
			name: 'crop',
			on_update: 'on_params_update',
			on_leave: 'on_leave',
			attributes: { crop: true },
		},
		{
			name: 'blur',
			attributes: { size: 30, strength: 1 },
		},
		{
			name: 'sharpen',
			attributes: { size: 30 },
		},
		{
			name: 'desaturate',
			attributes: { size: 50, anti_aliasing: true },
		},
		{
			name: 'bulge_pinch',
			title: 'Bulge/Pinch Tool',
			attributes: { radius: 80, power: 50, bulge: true },
		},
		{
			name: 'animation',
			on_activate: 'on_activate',
			on_update: 'on_params_update',
			on_leave: 'on_leave',
			attributes: { play: false, delay: 400 },
		},
		{
			name: 'polygon',
			visible: false,
			attributes: {
				border_size: 4,
				border: true,
				fill: true,
				border_color: '#555555',
				fill_color: '#aaaaaa',
			},
		},
	],
};

// Initial tool
initialState.TOOL = initialState.TOOLS[2];

/**
 * State Proxy to handle reactivity and centralize config changes.
 */
const config = new Proxy(initialState, {
	set(target, prop, value) {
		// Log changes for debugging or trigger UI updates
		if (target[prop] !== value) {
			// console.log(`Config ${prop.toString()} changed:`, value);
			target[prop] = value;

			// If need_render is set to true, we could automatically trigger a global render here
			// if (prop === 'need_render' && value === true) {
			//    app.GUI.render();
			// }
		}
		return true;
	},
	get(target, prop) {
		return target[prop];
	}
});

export default config;