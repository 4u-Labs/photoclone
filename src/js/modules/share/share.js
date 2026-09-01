import app from './../../app.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';

class Share_share_class {

	constructor() {
		this.preformattedMessage = "Gente, acabei de usar essa ferramenta incrível de edição de imagens com Inteligência Artificial! Recomendo demais: ";
		this.siteUrl = "https://4u.ia.br/photoclone"; // URL Final ou window.location.href
	}

	whatsapp() {
		const text = encodeURIComponent(this.preformattedMessage + " " + this.siteUrl);
		const url = `https://api.whatsapp.com/send?text=${text}`;
		window.open(url, '_blank');
		this.triggerPostShare('WhatsApp');
	}

	facebook() {
		const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.siteUrl)}`;
		window.open(url, '_blank');
		this.triggerPostShare('Facebook');
	}

	twitter() {
		const text = encodeURIComponent(this.preformattedMessage);
		const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(this.siteUrl)}`;
		window.open(url, '_blank');
		this.triggerPostShare('X (Twitter)');
	}

	invite() {
		// Convites Virais
		const inviteText = encodeURIComponent(`Você foi convidado(a) para experimentar o melhor editor web com IA! Acesse aqui: ` + this.siteUrl);
		const url = `https://api.whatsapp.com/send?text=${inviteText}`;
		window.open(url, '_blank');
		alertify.success('Convite viral gerado! Compartilhe com seus amigos.');
	}

	triggerPostShare(network) {
		// Call-to-share pós pagamento ou ação
		alertify.success(`Obrigado por compartilhar no ${network}! Você nos ajuda a crescer organicamente.`);
	}
}

export default Share_share_class;
