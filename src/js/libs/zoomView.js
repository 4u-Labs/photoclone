//handles zoom and pan
//https://stackoverflow.com/questions/44009094/how-to-bound-image-pan-when-zooming-html-canvas/44015705#44015705
const zoomView = (() => {
	const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
	const invMatrix = [1, 0, 0, 1, 0, 0]; // current inverse view transform
	var m = matrix;  // alias
	var im = invMatrix; // alias
	var scale = 1;   // current scale
	const bounds = {
		top: 0,
		left: 0,
		right: 200,
		bottom: 200,
	};
	var useConstraint = true; // if true then limit pan and zoom to 
	// keep bounds within the current context

	var maxScale = 1;
	const workPoint1 = {x: 0, y: 0};
	const workPoint2 = {x: 0, y: 0};
	const wp1 = workPoint1; // alias
	const wp2 = workPoint2; // alias
	var ctx;
	const pos = {// current position of origin
		x: 0,
		y: 0,
	};
	var dirty = true;
	const API = {
		canvasDefault() {
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		},
		apply() {
			if (dirty) {
				this.update();
			}
			ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
		},
		getPosition() {
			return { x: pos.x, y: pos.y };
		},
		getContext() {
			return ctx;
		},
		getBounds() {
			return bounds;
		},
		getScale() {
			return scale;
		},
		getMaxScale() {
			return maxScale;
		},
		matrix, // expose the matrix
		invMatrix, // expose the inverse matrix
		update() { // call to update transforms
			dirty = false;
			m[3] = m[0] = scale;
			m[1] = m[2] = 0;
			m[4] = pos.x;
			m[5] = pos.y;
			if (useConstraint) {
				this.constrain();
			}
			this.invScale = 1 / scale;
			// calculate the inverse transformation
			var cross = m[0] * m[3] - m[1] * m[2];
			im[0] = m[3] / cross;
			im[1] = -m[1] / cross;
			im[2] = -m[2] / cross;
			im[3] = m[0] / cross;
		},
		constrain() {
			if (!ctx || !ctx.canvas) return;

			var scaledW = (bounds.right - bounds.left) * scale;
			var scaledH = (bounds.bottom - bounds.top) * scale;

			if (scaledW <= ctx.canvas.width) {
				pos.x = 0;
			} else {
				var minX = ctx.canvas.width - scaledW;
				pos.x = Math.max(minX, Math.min(0, pos.x));
			}

			if (scaledH <= ctx.canvas.height) {
				pos.y = 0;
			} else {
				var minY = ctx.canvas.height - scaledH;
				pos.y = Math.max(minY, Math.min(0, pos.y));
			}

			m[4] = pos.x;
			m[5] = pos.y;
		},
		toWorld(from_x, from_y) {  // convert screen to world coords
			var xx, yy;
			var pointW = {};
			if (dirty) {
				this.update();
			}
			xx = from_x - m[4];
			yy = from_y - m[5];
			pointW.x = xx * im[0] + yy * im[2];
			pointW.y = xx * im[1] + yy * im[3];
			return pointW;
		},
		toScreen(from, point = {}){  // convert world coords to screen coords
			if (dirty) {
				this.update();
			}
			point.x = from.x * m[0] + from.y * m[2] + m[4];
			point.y = from.x * m[1] + from.y * m[3] + m[5];
			return point;
		},
		scaleAt(x_from, y_from, amount) { // at in screen coords
			if (dirty) {
				this.update();
			}
			scale *= amount;
			pos.x = x_from - (x_from - pos.x) * amount;
			pos.y = y_from - (y_from - pos.y) * amount;
			dirty = true;
		},
		move(move_x, move_y) {  // move is in screen coords
			pos.x += move_x;
			pos.y += move_y;
			dirty = true;
		},
		setContext(context) {
			ctx = context;
			dirty = true;
		},
		setBounds(top, left, right, bottom) {
			bounds.top = top;
			bounds.left = left;
			bounds.right = right;
			bounds.bottom = bottom;
			useConstraint = true;
			dirty = true;
		},
		reset() {
			scale = 1;
			pos.x = 0;
			pos.y = 0;
			m[0] = 1;
			m[1] = 0;
			m[2] = 0;
			m[3] = 1;
			m[4] = 0;
			m[5] = 0;
			dirty = true;
		}
	};
	return API;
})();

export default zoomView;