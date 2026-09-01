/*
 * PhotoClone - https://github.com/viliusle/PhotoClone
 * author: Vilius L.
 */

import config from './../../config.js';
import menuDefinition from './../../config-menu.js';
import Tools_translate_class from './../../modules/tools/translate.js';

/**
 * class responsible for rendering main menu
 */
class GUI_menu_class {

	constructor() {
		this.eventSubscriptions = {};
		this.dropdownMaxHeightMargin = 15;
		this.menuContainer = null;
		this.menuBarNode = null;
		this.lastFocusedMenuBarLink = 0;
		this.dropdownStack = [];

		this.Tools_translate = new Tools_translate_class();
	}

	render_main() {
		this.menuContainer = document.getElementById('main_menu');

		let menuTemplate = '<ul class="menu_bar" role="menubar" tabindex="0">';
		for (let i = 0; i < menuDefinition.length; i++) {
			const item = menuDefinition[i];
			menuTemplate += this.generate_menu_bar_item_template(item, i);
		}
		
		// Add premium-looking unified credits badge, language switcher, PWA install button and login button
		const isEn = config.LANG === 'en';
		const txtInstall = isEn ? 'Install App' : 'Instalar App';
		const txtLogin = isEn ? 'Login' : 'Entrar';
		const txtLoading = isEn ? 'Loading...' : 'Carregando...';

		menuTemplate += `
			<li class="user-credits-menu-item" style="margin-left: auto; display: flex; align-items: center; padding-right: 15px; user-select: none; gap: 8px;">
				<div class="lang-switch-container" style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 2px; gap: 2px;">
					<button id="header-lang-pt-btn" type="button" style="padding: 2px 7px; font-size: 10px; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; background: ${config.LANG === 'pt' ? '#3b82f6' : 'transparent'}; color: ${config.LANG === 'pt' ? '#ffffff' : '#94a3b8'}; transition: all 0.15s ease;" title="Português do Brasil">PT</button>
					<button id="header-lang-en-btn" type="button" style="padding: 2px 7px; font-size: 10px; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; background: ${config.LANG === 'en' ? '#3b82f6' : 'transparent'}; color: ${config.LANG === 'en' ? '#ffffff' : '#94a3b8'}; transition: all 0.15s ease;" title="English">EN</button>
				</div>
				<button id="pwa-install-header-btn" type="button" style="display: flex; align-items: center; gap: 5px; font-size: 11px; color: #38bdf8; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); padding: 3px 9px; border-radius: 6px; font-weight: 700; cursor: pointer; transition: all 0.2s ease;" title="${isEn ? 'Install PhotoClone Pro on desktop or mobile' : 'Instalar PhotoClone Pro no seu computador ou celular'}">
					<span>📲</span> <span id="pwa-install-text">${txtInstall}</span>
				</button>
				<div id="unified-credits-badge" style="cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 11px; color: #fff; background: linear-gradient(135deg, #a855f7, #6366f1); padding: 4px 10px; border-radius: 20px; font-weight: bold; box-shadow: 0 0 10px rgba(168, 85, 247, 0.4); transition: transform 0.2s;">
					💎 <span id="unified-credits-text">${txtLoading}</span>
				</div>
				<a id="unified-login-btn" href="javascript:void(0)" style="font-size: 11px; color: #a855f7; text-decoration: none; font-weight: bold; background: rgba(168, 85, 247, 0.15); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(168, 85, 247, 0.3); line-height: 1.2;">${txtLogin}</a>
			</li>
		`;

		menuTemplate += '</ul>';

		this.menuContainer.innerHTML = menuTemplate;
		this.menuBarNode = this.menuContainer.querySelector('[role="menubar"]');

		this.init_pwa_installer();
		this.init_language_switcher();

		this.menuContainer.addEventListener('click', (event) => { return this.on_click_menu(event); }, true);
		this.menuContainer.addEventListener('keydown', (event) => { return this.on_key_down_menu(event); }, true);
		this.menuBarNode.addEventListener('focus', (event) => { return this.on_focus_menu_bar(event); });
		this.menuBarNode.addEventListener('blur', (event) => { return this.on_blur_menu_bar(event); });
		this.menuBarNode.querySelectorAll('a').forEach((link) => {
			link.addEventListener('focus', (event) => { return this.on_focus_menu_bar_link(event); });
		});
		document.body.addEventListener('mousedown', (event) => { return this.on_mouse_down_body(event); }, true);
		document.body.addEventListener('touchstart', (event) => { return this.on_mouse_down_body(event); }, true);
		window.addEventListener('resize', (event) => { return this.on_resize_window(event); }, true);
		
		document.body.classList.add('loaded');
		
		if (config.LANG != 'en') {
			this.Tools_translate.translate(config.LANG, this.menuContainer);
		}
	}

	init_pwa_installer() {
		let deferredPrompt = null;
		const installBtn = document.getElementById('pwa-install-header-btn');
		if (!installBtn) return;

		// If running in standalone mode already
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
		if (isStandalone) {
			installBtn.style.display = 'none';
			return;
		}

		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			installBtn.style.display = 'flex';
		});

		window.addEventListener('appinstalled', () => {
			installBtn.style.display = 'none';
			deferredPrompt = null;
		});

		installBtn.addEventListener('click', async () => {
			if (deferredPrompt) {
				deferredPrompt.prompt();
				const { outcome } = await deferredPrompt.userChoice;
				if (outcome === 'accepted') {
					installBtn.style.display = 'none';
				}
				deferredPrompt = null;
			} else {
				const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
				let msg = '<strong>Instale o PhotoClone Pro para acessar offline direto da sua área de trabalho:</strong><br><br>';
				if (isSafari) {
					msg += '1. Toque no botão de <strong>Compartilhar</strong> (quadrado com seta).<br>2. Escolha <strong>"Adicionar à Tela de Início"</strong>.';
				} else {
					msg += '1. Clique no ícone de <strong>instalação</strong> (computador com seta para baixo) na barra de endereços do seu navegador.<br>2. Ou clique nos <strong>3 pontinhos do menu</strong> do navegador e selecione <strong>"Instalar PhotoClone Pro"</strong>.';
				}
				import('../../../../node_modules/alertifyjs/build/alertify.min.js').then(a => {
					a.default.alert('📲 Instalar Aplicativo', msg);
				});
			}
		});
	}

	init_language_switcher() {
		const btnPt = document.getElementById('header-lang-pt-btn');
		const btnEn = document.getElementById('header-lang-en-btn');
		if (!btnPt || !btnEn) return;

		const currentLang = config.LANG || localStorage.getItem('photoclone_lang') || 'pt';
		if (currentLang === 'en') {
			btnEn.style.background = '#3b82f6';
			btnEn.style.color = '#ffffff';
			btnPt.style.background = 'transparent';
			btnPt.style.color = '#94a3b8';
		} else {
			btnPt.style.background = '#3b82f6';
			btnPt.style.color = '#ffffff';
			btnEn.style.background = 'transparent';
			btnEn.style.color = '#94a3b8';
		}

		btnPt.addEventListener('click', (e) => {
			e.stopPropagation();
			document.cookie = 'language=pt; path=/; max-age=31536000';
			localStorage.setItem('photoclone_lang', 'pt');
			config.LANG = 'pt';
			location.reload();
		});

		btnEn.addEventListener('click', (e) => {
			e.stopPropagation();
			document.cookie = 'language=en; path=/; max-age=31536000';
			localStorage.setItem('photoclone_lang', 'en');
			config.LANG = 'en';
			location.reload();
		});
	}

	on(eventName, callback) {
		if (!this.eventSubscriptions[eventName]) {
			this.eventSubscriptions[eventName] = [];
		}
		if (!this.eventSubscriptions[eventName].includes(callback)) {
			this.eventSubscriptions[eventName].push(callback);
		}
	}

	emit(eventName, payload, object) {
		if (this.eventSubscriptions[eventName]) {
			for (let callback of this.eventSubscriptions[eventName]) {
				callback(payload, object);
			}
		}
	}

	generate_menu_bar_item_template(definition, index) {
		const hasChildren = !!definition.children;
		return `
			<li>
				<a id="main_menu_0_${index}" role="menuitem" tabindex="-1" aria-haspopup="${hasChildren}" aria-expanded="false"
					href="${ definition.href ? definition.href : 'javascript:void(0)' }"
					target="${ definition.href ? '_blank' : '_self' }"
					data-level="0" data-index="${ index }"><span class="name trn">${ definition.name }</span></a>
			</li>
		`.trim();
	}

	generate_menu_dropdown_item_template(definition, level, index) {
		if (definition.divider) {
			return `
				<li role="presentation">
					<hr>
				</li>
			`.trim();
		} else {
			return `
				<li>
					<a id="main_menu_${ level }_${ index }" role="menuitem" tabindex="-1" aria-haspopup="${ (!!definition.children) + '' }"
						href="${ definition.href ? definition.href : 'javascript:void(0)' }"
						target="${ definition.href ? '_blank' : '_self' }"
						data-level="${ level }" data-index="${ index }">
						<span class="name"><span class="trn">${ definition.name }</span>${ definition.ellipsis ? ' ...' : '' }</span>
						${ !!definition.shortcut ? `
							<span class="shortcut"><span class="sr_only">Shortcut Key:</span> ${ definition.shortcut }</span>
						` : `` }
					</a>
				</li>
			`.trim();
		}
	}

	on_mouse_down_body(event) {
		const target = event.touches && event.touches.length > 0 ? event.touches[0].target : event.target;

		// Clicked outside of menu; close dropdowns.
		if (target && !this.menuContainer.contains(target)) {
			this.close_child_dropdowns(0);
		}
	}

	on_focus_menu_bar(event) {
		if (document.activeElement === this.menuBarNode) {
			let lastFocusedLink = this.menuBarNode.querySelector(`[data-index="${ this.lastFocusedMenuBarLink }"]`);
			if (!lastFocusedLink) {
				lastFocusedLink = this.menuBarNode.querySelector('a');
			}
			lastFocusedLink.focus();
		}
	}

	on_focus_menu_bar_link(event) {
		this.lastFocusedMenuBarLink = parseInt(event.target.getAttribute('data-index'), 10) || 0;
	}

	on_blur_menu_bar(event) {
		// TODO
	}

	on_key_down_menu(event) {
		const key = event.key;
		const activeElement = document.activeElement;

		if (activeElement && activeElement.tagName === 'A') {
			const linkLevel = parseInt(activeElement.getAttribute('data-level'), 10) || 0;
			const linkIndex = parseInt(activeElement.getAttribute('data-index'), 10) || 0;
			const menuParent = activeElement.closest('ul');
			if (linkLevel === 0) {
				if (['Right', 'ArrowRight'].includes(event.key)) {
					let nextLink = menuParent.querySelector(`[data-index="${ linkIndex + 1 }"]`);
					if (!nextLink) {
						nextLink = menuParent.querySelector(`[data-index="0"]`);
					}
					nextLink.focus();
				}
				else if (['Left', 'ArrowLeft'].includes(event.key)) {
					let previousLink = menuParent.querySelector(`[data-index="${ linkIndex - 1 }"]`);
					if (!previousLink) {
						previousLink = menuParent.querySelector(`[data-index="${ menuParent.querySelectorAll('[data-index]').length - 1 }"]`);
					}
					previousLink.focus();
				}
				else if (['Down', 'ArrowDown'].includes(event.key)) {
					if (activeElement.getAttribute('aria-haspopup') === 'true') {
						event.preventDefault();
						activeElement.click();
					}
				}
				else if (event.key === 'Home') {
					menuParent.querySelector(`[data-index="0"]`).focus();
				}
				else if (event.key === 'End') {
					menuParent.querySelector(`[data-index="${ menuParent.querySelectorAll('[data-index]').length - 1 }"]`).focus();
				}
				else if ([' ', 'Enter'].includes(event.key)) {
					event.preventDefault();
					activeElement.click();
				}
			} else {
				if (['Up', 'ArrowUp'].includes(event.key)) {
					event.preventDefault();
					let previousLink = menuParent.querySelector(`[data-index="${ linkIndex - 1 }"]`);
					if (!previousLink) {
						previousLink = menuParent.querySelector(`[data-index="${ linkIndex - 2 }"]`); // Skip dividers
					}
					if (!previousLink) {
						previousLink = menuParent.querySelector(`[data-index="${ this.dropdownStack[linkLevel - 1].children.length - 1 }"]`);
					}
					previousLink.focus();
				}
				else if (['Down', 'ArrowDown'].includes(event.key)) {
					event.preventDefault();
					let nextLink = menuParent.querySelector(`[data-index="${ linkIndex + 1 }"]`);
					if (!nextLink) {
						nextLink = menuParent.querySelector(`[data-index="${ linkIndex + 2 }"]`); // Skip dividers
					}
					if (!nextLink) {
						nextLink = menuParent.querySelector(`[data-index="0"]`);
					}
					nextLink.focus();
				}
				else if (['Right', 'ArrowRight'].includes(event.key)) {
					if (activeElement.getAttribute('aria-haspopup') === 'true') {
						activeElement.click();
					}
					else if (this.dropdownStack.length > 1) {
						const opener = this.dropdownStack[linkLevel - 1].opener;
						opener.click();
						opener.focus();
					}
					else {
						const menuBarLinkIndex = parseInt(this.dropdownStack[0].opener.getAttribute('data-index'), 10) || 0;
						let nextLink = this.menuBarNode.querySelector(`[data-index="${ menuBarLinkIndex + 1 }"]`);
						if (!nextLink) {
							nextLink = this.menuBarNode.querySelector(`[data-index="0"]`);
						}
						nextLink.click();
					}
				}
				else if (['Left', 'ArrowLeft'].includes(event.key)) {
					if (this.dropdownStack.length > 1) {
						const opener = this.dropdownStack[linkLevel - 1].opener;
						opener.click();
						opener.focus();
					} else {
						const menuBarLinkIndex = parseInt(this.dropdownStack[0].opener.getAttribute('data-index'), 10) || 0;
						let previousLink = this.menuBarNode.querySelector(`[data-index="${ menuBarLinkIndex - 1 }"]`);
						if (!previousLink) {
							previousLink = this.menuBarNode.querySelector(`[data-index="${ this.menuBarNode.querySelectorAll('[data-index]').length - 1 }"]`);
						}
						previousLink.click();
					}
				}
				else if (event.key === 'Home') {
					menuParent.querySelector(`[data-index="0"]`).focus();
				}
				else if (event.key === 'End') {
					menuParent.querySelector(`[data-index="${ this.dropdownStack[linkLevel - 1].children.length - 1 }"]`).focus();
				}
				else if ([' ', 'Enter'].includes(event.key)) {
					event.preventDefault();
					activeElement.click();
				}
				else if (['Esc', 'Escape'].includes(event.key)) {
					const opener = this.dropdownStack[linkLevel - 1].opener;
					opener.click();
					opener.focus();
				}
				else if (event.key === 'Tab') {
					this.close_child_dropdowns(0);
				}
			}
		}
	}

	on_click_menu(event) {
		const target = event.target.closest('a');

		// Any link in the menu is clicked.
		if (target && target.tagName === 'A') {
			const hasPopup = target.getAttribute('aria-haspopup') === 'true';			
			if (hasPopup) {
				this.toggle_dropdown(target, event.isTrusted);
			} else {
				const href = target.getAttribute('href');
				if (href && href !== 'javascript:void(0)') {
					event.preventDefault();
					event.stopPropagation();
					window.open(href, '_blank');
					this.close_child_dropdowns(0);
					return;
				}
				this.trigger_link(target);
			}
		} else {
			this.close_child_dropdowns(0);
		}
	}

	on_resize_window(event) {
		if (this.dropdownStack.length > 0) {
			this.position_dropdowns();
		}
	}

	toggle_dropdown(opener, isTrusted) {
		const linkLevel = parseInt(opener.getAttribute('data-level'), 10) || 0;
		const linkIndex = parseInt(opener.getAttribute('data-index'), 10) || 0;
		if (opener.getAttribute('aria-expanded') === 'true') {
			this.close_child_dropdowns(linkLevel);
		} else {
			const parentList = opener.closest('ul');
			parentList.querySelectorAll('a').forEach((item) => {
				item.setAttribute('aria-expanded', 'false');
			});
			opener.setAttribute('aria-expanded', true);
			this.create_dropdown(opener, linkLevel, linkIndex, !isTrusted);
		}
	}

	trigger_link(link) {
		const level = parseInt(link.getAttribute('data-level'), 10) || 0;
		const index = parseInt(link.getAttribute('data-index'), 10) || 0;

		// Find link definition
		let children = menuDefinition;
		for (let i = 0; i < level; i++) {
			const childIndex = this.dropdownStack[i] != null ? this.dropdownStack[i].index : index;
			children = children[childIndex].children;
		}
		let definition = children[index];

		// Close the dropdown
		this.close_child_dropdowns(0);

		// Emit callback events for triggered links
		if (definition.target) {
			this.emit('select_target', definition.target, definition);
		}
		else if (definition.href) {
			this.emit('select_href', definition.href, null);
		}
	}

	close_child_dropdowns(level) {
		for (let i = this.dropdownStack.length - 1; i >= 0; i--) {
			if (i >= level) {
				this.dropdownStack[i].element.parentNode.removeChild(this.dropdownStack[i].element);
				this.dropdownStack[i].opener.setAttribute('aria-expanded', false);
			}
		}
		this.dropdownStack = this.dropdownStack.slice(0, level);
	}

	create_dropdown(opener, level, index, focusAfterCreation) {
		this.close_child_dropdowns(level);

		// Find child list in the menu definition
		let children = menuDefinition;
		for (let i = 0; i <= level; i++) {
			const childIndex = this.dropdownStack[i] != null ? this.dropdownStack[i].index : index;
			children = children[childIndex].children;
		}

		// Create the dropdown element, place it in DOM & position it
		let dropdownElement = document.createElement('ul');
		dropdownElement.className = 'menu_dropdown';
		dropdownElement.role = 'menu';
		dropdownElement.tabIndex = 0;
		dropdownElement.setAttribute('aria-labelledby', 'main_menu_' + level + '_' + index);
		let dropdownTemplate = '';
		for (let i = 0; i < children.length; i++) {
			dropdownTemplate += this.generate_menu_dropdown_item_template(children[i], level + 1, i);
		}
		dropdownElement.innerHTML = dropdownTemplate;

		this.menuContainer.appendChild(dropdownElement);

		if (config.LANG != 'en') {
			this.Tools_translate.translate(config.LANG, this.menuContainer);
		}

		if (focusAfterCreation) {
			dropdownElement.querySelector('a').focus();
		}

		this.dropdownStack.push({
			children,
			opener,
			index,
			element: dropdownElement
		});

		this.position_dropdowns();
	}

	position_dropdowns() {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

		let topNavHeight = 0;
		for (let level = 0; level < this.dropdownStack.length; level++) {
			const dropdownElement = this.dropdownStack[level].element;
			const openerRect = this.dropdownStack[level].opener.getBoundingClientRect();

			topNavHeight = openerRect.height;
			const dropdownMaxHeight = vh - topNavHeight - this.dropdownMaxHeightMargin;
			dropdownElement.style.maxHeight = dropdownMaxHeight + 'px';
			const dropdownRect = dropdownElement.getBoundingClientRect();

			if (level === 0) {
				dropdownElement.style.top = (openerRect.y + openerRect.height) + 'px';

				let left = openerRect.x;
				if (left + dropdownRect.width > vw) {
					left = openerRect.x + openerRect.width - dropdownRect.width;
				}
				if (left + dropdownRect.width > vw) {
					left = vw - dropdownRect.width;
				}
				if (left < 0) {
					left = 0;
				}
				dropdownElement.style.left = left + 'px';
			} else {
				let top = openerRect.y;
				if (top + dropdownRect.height > vh - this.dropdownMaxHeightMargin) {
					top = vh - this.dropdownMaxHeightMargin - dropdownRect.height;
				}
				dropdownElement.style.top = top + 'px';

				let left = openerRect.x + openerRect.width + 1;
				if (left + dropdownRect.width > vw) {
					left = openerRect.x - dropdownRect.width - 1;
				}
				if (left < 0) {
					if (openerRect.x + (openerRect.width / 2) > vw / 2) {
						left = 1;
					} else {
						left = vw - dropdownRect.width - 1;
						if (left < 0) {
							left = 1;
						}
					}
				}
				dropdownElement.style.left = left + 'px';
			}
		}
	}

}

export default GUI_menu_class;
