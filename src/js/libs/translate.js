/**
 * Vanilla JS Translate library
 */
class Translate {
	constructor(options = {}) {
		this.settings = {
			css: "trn",
			attrs: ["alt", "placeholder", "title"],
			lang: "en",
			t: {},
			...options
		};
		if (!this.settings.css.startsWith('.')) {
			this.settings.css = "." + this.settings.css;
		}
	}

	lang(l) {
		if (l) {
			this.settings.lang = l;
			this.translate();
		}
		return this.settings.lang;
	}

	get(index) {
		try {
			let res = this.settings.t[index] ? this.settings.t[index][this.settings.lang] : null;
			if (!res && typeof index === 'string' && index.includes('&amp;')) {
				const unescaped = index.replace(/&amp;/g, '&');
				res = this.settings.t[unescaped] ? this.settings.t[unescaped][this.settings.lang] : null;
			}
			return res || index;
		} catch (err) {
			return index;
		}
	}

	g(index) {
		return this.get(index);
	}

	translate(element = document.body) {
		const targets = element.querySelectorAll(this.settings.css);
		targets.forEach(el => {
			// Handle content
			let trn_key = el.getAttribute("data-trn-key");
			if (!trn_key) {
				trn_key = el.innerHTML;
				el.setAttribute("data-trn-key", trn_key);
			}
			el.innerHTML = this.get(trn_key);

			// Handle attributes
			this.settings.attrs.forEach(attr => {
				if (el.hasAttribute(attr)) {
					let trn_attr_key = el.getAttribute(`data-trn-attr-${attr}`);
					if (!trn_attr_key) {
						trn_attr_key = el.getAttribute(attr);
						el.setAttribute(`data-trn-attr-${attr}`, trn_attr_key);
					}
					el.setAttribute(attr, this.get(trn_attr_key));
				}
			});
		});
	}
}

export default Translate;
