import config from './../../config.js';
import zoomView from './../../libs/zoomView.js';
import Helper_class from './../../libs/helpers.js';

var instance = null;

/**
 * GUI class responsible for canvas scrolling, interactive scrollbars,
 * spacebar pan (hand mode), and middle-click pan.
 */
class GUI_scroll_class {

	constructor(GUI_class) {
		if (instance) {
			return instance;
		}
		instance = this;

		this.GUI = GUI_class;
		this.Helper = new Helper_class();

		this.is_space_pressed = false;
		this.is_panning = false;
		this.is_dragging_thumb = null; // 'v' or 'h'
		this.pan_start = { x: 0, y: 0 };
		this.drag_start = { mouse: 0, thumb: 0 };
		this.thumb_v_pos = 0;
		this.thumb_h_pos = 0;
		this.auto_scroll_timer = null;
		this.auto_scroll_speed = { x: 0, y: 0 };

		this.scrollbar_v = null;
		this.scrollbar_h = null;
		this.thumb_v = null;
		this.thumb_h = null;
		this.corner = null;
	}

	init() {
		this.build_dom();
		this.set_events();
		this.update_scrollbars();
	}

	build_dom() {
		const wrapper = document.getElementById('main_wrapper');
		if (!wrapper) return;

		// Check if already injected
		if (document.getElementById('canvas_scrollbar_v')) {
			this.scrollbar_v = document.getElementById('canvas_scrollbar_v');
			this.scrollbar_h = document.getElementById('canvas_scrollbar_h');
			this.thumb_v = document.getElementById('canvas_scrollbar_thumb_v');
			this.thumb_h = document.getElementById('canvas_scrollbar_thumb_h');
			this.corner = document.getElementById('canvas_scrollbar_corner');
			return;
		}

		// Vertical scrollbar
		const sbV = document.createElement('div');
		sbV.className = 'canvas_scrollbar canvas_scrollbar_v';
		sbV.id = 'canvas_scrollbar_v';
		sbV.style.display = 'none';

		const thumbV = document.createElement('div');
		thumbV.className = 'canvas_scrollbar_thumb';
		thumbV.id = 'canvas_scrollbar_thumb_v';
		sbV.appendChild(thumbV);

		// Horizontal scrollbar
		const sbH = document.createElement('div');
		sbH.className = 'canvas_scrollbar canvas_scrollbar_h';
		sbH.id = 'canvas_scrollbar_h';
		sbH.style.display = 'none';

		const thumbH = document.createElement('div');
		thumbH.className = 'canvas_scrollbar_thumb';
		thumbH.id = 'canvas_scrollbar_thumb_h';
		sbH.appendChild(thumbH);

		// Corner spacer
		const corner = document.createElement('div');
		corner.className = 'canvas_scrollbar_corner';
		corner.id = 'canvas_scrollbar_corner';
		corner.style.display = 'none';

		wrapper.appendChild(sbV);
		wrapper.appendChild(sbH);
		wrapper.appendChild(corner);

		this.scrollbar_v = sbV;
		this.scrollbar_h = sbH;
		this.thumb_v = thumbV;
		this.thumb_h = thumbH;
		this.corner = corner;
	}

	set_events() {
		const _this = this;
		const wrapper = document.getElementById('main_wrapper');
		if (!wrapper) return;

		// --- Scrollbar Drag & Click Events ---
		if (this.thumb_v) {
			this.thumb_v.addEventListener('mousedown', function (e) {
				e.stopPropagation();
				e.preventDefault();
				_this.is_dragging_thumb = 'v';
				_this.drag_start.mouse = e.clientY;
				_this.drag_start.thumb = _this.thumb_v_pos;
				_this.thumb_v.classList.add('active');
			});
		}

		if (this.thumb_h) {
			this.thumb_h.addEventListener('mousedown', function (e) {
				e.stopPropagation();
				e.preventDefault();
				_this.is_dragging_thumb = 'h';
				_this.drag_start.mouse = e.clientX;
				_this.drag_start.thumb = _this.thumb_h_pos;
				_this.thumb_h.classList.add('active');
			});
		}

		if (this.scrollbar_v) {
			this.scrollbar_v.addEventListener('mousedown', function (e) {
				if (e.target === _this.thumb_v) return;
				e.stopPropagation();
				e.preventDefault();
				const rect = _this.scrollbar_v.getBoundingClientRect();
				const clickY = e.clientY - rect.top;
				const trackH = _this.scrollbar_v.clientHeight;
				const thumbH = _this.thumb_v.offsetHeight || 30;
				const targetThumbTop = Math.max(0, Math.min(trackH - thumbH, clickY - thumbH / 2));
				const ratioY = (trackH - thumbH > 0) ? targetThumbTop / (trackH - thumbH) : 0;

				const scaledH = config.HEIGHT * config.ZOOM;
				const targetPosY = -ratioY * (scaledH - config.visible_height);
				const moveY = targetPosY - zoomView.getPosition().y;
				zoomView.move(0, moveY);
				config.need_render = true;
				_this.update_scrollbars();
			});
		}

		if (this.scrollbar_h) {
			this.scrollbar_h.addEventListener('mousedown', function (e) {
				if (e.target === _this.thumb_h) return;
				e.stopPropagation();
				e.preventDefault();
				const rect = _this.scrollbar_h.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const trackW = _this.scrollbar_h.clientWidth;
				const thumbW = _this.thumb_h.offsetWidth || 30;
				const targetThumbLeft = Math.max(0, Math.min(trackW - thumbW, clickX - thumbW / 2));
				const ratioX = (trackW - thumbW > 0) ? targetThumbLeft / (trackW - thumbW) : 0;

				const scaledW = config.WIDTH * config.ZOOM;
				const targetPosX = -ratioX * (scaledW - config.visible_width);
				const moveX = targetPosX - zoomView.getPosition().x;
				zoomView.move(moveX, 0);
				config.need_render = true;
				_this.update_scrollbars();
			});
		}

		// Document mousemove for thumb dragging & panning
		document.addEventListener('mousemove', function (e) {
			if (_this.is_dragging_thumb === 'v') {
				e.preventDefault();
				const delta = e.clientY - _this.drag_start.mouse;
				const trackH = _this.scrollbar_v.clientHeight;
				const thumbH = _this.thumb_v.offsetHeight || 30;
				const newTop = Math.max(0, Math.min(trackH - thumbH, _this.drag_start.thumb + delta));
				const ratioY = (trackH - thumbH > 0) ? newTop / (trackH - thumbH) : 0;

				const scaledH = config.HEIGHT * config.ZOOM;
				const targetPosY = -ratioY * (scaledH - config.visible_height);
				const moveY = targetPosY - zoomView.getPosition().y;
				zoomView.move(0, moveY);
				config.need_render = true;
				_this.update_scrollbars();
			} else if (_this.is_dragging_thumb === 'h') {
				e.preventDefault();
				const delta = e.clientX - _this.drag_start.mouse;
				const trackW = _this.scrollbar_h.clientWidth;
				const thumbW = _this.thumb_h.offsetWidth || 30;
				const newLeft = Math.max(0, Math.min(trackW - thumbW, _this.drag_start.thumb + delta));
				const ratioX = (trackW - thumbW > 0) ? newLeft / (trackW - thumbW) : 0;

				const scaledW = config.WIDTH * config.ZOOM;
				const targetPosX = -ratioX * (scaledW - config.visible_width);
				const moveX = targetPosX - zoomView.getPosition().x;
				zoomView.move(moveX, 0);
				config.need_render = true;
				_this.update_scrollbars();
			} else if (_this.is_panning) {
				e.preventDefault();
				const dx = e.clientX - _this.pan_start.x;
				const dy = e.clientY - _this.pan_start.y;
				_this.pan_start.x = e.clientX;
				_this.pan_start.y = e.clientY;
				zoomView.move(dx, dy);
				config.need_render = true;
				_this.update_scrollbars();
			}
		});

		document.addEventListener('mouseup', function (e) {
			if (_this.is_dragging_thumb) {
				if (_this.thumb_v) _this.thumb_v.classList.remove('active');
				if (_this.thumb_h) _this.thumb_h.classList.remove('active');
				_this.is_dragging_thumb = null;
			}
			if (_this.is_panning) {
				_this.is_panning = false;
				if (_this.is_space_pressed) {
					wrapper.style.cursor = 'grab';
				} else {
					_this.restore_cursor();
				}
			}
		});

		// --- Spacebar Panning (Hand mode) ---
		document.addEventListener('keydown', function (e) {
			if (_this.Helper.is_input(e.target)) return;

			if (e.code === 'Space' || e.key === ' ') {
				if (!_this.is_space_pressed) {
					_this.is_space_pressed = true;
					if (!_this.is_panning) {
						wrapper.style.cursor = 'grab';
					}
				}
				e.preventDefault();
			}
		});

		document.addEventListener('keyup', function (e) {
			if (_this.Helper.is_input(e.target)) return;

			if (e.code === 'Space' || e.key === ' ') {
				_this.is_space_pressed = false;
				if (!_this.is_panning) {
					_this.restore_cursor();
				}
			}
		});

		// Panning mousedown on main_wrapper (Space + Left click or Middle click)
		wrapper.addEventListener('mousedown', function (e) {
			// Don't intercept clicks on scrollbars
			if (e.target.closest('.canvas_scrollbar')) return;

			const isMiddleClick = (e.button === 1 || e.which === 2);
			const isSpaceClick = (_this.is_space_pressed && (e.button === 0 || e.which === 1));

			if (isMiddleClick || isSpaceClick) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				_this.is_panning = true;
				_this.pan_start = { x: e.clientX, y: e.clientY };
				wrapper.style.cursor = 'grabbing';
			}
		}, true); // Capture phase to prevent other tools from stealing the drag
	}

	restore_cursor() {
		const wrapper = document.getElementById('main_wrapper');
		if (!wrapper) return;
		const defaultCursor = config.TOOL && config.TOOL.name === 'text' ? 'text' : 'default';
		wrapper.style.cursor = defaultCursor;
	}

	update_scrollbars() {
		if (!this.scrollbar_v || !this.scrollbar_h) return;

		const scaledW = Math.round(config.WIDTH * config.ZOOM);
		const scaledH = Math.round(config.HEIGHT * config.ZOOM);
		const visibleW = config.visible_width;
		const visibleH = config.visible_height;

		const canScrollX = scaledW > visibleW;
		const canScrollY = scaledH > visibleH;

		const pos = zoomView.getPosition();

		// Update Horizontal Scrollbar
		if (canScrollX) {
			this.scrollbar_h.style.display = 'block';
			if (canScrollY) {
				this.scrollbar_h.style.right = '14px';
			} else {
				this.scrollbar_h.style.right = '0px';
			}

			const trackW = this.scrollbar_h.clientWidth;
			const thumbW = Math.max(24, Math.round((visibleW / scaledW) * trackW));
			const maxScrollX = scaledW - visibleW;
			const ratioX = maxScrollX > 0 ? Math.max(0, Math.min(1, (-pos.x) / maxScrollX)) : 0;
			const thumbLeft = Math.round(ratioX * (trackW - thumbW));

			this.thumb_h_pos = thumbLeft;
			this.thumb_h.style.width = thumbW + 'px';
			this.thumb_h.style.transform = `translateX(${thumbLeft}px)`;
		} else {
			this.scrollbar_h.style.display = 'none';
		}

		// Update Vertical Scrollbar
		if (canScrollY) {
			this.scrollbar_v.style.display = 'block';
			if (canScrollX) {
				this.scrollbar_v.style.bottom = '14px';
			} else {
				this.scrollbar_v.style.bottom = '0px';
			}

			const trackH = this.scrollbar_v.clientHeight;
			const thumbH = Math.max(24, Math.round((visibleH / scaledH) * trackH));
			const maxScrollY = scaledH - visibleH;
			const ratioY = maxScrollY > 0 ? Math.max(0, Math.min(1, (-pos.y) / maxScrollY)) : 0;
			const thumbTop = Math.round(ratioY * (trackH - thumbH));

			this.thumb_v_pos = thumbTop;
			this.thumb_v.style.height = thumbH + 'px';
			this.thumb_v.style.transform = `translateY(${thumbTop}px)`;
		} else {
			this.scrollbar_v.style.display = 'none';
		}

		// Corner spacer
		if (canScrollX && canScrollY) {
			if (this.corner) this.corner.style.display = 'block';
		} else {
			if (this.corner) this.corner.style.display = 'none';
		}
	}

	/**
	 * Smooth auto-scroll when user drags near viewport edges.
	 * @param {number} clientX
	 * @param {number} clientY
	 */
	check_edge_autoscroll(clientX, clientY) {
		const wrapper = document.getElementById('main_wrapper');
		if (!wrapper) return;

		const rect = wrapper.getBoundingClientRect();
		const margin = 35;
		let speedX = 0;
		let speedY = 0;

		const scaledW = config.WIDTH * config.ZOOM;
		const scaledH = config.HEIGHT * config.ZOOM;
		const canScrollX = scaledW > config.visible_width;
		const canScrollY = scaledH > config.visible_height;

		if (canScrollX) {
			if (clientX < rect.left + margin) {
				speedX = Math.min(18, Math.max(4, Math.round((rect.left + margin - clientX) * 0.6)));
			} else if (clientX > rect.right - margin) {
				speedX = -Math.min(18, Math.max(4, Math.round((clientX - (rect.right - margin)) * 0.6)));
			}
		}

		if (canScrollY) {
			if (clientY < rect.top + margin) {
				speedY = Math.min(18, Math.max(4, Math.round((rect.top + margin - clientY) * 0.6)));
			} else if (clientY > rect.bottom - margin) {
				speedY = -Math.min(18, Math.max(4, Math.round((clientY - (rect.bottom - margin)) * 0.6)));
			}
		}

		if (speedX !== 0 || speedY !== 0) {
			zoomView.move(speedX, speedY);
			config.need_render = true;
			this.update_scrollbars();
		}
	}

}

export default GUI_scroll_class;
