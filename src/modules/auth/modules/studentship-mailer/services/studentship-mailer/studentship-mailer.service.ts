import { Injectable } from '@nestjs/common';
import { base64UrlEncode } from 'src/helpers/base64url.helper';
import { MailerService } from 'src/modules/mailer/services/mailer/mailer.service';

@Injectable()
export class StudentshipMailerService {
    constructor(private readonly mailerService: MailerService) {}

    async sendConfirmStudentshipVerificationMail({
        universityDomainEmailAddress,
        accountEmailAddress,
        firstName,
        lastName,
        studentshipVerificationToken: accountActivationToken,
    }: {
        universityDomainEmailAddress: string;
        accountEmailAddress: string;
        firstName: string;
        lastName: string;
        studentshipVerificationToken: string;
    }) {
        const fromEmail = this.mailerService.getEmailAddress('verify');

        const activationLink = `${
            process.env['FRONTEND_URL']
        }/studentship/verification/confirm/${base64UrlEncode(
            accountEmailAddress,
        )}/${accountActivationToken}`;

        return await this.mailerService.sendMail({
            to: `"${firstName} ${lastName}" <${universityDomainEmailAddress}>`,
            from: `"Weryfikacja StudentHub" <${fromEmail}>`,
            subject: 'Potwierdź, że jesteś studentem',
            html: `<p>Uzyskaj więcej możliwości ze StudentHub przez potwierdzenie, że jesteś studentem!</p><p>Aby to zrobić, przejdź pod link <a href="${activationLink}">${activationLink}</a>.</p>`,
        });
    }

    async sendStudentshipVerificationConfirmedMail({
        emailAddress,
        firstName,
        lastName,
    }: {
        emailAddress: string;
        firstName: string;
        lastName: string;
    }) {
        const fromEmail = this.mailerService.getEmailAddress('verify');

        return await this.mailerService.sendMail({
            to: `"${firstName} ${lastName}" <${emailAddress}>`,
            from: `"Weryfikacja StudentHub" <${fromEmail}>`,
            subject: 'Konto zweryfikowane',
            html: `<p>Od teraz możesz tworzyć organizacje studenckie i dodawać w ich imieniu projekty studenckie.</p>`,
        });
    }
}
