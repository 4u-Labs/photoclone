import Dialog_class from './../../libs/popup.js';

class Help_legal_class {

	constructor() {
		this.POP = new Dialog_class();
	}

	privacy_policy() {
		const settings = {
			title: 'Política de Privacidade',
			params: [
				{
					html: `
						<div style="line-height: 1.6; max-height: 400px; overflow-y: auto; padding-right: 10px;">
							<p>Esta Política de Privacidade descreve como suas informações pessoais são coletadas, usadas e compartilhadas quando você visita ou utiliza o PhotoClone Pro.</p>
							
							<h3 style="margin-top: 15px;">1. Coleta de Informações</h3>
							<p>Não coletamos informações pessoais identificáveis, a menos que você as forneça voluntariamente (por exemplo, ao entrar em contato conosco). Seus arquivos e imagens são processados localmente no seu navegador ou via APIs seguras de Inteligência Artificial, sem armazenamento permanente em nossos servidores por padrão.</p>
							
							<h3 style="margin-top: 15px;">2. Uso de Dados de IA</h3>
							<p>Ao utilizar as ferramentas de IA (Remoção de Fundo, Colorização, Upscale), suas imagens são enviadas temporariamente para processamento pela Replicate. Essas imagens não são usadas para outros fins além de fornecer o serviço solicitado.</p>
							
							<h3 style="margin-top: 15px;">3. Pagamentos</h3>
							<p>As transações financeiras são processadas pelo Mercado Pago. Não armazenamos os detalhes do seu cartão de crédito ou outras informações sensíveis de pagamento em nosso site.</p>
							
							<h3 style="margin-top: 15px;">4. Cookies</h3>
							<p>Utilizamos cookies para lembrar suas preferências de idioma, configurações de interface e saldo de créditos.</p>
							
							<h3 style="margin-top: 15px;">5. Contato</h3>
							<p>Para dúvidas sobre nossa política, entre em contato através do site 4U.IA.BR.</p>
						</div>
					`
				}
			]
		};
		this.POP.show(settings);
	}

	terms_of_use() {
		const settings = {
			title: 'Termos de Uso',
			params: [
				{
					html: `
						<div style="line-height: 1.6; max-height: 400px; overflow-y: auto; padding-right: 10px;">
							<p>Ao acessar e utilizar o PhotoClone Pro, você concorda com os seguintes termos:</p>
							
							<h3 style="margin-top: 15px;">1. Uso do Serviço</h3>
							<p>O PhotoClone Pro é uma ferramenta de edição de imagens. Você é responsável por qualquer conteúdo que carregar ou processar utilizando a ferramenta.</p>
							
							<h3 style="margin-top: 15px;">2. Propriedade Intelectual</h3>
							<p>Você retém todos os direitos sobre as imagens que processa. O software é fornecido "como está", sem garantias de qualquer tipo.</p>
							
							<h3 style="margin-top: 15px;">3. Sistema de Créditos</h3>
							<p>Créditos adquiridos para uso de IA são vinculados ao seu navegador atual. Limpar os dados do navegador (cache/localStorage) pode resultar na perda de créditos sem possibilidade de reembolso manual imediato, a menos que você guarde seu token de usuário.</p>
							
							<h3 style="margin-top: 15px;">4. Limitação de Responsabilidade</h3>
							<p>Não nos responsabilizamos por perdas de dados ou danos resultantes do uso desta ferramenta.</p>
							
							<h3 style="margin-top: 15px;">5. Modificações</h3>
							<p>Reservamos o direito de modificar estes termos a qualquer momento, visando a melhoria do serviço.</p>
						</div>
					`
				}
			]
		};
		this.POP.show(settings);
	}

}

export default Help_legal_class;
