import app from './../../app.js';
import config from './../../config.js';
import Dialog_class from './../../libs/popup.js';
import Base_layers_class from './../../core/base-layers.js';
import Helper_class from './../../libs/helpers.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

class AI_Tools_class {

	constructor() {
		this.POP = new Dialog_class();
		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();
		// The PHP endpoints are located in the main directory
		this.baseUrl = ''; 
	}

	init_credits_system() {
		this.update_credits_ui();
		this.sync_credits();

		// Bind events to upper menu bar elements
		setTimeout(() => {
			const badge = document.getElementById('unified-credits-badge');
			const loginBtn = document.getElementById('unified-login-btn');

			if (badge) {
				badge.onclick = () => {
					if (localStorage.getItem('keepai_token')) {
						this.show_payment_modal();
					} else {
						this.show_login_modal();
					}
				};
			}

			if (loginBtn) {
				loginBtn.onclick = () => {
					if (localStorage.getItem('keepai_token')) {
						if (confirm("Deseja sair do ecossistema 4uLabs (Keep AI)?")) {
							localStorage.removeItem('keepai_token');
							window.location.reload();
						}
					} else {
						this.show_login_modal();
					}
				};
			}
		}, 1000);
	}

	async sync_credits() {
		const token = localStorage.getItem('keepai_token');
		if (!token) {
			this.update_credits_ui();
			return;
		}

		try {
			const resp = await fetch('../keepai/api/auth.php', {
				method: 'GET',
				headers: { 'Authorization': 'Bearer ' + token }
			});
			if (resp.ok) {
				const data = await resp.json();
				if (data.success && data.user) {
					this.unifiedCredits = parseInt(data.user.credits);
					this.update_credits_ui(data.user.display_name);
				}
			} else {
				// Expired or invalid token
				localStorage.removeItem('keepai_token');
				this.update_credits_ui();
			}
		} catch (err) {
			console.error("Erro ao sincronizar créditos unificados:", err);
		}
	}

	update_credits_ui(displayName = '') {
		const textEl = document.getElementById('unified-credits-text');
		const btnEl = document.getElementById('unified-login-btn');
		const badgeEl = document.getElementById('unified-credits-badge');
		const token = localStorage.getItem('keepai_token');

		if (!textEl || !btnEl) return;

		if (token) {
			textEl.textContent = this.unifiedCredits + ' cr';
			btnEl.textContent = displayName ? displayName.split(' ')[0] : ((config.LANG === 'en') ? 'Sign out' : 'Sair');
			btnEl.style.color = '#ef4444';
			btnEl.style.background = 'rgba(239, 68, 68, 0.15)';
			btnEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
			if (badgeEl) {
				badgeEl.style.background = 'linear-gradient(135deg, #a855f7, #6366f1)';
				badgeEl.style.boxShadow = '0 0 10px rgba(168, 85, 247, 0.4)';
			}
		} else {
			textEl.textContent = (config.LANG === 'en') ? 'No Login' : 'Sem Login';
			btnEl.textContent = (config.LANG === 'en') ? 'Login' : 'Entrar';
			btnEl.style.color = '#a855f7';
			btnEl.style.background = 'rgba(168, 85, 247, 0.15)';
			btnEl.style.borderColor = 'rgba(168, 85, 247, 0.3)';
			if (badgeEl) {
				badgeEl.style.background = '#475569';
				badgeEl.style.boxShadow = 'none';
			}
		}
	}

	check_and_use_credit() {
		const token = localStorage.getItem('keepai_token');
		if (!token) {
			alertify.error('Autenticação necessária. Por favor, faça login para usar a Inteligência Artificial.');
			this.show_login_modal();
			return false;
		}

		if (this.unifiedCredits > 0) {
			return true;
		}

		alertify.error('Saldo insuficiente de créditos IA. Por favor, faça uma recarga.');
		this.show_payment_modal();
		return false;
	}

	show_login_modal() {
		let _this = this;
		var settings = {
			title: 'Entrar com Conta Google',
			className: 'auth-popup',
			params: [
				{
					html: `
						<div id="auth-container" style="color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 10px 5px; text-align: center; max-width: 380px; margin: 0 auto;">
							<div style="font-size: 42px; margin-bottom: 10px; filter: drop-shadow(0 2px 8px rgba(250, 204, 21, 0.5));">✨</div>
							<h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">Autenticação Unificada — 4U.IA.BR</h3>
							<p style="margin: 0 0 22px 0; font-size: 13px; color: #e2e8f0; line-height: 1.6;">
								Conecte sua <strong style="color: #ffffff; font-weight: 700;">Conta Google</strong> para acessar as Ferramentas de Inteligência Artificial e sincronizar seus créditos em todos os nossos aplicativos.
							</p>

							<!-- Botão Oficial Google Login com Alto Contraste -->
							<button type="button" id="btn-google-login" style="width: 100%; height: 48px; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 10px; color: #1e293b; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); transition: all 0.2s ease;">
								<svg viewBox="0 0 24 24" width="22" height="22" style="flex-shrink: 0;">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
								</svg>
								<span>Entrar com Conta Google</span>
							</button>

							<!-- Card Informativo de Alto Contraste -->
							<div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 14px 16px; text-align: left; font-size: 12px; color: #f1f5f9; line-height: 1.7; box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);">
								<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: #38bdf8; font-weight: 700; font-size: 13px;">
									<span>🔒</span> <span>Autenticação Oficial Google OAuth 2.0</span>
								</div>
								<div style="color: #cbd5e1; margin-bottom: 4px;"><strong style="color: #22c55e;">✓</strong> Acesso rápido e seguro sem senhas</div>
								<div style="color: #cbd5e1; margin-bottom: 4px;"><strong style="color: #22c55e;">✓</strong> Saldo unificado entre PhotoClone, Keep AI e DocScan</div>
								<div style="color: #cbd5e1;"><strong style="color: #22c55e;">✓</strong> 100% seguro com proteção total de dados</div>
							</div>
						</div>
					`
				}
			],
			on_load: function(params, popInstance) {
				setTimeout(() => {
					// Oculta botões padrão de "Ok / Cancel" e força alto contraste no popup
					const popupEl = document.querySelector('.popup') || (popInstance && popInstance.el);
					if (popupEl) {
						popupEl.classList.add('auth-popup');
						popupEl.style.setProperty('background', '#0f172a', 'important');
						popupEl.style.setProperty('background-color', '#0f172a', 'important');
						popupEl.style.setProperty('border', '1px solid #334155', 'important');
						popupEl.style.setProperty('border-radius', '14px', 'important');
						popupEl.style.setProperty('box-shadow', '0 25px 65px -10px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.15)', 'important');
						const headerEl = popupEl.querySelector('h2');
						if (headerEl) {
							headerEl.style.setProperty('background', '#1e293b', 'important');
							headerEl.style.setProperty('background-color', '#1e293b', 'important');
							headerEl.style.setProperty('color', '#ffffff', 'important');
							headerEl.style.setProperty('border-bottom', '1px solid #334155', 'important');
						}
						const closeBtn = popupEl.querySelector('.close');
						if (closeBtn) {
							closeBtn.style.setProperty('color', '#ffffff', 'important');
							closeBtn.style.setProperty('opacity', '0.9', 'important');
						}
						const buttonsArea = popupEl.querySelector('.buttons');
						if (buttonsArea) buttonsArea.style.display = 'none';
					}

					// Login com Google (Google Identity Services)
					const btnGoogle = document.getElementById('btn-google-login');
					if (btnGoogle) {
						btnGoogle.onclick = () => {
							if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
								alertify.error('Google Identity Services ainda não inicializou. Aguarde alguns instantes.');
								return;
							}
							btnGoogle.style.opacity = '0.7';
							btnGoogle.innerHTML = '<span>Conectando com o Google...</span>';
							const client = google.accounts.oauth2.initTokenClient({
								client_id: '569266864432-pd09jbb5no9ekdhdr018fj643nopp817.apps.googleusercontent.com',
								scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
								callback: async (response) => {
									if (response && response.access_token) {
										try {
											const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
												headers: { Authorization: `Bearer ${response.access_token}` }
											});
											const googleUser = await res.json();
											
											const authResp = await fetch('../keepai/api/auth.php?action=google', {
												method: 'POST',
												headers: { 'Content-Type': 'application/json' },
												body: JSON.stringify({
													email: googleUser.email,
													name: googleUser.name,
													picture: googleUser.picture
												})
											});
											const authData = await authResp.json();
											if (authData.success && authData.token) {
												localStorage.setItem('keepai_token', authData.token);
												alertify.success(`Conectado como ${authData.user.display_name}!`);
												_this.POP.hide(false);
												_this.sync_credits();
											} else {
												alertify.error(authData.error || 'Erro ao autenticar com o Google.');
												_this.show_login_modal();
											}
										} catch (err) {
											console.error(err);
											alertify.error('Falha de conexão com o servidor de autenticação.');
											_this.show_login_modal();
										}
									} else {
										_this.show_login_modal();
									}
								}
							});
							client.requestAccessToken();
						};
					}
				}, 100);
			}
		};
		this.POP.show(settings);
	}

	show_payment_modal() {
		let _this = this;
		var settings = {
			title: 'Adquirir Créditos de IA (Mercado Pago)',
			on_cancel: function() {
				if(window.currentPixPoll) {
					clearInterval(window.currentPixPoll);
					window.currentPixPoll = null;
				}
			},
			params: [
				{
					title: "Seus créditos:",
					html: `
						<div id="unified-payment-modal" style="color: #f1f5f9; font-family: sans-serif; font-size: 13px;">
							<p style="margin-bottom: 12px; color: #94a3b8;">
								Seus créditos IA são compartilhados entre Keep AI, SafeWork Pro e PhotoClone! Escolha um dos pacotes abaixo para recarregar.
							</p>
							
							<div id="pix-selector-container">
								<div class="pkg-card" data-index="0" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.4); padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s;">
									<div>
										<strong style="color: #fff; font-size: 14px;">10 Créditos de IA</strong><br>
										<span style="color: #a855f7; font-size: 11px;">Ideal para edições rápidas</span>
									</div>
									<strong style="color: #a855f7; font-size: 15px;">R$ 4,90</strong>
								</div>
								<div class="pkg-card" data-index="1" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.4); padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s;">
									<div>
										<strong style="color: #fff; font-size: 14px;">50 Créditos de IA</strong><br>
										<span style="color: #a855f7; font-size: 11px;">Melhor custo-benefício</span>
									</div>
									<strong style="color: #a855f7; font-size: 15px;">R$ 19,90</strong>
								</div>
								<div class="pkg-card" data-index="2" style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.4); padding: 12px; border-radius: 8px; margin-bottom: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s;">
									<div>
										<strong style="color: #fff; font-size: 14px;">100 Créditos de IA</strong><br>
										<span style="color: #a855f7; font-size: 11px;">Para uso profissional frequente</span>
									</div>
									<strong style="color: #a855f7; font-size: 15px;">R$ 34,90</strong>
								</div>
							</div>
							
							<div id="pix-display-container" style="display: none;"></div>
						</div>
					`
				}
			],
			on_load: function(params) {
				setTimeout(() => {
					const pkgCards = document.querySelectorAll('#pix-selector-container .pkg-card');
					const displayContainer = document.getElementById('pix-display-container');
					const selectorContainer = document.getElementById('pix-selector-container');

					pkgCards.forEach(card => {
						card.onclick = async () => {
							const index = card.getAttribute('data-index');
							
							selectorContainer.style.display = 'none';
							displayContainer.style.display = 'block';
							displayContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Gerando código PIX unificado...</p>';

							try {
								const resp = await fetch('../keepai/api/mp_create.php', {
									method: 'POST',
									headers: { 
										'Content-Type': 'application/json',
										'Authorization': 'Bearer ' + localStorage.getItem('keepai_token')
									},
									body: JSON.stringify({ package_index: parseInt(index) })
								});
								const data = await resp.json();

								if (data.qr_code_base64) {
									displayContainer.innerHTML = `
										<div style="text-align:center;">
											<p style="margin-bottom:10px; font-weight:bold; color:#a855f7;">Pacote: ${data.label} (R$ ${data.amount_brl.toFixed(2)})</p>
											<img src="data:image/jpeg;base64,${data.qr_code_base64}" style="width: 180px; height: 180px; border-radius: 8px; border: 2px solid #a855f7;" /><br>
											<label style="display:block; font-size:11px; color:#94a3b8; margin-top:10px; text-align:left;">Chave Copia e Cola:</label>
											<textarea id="pix-copy-key" style="width: 100%; height: 50px; background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; font-size:11px; padding:5px; margin-top:4px;" readonly>${data.qr_code}</textarea><br>
											<button type="button" id="btn-copy-pix" style="width: 100%; height: 32px; background:rgba(168,85,247,0.2); border:1px solid rgba(168,85,247,0.5); color:#a855f7; border-radius:6px; font-weight:bold; cursor:pointer; margin-top:8px;">Copiar Chave PIX</button>
											<p style="margin-top:15px; font-weight:bold; color:#22c55e; display:flex; align-items:center; justify-content:center; gap:6px;">
												<span class="pulse-dot" style="display:inline-block; width:8px; height:8px; background:#22c55e; border-radius:50%; animation: pulse 1.5s infinite;"></span>
												Aguardando confirmação do pagamento...
											</p>
										</div>
										<style>
											@keyframes pulse {
												0% { transform: scale(0.9); opacity: 0.6; }
												50% { transform: scale(1.3); opacity: 1; }
												100% { transform: scale(0.9); opacity: 0.6; }
											}
										</style>
									`;

									const btnCopy = document.getElementById('btn-copy-pix');
									if (btnCopy) {
										btnCopy.onclick = () => {
											const copyText = document.getElementById('pix-copy-key');
											copyText.select();
											document.execCommand('copy');
											alertify.success('Código PIX copiado!');
										};
									}

									// Polling do saldo central no Keep AI
									const startCredits = _this.unifiedCredits;
									const pollId = setInterval(async () => {
										try {
											const checkResp = await fetch('../keepai/api/credits.php', {
												method: 'GET',
												headers: { 'Authorization': 'Bearer ' + localStorage.getItem('keepai_token') }
											});
											if (checkResp.ok) {
												const checkData = await checkResp.json();
												if (checkData.credits > startCredits) {
													clearInterval(pollId);
													_this.unifiedCredits = checkData.credits;
													_this.update_credits_ui();
													alertify.success('Recarga Concluída! ' + (checkData.credits - startCredits) + ' créditos adicionados.');
													_this.POP.hide(false);
												}
											}
										} catch (err) {
											console.error("Erro no polling de créditos:", err);
										}
									}, 3000);

									// Salva o pollId para limpar caso fechem o popup
									window.currentPixPoll = pollId;

								} else {
									displayContainer.innerHTML = '<p style="color:red; text-align:center;">Erro ao gerar PIX: ' + (data.error || 'Resposta inválida') + '</p>';
								}
							} catch (err) {
								displayContainer.innerHTML = '<p style="color:red; text-align:center;">Erro de rede ao gerar PIX.</p>';
							}
						};
					});
				}, 100);
			}
		};

		this.POP.show(settings);
	}

	consume_credit(newBalance) {
		this.unifiedCredits = newBalance;
		this.update_credits_ui();
		alertify.success(`Operação bem-sucedida! Créditos IA restantes: ${newBalance}`);
	}

	/**
	 * Remover Fundo (AI)
	 */
	async remover_fundo_ai() {
		const layer = config.layer;
		if (!layer) {
			alertify.error('Selecione uma camada primeiro.');
			return;
		}

		if (!this.check_and_use_credit()) {
			return;
		}

		alertify.success('IA: Solicitando remoção de fundo (Replicate)...');
		
		try {
			const dataURL = this.Base_layers.convert_layer_to_canvas(layer.id, true).toDataURL('image/png');
			
			const response = await fetch(this.baseUrl + 'remove-bg.php', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + (localStorage.getItem('keepai_token') || '')
				},
				body: JSON.stringify({ image: dataURL })
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Erro na API');
			}

			if (result.output) {
				this.consume_credit(result.credits_remaining);
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => {
					this.addNewLayerFromImage(img, layer.name + ' - No BG');
					alertify.success('Fundo removido com sucesso!');
				};
				img.src = result.output;
			} else {
				throw new Error('Nenhum dado retornado.');
			}

		} catch (err) {
			console.error(err);
			alertify.error('Erro na IA: ' + err.message);
		}
	}

	/**
	 * Remover Fundo por Cor (Clique)
	 */
	remover_fundo_cor() {
		const layer = config.layer;
		if (!layer) {
			alertify.error('Selecione uma camada primeiro.');
			return;
		}

		alertify.message('Modo Manual: Clique na cor da imagem para torná-la transparente.');

		const canvas = document.getElementById('canvas_minipaint');
		const clickHandler = (e) => {
			canvas.removeEventListener('mousedown', clickHandler);
			
			const mouse = app.Tools.get_mouse_info(e);
			
			// Position relative to layer
			const lx = Math.round(mouse.x - layer.x);
			const ly = Math.round(mouse.y - layer.y);

			if (lx < 0 || lx >= layer.width || ly < 0 || ly >= layer.height) {
				alertify.error('Clique fora da área da imagem.');
				return;
			}

			// Get color at point
			const layerCanvas = this.Base_layers.convert_layer_to_canvas(layer.id, true);
			const ctx = layerCanvas.getContext('2d');
			const pixel = ctx.getImageData(lx, ly, 1, 1).data;
			const targetColor = { r: pixel[0], g: pixel[1], b: pixel[2] };

			this.apply_color_to_alpha(targetColor);
		};

		canvas.addEventListener('mousedown', clickHandler);
	}

	apply_color_to_alpha(color) {
		const layer = config.layer;
		const canvas = this.Base_layers.convert_layer_to_canvas(layer.id, true);
		const ctx = canvas.getContext('2d');
		const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imgData.data;

		// Tolerance factor
		const tolerance = 40;

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i+1];
			const b = data[i+2];

			const diff = Math.sqrt(
				Math.pow(r - color.r, 2) + 
				Math.pow(g - color.g, 2) + 
				Math.pow(b - color.b, 2)
			);

			if (diff < tolerance) {
				data[i+3] = 0; // Alpha to 0
			}
		}

		ctx.putImageData(imgData, 0, 0);
		app.State.do_action(new app.Actions.Update_layer_image_action(canvas));
		alertify.success('Fundo removido com base na cor selecionada.');
	}

	/**
	 * Colorizar (AI)
	 */
	async colorizar_ai() {
		const layer = config.layer;
		if (!layer) {
			alertify.error('Selecione uma camada primeiro.');
			return;
		}

		if (!this.check_and_use_credit()) {
			return;
		}

		alertify.success('IA: Colorindo imagem (Replicate)...');
		
		try {
			const dataURL = this.Base_layers.convert_layer_to_canvas(layer.id, true).toDataURL('image/png');
			
			const response = await fetch(this.baseUrl + 'colorize.php', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + (localStorage.getItem('keepai_token') || '')
				},
				body: JSON.stringify({ image: dataURL })
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Erro na API');
			}

			if (result.output) {
				this.consume_credit(result.credits_remaining);
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => {
					this.addNewLayerFromImage(img, layer.name + ' - Colorized');
					alertify.success('Colorização concluída!');
				};
				img.src = result.output;
			} else {
				throw new Error('Nenhum dado retornado.');
			}
		} catch (err) {
			console.error(err);
			alertify.error('Erro na IA: ' + err.message);
		}
	}

	/**
	 * Upscale 2x (AI)
	 */
	async upscale_ai() {
		const layer = config.layer;
		if (!layer) {
			alertify.error('Selecione uma camada primeiro.');
			return;
		}

		if (!this.check_and_use_credit()) {
			return;
		}

		alertify.message('IA: Aumentando resolução (Replicate)... Isso pode demorar.');
		
		try {
			const dataURL = this.Base_layers.convert_layer_to_canvas(layer.id, true).toDataURL('image/png');
			
			const response = await fetch(this.baseUrl + 'upscale.php', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + (localStorage.getItem('keepai_token') || '')
				},
				body: JSON.stringify({ image: dataURL })
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Erro na API');
			}

			if (result.output) {
				this.consume_credit(result.credits_remaining);
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => {
					this.addNewLayerFromImage(img, layer.name + ' - 2x');
					alertify.success('Upscale concluído com sucesso!');
				};
				img.src = result.output;
			} else {
				throw new Error('Nenhum dado retornado.');
			}
		} catch (err) {
			console.error(err);
			alertify.error('Erro na IA: ' + err.message);
		}
	}

	addNewLayerFromImage(img, name) {
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = img.width;
		tempCanvas.height = img.height;
		const ctx = tempCanvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		let actions = [];
		
		if (config.layer) {
			// hide original layer
			actions.push(new app.Actions.Toggle_layer_visibility_action(config.layer.id));
		}
		
		actions.push(new app.Actions.Update_config_action({ TRANSPARENCY: true }));
		
		actions.push(new app.Actions.Insert_layer_action({
			name: name,
			type: 'image',
			data: tempCanvas.toDataURL('image/png'),
			width: img.width,
			height: img.height,
			x: config.layer ? config.layer.x : 0,
			y: config.layer ? config.layer.y : 0
		}));

		app.State.do_action(new app.Actions.Bundle_action('Import AI Result', 'Import AI Result', actions));
		
		setTimeout(() => {
			if (app.GUI) app.GUI.render_canvas_background('canvas_minipaint');
		}, 100);
	}
}

export default AI_Tools_class;
