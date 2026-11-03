import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import { Resend } from 'resend';

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

// Envoi des emails transactionnels (contenu rendu par renderEmail, libs/email-templates).
// Fournisseur choisi selon la configuration, dans cet ordre :
//   1. RESEND_API_KEY : API HTTP de Resend (recommandé : pas de port SMTP à ouvrir sur le VPS) ;
//   2. SMTP_URL (smtp://user:pass@host:587) : n'importe quel serveur SMTP ;
//   3. sinon, l'email est seulement écrit dans les logs (dev local : le lien s'y trouve).
// À terme, les envois passeront par le worker (BullMQ).
@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resend?: Resend;
  private readonly transporter?: Transporter;
  private readonly from: string;

  constructor(config: ConfigService) {
    const resendApiKey = config.get<string>('RESEND_API_KEY');
    const smtpUrl = config.get<string>('SMTP_URL');
    if (resendApiKey) this.resend = new Resend(resendApiKey);
    else if (smtpUrl) this.transporter = createTransport(smtpUrl);
    this.from = config.get<string>('MAIL_FROM') ?? 'GAI2E Conseils <no-reply@gai2e.local>';
  }

  async send(message: MailMessage): Promise<void> {
    if (this.resend) {
      const { error } = await this.resend.emails.send({ from: this.from, ...message });
      // Le SDK ne lève pas d'exception : l'erreur (clé invalide, domaine non vérifié...) est dans la réponse
      if (error) throw new Error(`Resend : ${error.name} — ${error.message}`);
      return;
    }
    if (this.transporter) {
      await this.transporter.sendMail({ from: this.from, ...message });
      return;
    }
    this.logger.log(
      `Email (aucun fournisseur configuré, non envoyé) à ${message.to} : ${message.subject}\n${message.text}`,
    );
  }
}
