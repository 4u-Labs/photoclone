import app from './../../app.js';
import config from './../../config.js';
import Base_layers_class from './../../core/base-layers.js';
import Helper_class from './../../libs/helpers.js';
import Dialog_class from './../../libs/popup.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';
import QRCode from 'qrcode';

var instance = null;

class Tools_qrcode_class {

	constructor() {
		if (instance) {
			return instance;
		}
		instance = this;

		this.Base_layers = new Base_layers_class();
		this.Helper = new Helper_class();
		this.POP = new Dialog_class();
	}

	qrcode() {
		var _this = this;

		var modalHtml = `
			<div style="text-align:left; max-width:540px; margin:0 auto;">
				<!-- Tipo de Conteudo Tabs -->
				<div style="display:flex; gap:4px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px; overflow-x:auto;">
					<button type="button" class="qr_tab_btn active" data-type="pix" style="padding:6px 10px; font-size:11.5px; font-weight:700; background:linear-gradient(135deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3)); border:1px solid #22c55e; color:#ffffff; border-radius:6px; cursor:pointer;">
						💸 Chave PIX
					</button>
					<button type="button" class="qr_tab_btn" data-type="whatsapp" style="padding:6px 10px; font-size:11.5px; font-weight:600; background:#1e293b; border:1px solid rgba(255,255,255,0.1); color:#94a3b8; border-radius:6px; cursor:pointer;">
						📱 WhatsApp
					</button>
					<button type="button" class="qr_tab_btn" data-type="url" style="padding:6px 10px; font-size:11.5px; font-weight:600; background:#1e293b; border:1px solid rgba(255,255,255,0.1); color:#94a3b8; border-radius:6px; cursor:pointer;">
						🌐 Link / URL
					</button>
					<button type="button" class="qr_tab_btn" data-type="wifi" style="padding:6px 10px; font-size:11.5px; font-weight:600; background:#1e293b; border:1px solid rgba(255,255,255,0.1); color:#94a3b8; border-radius:6px; cursor:pointer;">
						📶 Wi-Fi
					</button>
					<button type="button" class="qr_tab_btn" data-type="text" style="padding:6px 10px; font-size:11.5px; font-weight:600; background:#1e293b; border:1px solid rgba(255,255,255,0.1); color:#94a3b8; border-radius:6px; cursor:pointer;">
						📝 Texto
					</button>
				</div>

				<div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:14px; align-items:start;">
					<!-- Form Fields Area -->
					<div id="qr_form_container">
						<!-- PIX Form -->
						<div id="form_pane_pix" class="form_pane">
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Chave PIX (CPF/CNPJ, E-mail, Celular ou EVP):</label>
								<input type="text" id="qr_pix_key" placeholder="Ex: 11999998888 ou chave@email.com" value="" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
							</div>
							<div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:8px;">
								<div>
									<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Nome do Recebedor:</label>
									<input type="text" id="qr_pix_name" placeholder="Ex: FABIANO BRAGA" value="RECEBEDOR" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
								</div>
								<div>
									<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Cidade:</label>
									<input type="text" id="qr_pix_city" placeholder="Ex: SAO PAULO" value="SAO PAULO" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
								</div>
							</div>
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Valor R$ (Opcional):</label>
								<input type="number" step="0.01" min="0" id="qr_pix_amount" placeholder="Ex: 29.90 (deixe em branco se livre)" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
							</div>
						</div>

						<!-- WhatsApp Form -->
						<div id="form_pane_whatsapp" class="form_pane" style="display:none;">
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Número WhatsApp (com DDD):</label>
								<input type="text" id="qr_wa_phone" placeholder="Ex: 5511999998888" value="" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
							</div>
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Mensagem Inicial (Opcional):</label>
								<textarea id="qr_wa_msg" rows="3" placeholder="Ex: Olá! Vi sua arte e gostaria de fazer um pedido." style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;"></textarea>
							</div>
						</div>

						<!-- URL Form -->
						<div id="form_pane_url" class="form_pane" style="display:none;">
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Endereço do Site / Instagram / Link:</label>
								<input type="text" id="qr_url_input" placeholder="https://instagram.com/suaconta" value="https://4u.ia.br" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
							</div>
						</div>

						<!-- Wi-Fi Form -->
						<div id="form_pane_wifi" class="form_pane" style="display:none;">
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Nome da Rede Wi-Fi (SSID):</label>
								<input type="text" id="qr_wifi_ssid" placeholder="Ex: Visitantes_WiFi" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
							</div>
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Senha do Wi-Fi:</label>
								<input type="text" id="qr_wifi_pass" placeholder="Senha da rede" style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;" />
							</div>
						</div>

						<!-- Text Form -->
						<div id="form_pane_text" class="form_pane" style="display:none;">
							<div style="margin-bottom:8px;">
								<label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:2px;">Texto Livre:</label>
								<textarea id="qr_text_input" rows="4" placeholder="Digite seu texto aqui..." style="width:100%; box-sizing:border-box; padding:6px 8px; font-size:12px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff;"></textarea>
							</div>
						</div>

						<!-- Customization Controls -->
						<div style="background:#1e293b; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); margin-top:8px;">
							<div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:6px;">
								<div>
									<label style="font-size:10.5px; color:#94a3b8; display:block; margin-bottom:2px;">Cor do Código:</label>
									<input type="color" id="qr_color_fg" value="#000000" style="width:100%; height:26px; padding:0; border:none; border-radius:4px; cursor:pointer; background:transparent;" />
								</div>
								<div>
									<label style="font-size:10.5px; color:#94a3b8; display:block; margin-bottom:2px;">Fundo:</label>
									<select id="qr_bg_mode" style="width:100%; height:26px; font-size:11px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:4px;">
										<option value="#ffffff">Branco Sólido</option>
										<option value="transparent">Transparente</option>
									</select>
								</div>
							</div>
							<div>
								<label style="font-size:10.5px; color:#94a3b8; display:block; margin-bottom:2px;">Ícone Central:</label>
								<select id="qr_center_icon" style="width:100%; height:26px; font-size:11px; background:#0f172a; border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:4px;">
									<option value="none">Nenhum (Padrão)</option>
									<option value="pix">💸 Logo PIX</option>
									<option value="whatsapp">📱 Logo WhatsApp</option>
									<option value="instagram">📸 Logo Instagram</option>
									<option value="star">⭐ Estrela Dourada</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Live Preview Area -->
					<div style="text-align:center;">
						<div style="background:#0f172a; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); margin-bottom:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:180px;">
							<canvas id="qr_preview_canvas" width="160" height="160" style="width:150px; height:150px; border-radius:6px; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.3);"></canvas>
							<div style="font-size:10.5px; color:#94a3b8; margin-top:6px;">Prévia em Tempo Real</div>
						</div>

						<button type="button" id="btn_insert_qr_layer" style="width:100%; padding:10px 8px; background:linear-gradient(135deg, #22c55e, #16a34a); color:#ffffff; font-weight:700; border-radius:6px; border:none; cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 4px 12px rgba(34,197,94,0.3);">
							<span>✨</span> Inserir na Arte
						</button>
					</div>
				</div>
			</div>
		`;

		var settings = {
			title: 'Gerador de QR Code & Chave PIX',
			params: [
				{ html: modalHtml }
			],
			on_load: function() {
				let currentType = 'pix';
				const previewCanvas = document.getElementById('qr_preview_canvas');

				// Tab switching
				const tabBtns = document.querySelectorAll('.qr_tab_btn');
				const panes = document.querySelectorAll('.form_pane');

				tabBtns.forEach(btn => {
					btn.addEventListener('click', () => {
						tabBtns.forEach(b => {
							b.style.background = '#1e293b';
							b.style.borderColor = 'rgba(255,255,255,0.1)';
							b.style.color = '#94a3b8';
							b.style.fontWeight = '600';
						});
						btn.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3))';
						btn.style.borderColor = '#22c55e';
						btn.style.color = '#ffffff';
						btn.style.fontWeight = '700';

						currentType = btn.dataset.type;
						panes.forEach(p => p.style.display = 'none');
						const targetPane = document.getElementById('form_pane_' + currentType);
						if (targetPane) targetPane.style.display = 'block';

						// Auto-set matching icon for ease
						const iconSelect = document.getElementById('qr_center_icon');
						if (currentType === 'pix') iconSelect.value = 'pix';
						else if (currentType === 'whatsapp') iconSelect.value = 'whatsapp';
						else if (currentType === 'url') iconSelect.value = 'none';

						updateQrCode();
					});
				});

				// Inputs that trigger live update
				const updateTriggers = [
					'qr_pix_key', 'qr_pix_name', 'qr_pix_city', 'qr_pix_amount',
					'qr_wa_phone', 'qr_wa_msg',
					'qr_url_input',
					'qr_wifi_ssid', 'qr_wifi_pass',
					'qr_text_input',
					'qr_color_fg', 'qr_bg_mode', 'qr_center_icon'
				];

				updateTriggers.forEach(id => {
					const el = document.getElementById(id);
					if (el) {
						el.addEventListener('input', updateQrCode);
						el.addEventListener('change', updateQrCode);
					}
				});

				function getQrString() {
					if (currentType === 'pix') {
						const key = (document.getElementById('qr_pix_key').value || '').trim();
						const name = document.getElementById('qr_pix_name').value || 'RECEBEDOR';
						const city = document.getElementById('qr_pix_city').value || 'SAO PAULO';
						const amount = document.getElementById('qr_pix_amount').value;
						if (!key) return 'https://4u.ia.br';
						return _this.generate_pix_payload(key, name, city, amount);
					} else if (currentType === 'whatsapp') {
						let phone = (document.getElementById('qr_wa_phone').value || '').replace(/\D/g, '');
						if (phone && !phone.startsWith('55') && phone.length <= 11) phone = '55' + phone;
						const msg = encodeURIComponent(document.getElementById('qr_wa_msg').value || '');
						if (!phone) return 'https://wa.me/';
						return `https://wa.me/${phone}${msg ? '?text=' + msg : ''}`;
					} else if (currentType === 'url') {
						let url = (document.getElementById('qr_url_input').value || '').trim();
						if (url && !url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
						return url || 'https://4u.ia.br';
					} else if (currentType === 'wifi') {
						const ssid = document.getElementById('qr_wifi_ssid').value || '';
						const pass = document.getElementById('qr_wifi_pass').value || '';
						return `WIFI:T:WPA;S:${ssid};P:${pass};;`;
					} else {
						return document.getElementById('qr_text_input').value || 'PhotoClone';
					}
				}

				function updateQrCode() {
					const text = getQrString();
					const fg = document.getElementById('qr_color_fg').value || '#000000';
					const bgMode = document.getElementById('qr_bg_mode').value;
					const icon = document.getElementById('qr_center_icon').value;

					const tempCanvas = document.createElement('canvas');
					tempCanvas.width = 512;
					tempCanvas.height = 512;

					const qrOptions = {
						width: 512,
						margin: 2,
						errorCorrectionLevel: 'H',
						color: {
							dark: fg,
							light: bgMode === 'transparent' ? '#00000000' : '#ffffff'
						}
					};

					QRCode.toCanvas(tempCanvas, text, qrOptions, function(err) {
						if (err) {
							console.warn('QR Code generation warning:', err);
							return;
						}

						// Draw central logo icon if selected
						if (icon !== 'none') {
							const ctx = tempCanvas.getContext('2d');
							const center = 256;
							const boxSize = 80;
							const halfBox = boxSize / 2;

							// Badge background behind icon
							ctx.save();
							ctx.fillStyle = '#ffffff';
							ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
							ctx.shadowBlur = 12;
							ctx.beginPath();
							if (typeof ctx.roundRect === 'function') {
								ctx.roundRect(center - halfBox, center - halfBox, boxSize, boxSize, 16);
							} else {
								ctx.rect(center - halfBox, center - halfBox, boxSize, boxSize);
							}
							ctx.fill();
							ctx.restore();

							// Border
							ctx.save();
							ctx.lineWidth = 3;
							ctx.strokeStyle = fg;
							ctx.beginPath();
							if (typeof ctx.roundRect === 'function') {
								ctx.roundRect(center - halfBox, center - halfBox, boxSize, boxSize, 16);
							} else {
								ctx.rect(center - halfBox, center - halfBox, boxSize, boxSize);
							}
							ctx.stroke();
							ctx.restore();

							// Emoji / Icon
							ctx.save();
							ctx.font = '40px Arial, sans-serif';
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							let iconChar = '💸';
							if (icon === 'whatsapp') iconChar = '📱';
							else if (icon === 'instagram') iconChar = '📸';
							else if (icon === 'star') iconChar = '⭐';
							ctx.fillText(iconChar, center, center + 2);
							ctx.restore();
						}

						// Draw to preview canvas
						const pCtx = previewCanvas.getContext('2d');
						pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
						pCtx.drawImage(tempCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
					});
				}

				// Insert QR Code layer into document
				const btnInsert = document.getElementById('btn_insert_qr_layer');
				if (btnInsert) {
					btnInsert.addEventListener('click', function() {
						const text = getQrString();
						const fg = document.getElementById('qr_color_fg').value || '#000000';
						const bgMode = document.getElementById('qr_bg_mode').value;
						const icon = document.getElementById('qr_center_icon').value;

						const qrCanvas = document.createElement('canvas');
						qrCanvas.width = 512;
						qrCanvas.height = 512;

						const qrOptions = {
							width: 512,
							margin: 2,
							errorCorrectionLevel: 'H',
							color: {
								dark: fg,
								light: bgMode === 'transparent' ? '#00000000' : '#ffffff'
							}
						};

						QRCode.toCanvas(qrCanvas, text, qrOptions, function(err) {
							if (err) {
								alertify.error('Erro ao gerar QR Code: ' + err.message);
								return;
							}

							// Draw central logo if selected
							if (icon !== 'none') {
								const ctx = qrCanvas.getContext('2d');
								const center = 256;
								const boxSize = 80;
								const halfBox = boxSize / 2;

								ctx.save();
								ctx.fillStyle = '#ffffff';
								ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
								ctx.shadowBlur = 12;
								ctx.beginPath();
								if (typeof ctx.roundRect === 'function') {
									ctx.roundRect(center - halfBox, center - halfBox, boxSize, boxSize, 16);
								} else {
									ctx.rect(center - halfBox, center - halfBox, boxSize, boxSize);
								}
								ctx.fill();
								ctx.restore();

								ctx.save();
								ctx.lineWidth = 3;
								ctx.strokeStyle = fg;
								ctx.beginPath();
								if (typeof ctx.roundRect === 'function') {
									ctx.roundRect(center - halfBox, center - halfBox, boxSize, boxSize, 16);
								} else {
									ctx.rect(center - halfBox, center - halfBox, boxSize, boxSize);
								}
								ctx.stroke();
								ctx.restore();

								ctx.save();
								ctx.font = '40px Arial, sans-serif';
								ctx.textAlign = 'center';
								ctx.textBaseline = 'middle';
								let iconChar = '💸';
								if (icon === 'whatsapp') iconChar = '📱';
								else if (icon === 'instagram') iconChar = '📸';
								else if (icon === 'star') iconChar = '⭐';
								ctx.fillText(iconChar, center, center + 2);
								ctx.restore();
							}

							// Scale target size nicely within current canvas (e.g. 240px)
							const insertWidth = Math.min(260, Math.round(config.WIDTH * 0.4));
							const insertHeight = insertWidth;
							const insertX = Math.round((config.WIDTH - insertWidth) / 2);
							const insertY = Math.round((config.HEIGHT - insertHeight) / 2);

							const typeNames = {
								pix: 'QR Code PIX',
								whatsapp: 'QR Code WhatsApp',
								url: 'QR Code Link',
								wifi: 'QR Code Wi-Fi',
								text: 'QR Code Texto'
							};

							const layerName = typeNames[currentType] || 'QR Code';

							app.State.do_action(
								new app.Actions.Insert_layer_action({
									name: layerName,
									type: 'image',
									link: qrCanvas,
									x: insertX,
									y: insertY,
									width: insertWidth,
									height: insertHeight
								})
							);

							alertify.success(`✅ ${layerName} inserido com sucesso!`);
							_this.POP.hide();
						});
					});
				}

				// Initial render
				setTimeout(updateQrCode, 50);
			}
		};

		this.POP.show(settings);
	}

	/**
	 * Official Banco Central do Brasil Pix BRCode EMV payload generator
	 */
	generate_pix_payload(key, name, city, amount, txid = '***') {
		function emvField(id, value) {
			const str = String(value);
			const len = ('00' + str.length).slice(-2);
			return id + len + str;
		}

		// 00: Payload Format Indicator
		let payload = emvField('00', '01');

		// 26: Merchant Account Information - Pix
		let pixInfo = emvField('00', 'br.gov.bcb.pix') + emvField('01', key.trim());
		payload += emvField('26', pixInfo);

		// 52: Merchant Category Code
		payload += emvField('52', '0000');

		// 53: Transaction Currency (986 = BRL)
		payload += emvField('53', '986');

		// 54: Transaction Amount (optional)
		if (amount && parseFloat(amount) > 0) {
			payload += emvField('54', parseFloat(amount).toFixed(2));
		}

		// 58: Country Code (BR)
		payload += emvField('58', 'BR');

		// 59: Merchant Name (max 25 chars, uppercase, no accents)
		const cleanName = (name || 'RECEBEDOR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().substring(0, 25);
		payload += emvField('59', cleanName);

		// 60: Merchant City (max 15 chars, uppercase, no accents)
		const cleanCity = (city || 'BRASIL').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().substring(0, 15);
		payload += emvField('60', cleanCity);

		// 62: Additional Data Field Template (TxID)
		const cleanTxId = (txid || '***').substring(0, 25);
		payload += emvField('62', emvField('05', cleanTxId));

		// 63: CRC16 calculation (CCITT-FALSE, polynomial 0x1021)
		payload += '6304';
		let crc = 0xFFFF;
		for (let i = 0; i < payload.length; i++) {
			crc ^= payload.charCodeAt(i) << 8;
			for (let j = 0; j < 8; j++) {
				if ((crc & 0x8000) !== 0) {
					crc = (crc << 1) ^ 0x1021;
				} else {
					crc = crc << 1;
				}
			}
		}
		crc = (crc & 0xFFFF).toString(16).toUpperCase();
		crc = ('0000' + crc).slice(-4);

		return payload + crc;
	}

}

export default Tools_qrcode_class;
