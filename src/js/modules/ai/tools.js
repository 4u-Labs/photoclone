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
			title: 'Autenticação Unificada - 4uLabs',
			params: [
				{
					title: "Fazer Login / Cadastrar",
					html: `
						<div id="auth-container" style="color: #f1f5f9; font-family: sans-serif; padding: 5px;">
							<div style="display: flex; border-bottom: 2px solid #334155; margin-bottom: 15px;">
								<button type="button" id="tab-login" style="flex: 1; padding: 10px; background: transparent; border: none; color: #a855f7; font-weight: bold; cursor: pointer; border-bottom: 2px solid #a855f7;">Entrar</button>
								<button type="button" id="tab-register" style="flex: 1; padding: 10px; background: transparent; border: none; color: #94a3b8; font-weight: bold; cursor: pointer;">Cadastrar</button>
							</div>

							<!-- Formulário de Login -->
							<div id="form-login">
								<div style="margin-bottom: 12px;">
									<label style="display: block; font-size: 11px; margin-bottom: 4px; color: #94a3b8;">E-mail</label>
									<input type="email" id="login-email" style="width: 100%; height: 35px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 0 10px; color: #fff; font-size: 13px;" placeholder="seu@email.com">
								</div>
								<div style="margin-bottom: 15px;">
									<label style="display: block; font-size: 11px; margin-bottom: 4px; color: #94a3b8;">Senha</label>
									<input type="password" id="login-password" style="width: 100%; height: 35px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 0 10px; color: #fff; font-size: 13px;" placeholder="Sua senha">
								</div>
								<button type="button" id="btn-submit-login" style="width: 100%; height: 38px; background: linear-gradient(135deg, #a855f7, #6366f1); border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer;">Entrar no Portal</button>
							</div>

							<!-- Formulário de Cadastro -->
							<div id="form-register" style="display: none;">
								<div style="margin-bottom: 12px;">
									<label style="display: block; font-size: 11px; margin-bottom: 4px; color: #94a3b8;">E-mail</label>
									<input type="email" id="reg-email" style="width: 100%; height: 35px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 0 10px; color: #fff; font-size: 13px;" placeholder="seu@email.com">
								</div>
								<div style="margin-bottom: 15px;">
									<label style="display: block; font-size: 11px; margin-bottom: 4px; color: #94a3b8;">Senha (mínimo 6 dígitos)</label>
									<input type="password" id="reg-password" style="width: 100%; height: 35px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 0 10px; color: #fff; font-size: 13px;" placeholder="Crie uma senha segura">
								</div>
								<button type="button" id="btn-submit-register" style="width: 100%; height: 38px; background: linear-gradient(135deg, #a855f7, #6366f1); border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer;">Cadastrar Conta</button>
							</div>
						</div>
					`
				}
			],
			on_load: function(params) {
				setTimeout(() => {
					const tabLogin = document.getElementById('tab-login');
					const tabReg = document.getElementById('tab-register');
					const formLogin = document.getElementById('form-login');
					const formReg = document.getElementById('form-register');

					if (tabLogin && tabReg) {
						tabLogin.onclick = () => {
							tabLogin.style.color = '#a855f7';
							tabLogin.style.borderBottom = '2px solid #a855f7';
							tabReg.style.color = '#94a3b8';
							tabReg.style.borderBottom = 'none';
							formLogin.style.display = 'block';
							formReg.style.display = 'none';
						};

						tabReg.onclick = () => {
							tabReg.style.color = '#a855f7';
							tabReg.style.borderBottom = '2px solid #a855f7';
							tabLogin.style.color = '#94a3b8';
							tabLogin.style.borderBottom = 'none';
							formReg.style.display = 'block';
							formLogin.style.display = 'none';
						};
					}

					// Ações de Autenticação
					const btnLogin = document.getElementById('btn-submit-login');
					if (btnLogin) {
						btnLogin.onclick = async () => {
							const email = document.getElementById('login-email').value;
							const password = document.getElementById('login-password').value;

							if (!email || !password) {
								alertify.error('Preencha todos os campos.');
								return;
							}

							btnLogin.textContent = 'Autenticando...';
							btnLogin.disabled = true;

							try {
								const resp = await fetch('../keepai/api/auth.php?action=login', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ email, password })
								});
								const res = await resp.json();

								if (res.success && res.token) {
									localStorage.setItem('keepai_token', res.token);
									alertify.success('Login efetuado com sucesso!');
									_this.POP.hide(false);
									_this.sync_credits();
								} else {
									alertify.error(res.error || 'E-mail ou senha incorretos.');
									btnLogin.textContent = 'Entrar no Portal';
									btnLogin.disabled = false;
								}
							} catch (e) {
								alertify.error('Erro de conexão com o portal.');
								btnLogin.textContent = 'Entrar no Portal';
								btnLogin.disabled = false;
							}
						};
					}

					const btnReg = document.getElementById('btn-submit-register');
					if (btnReg) {
						btnReg.onclick = async () => {
							const email = document.getElementById('reg-email').value;
							const password = document.getElementById('reg-password').value;

							if (!email || !password) {
								alertify.error('Preencha todos os campos.');
								return;
							}

							btnReg.textContent = 'Processando...';
							btnReg.disabled = true;

							try {
								const resp = await fetch('../keepai/api/auth.php?action=register', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ email, password })
								});
								const res = await resp.json();

								if (res.success && res.token) {
									localStorage.setItem('keepai_token', res.token);
									alertify.success('Conta criada e autenticada com sucesso!');
									_this.POP.hide(false);
									_this.sync_credits();
								} else {
									alertify.error(res.error || 'Erro ao realizar cadastro.');
									btnReg.textContent = 'Cadastrar Conta';
									btnReg.disabled = false;
								}
							} catch (e) {
								alertify.error('Erro de conexão com o portal.');
								btnReg.textContent = 'Cadastrar Conta';
								btnReg.disabled = false;
							}
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
