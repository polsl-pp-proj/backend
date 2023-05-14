import { Injectable } from '@nestjs/common';
import { base64UrlEncode } from 'src/helpers/base64url.helper';
import { MailerService } from 'src/modules/mailer/services/mailer/mailer.service';

@Injectable()
export class AuthMailerService {
    constructor(private readonly mailerService: MailerService) {}

    async sendResetPasswordMail({
        emailAddress,
        firstName,
        lastName,
        resetPasswordToken,
    }: {
        emailAddress: string;
        firstName: string;
        lastName: string;
        resetPasswordToken: string;
    }) {
        const fromEmail = this.mailerService.getEmailAddress('password');
        const activationLink = `${
            process.env['FRONTEND_URL']
        }/reset-password/${base64UrlEncode(
            emailAddress,
        )}/${resetPasswordToken}`;
        return await this.mailerService.sendMail({
            to: `"${firstName} ${lastName}" <${emailAddress}>`,
            from: `"StudentHub" <${fromEmail}>`,
            subject: 'Zresetuj hasło',
            html: `<p>Otrzymaliśmy prośbę o zresetowanie hasła.</p><p>Aby to zrobić, przejdź pod link <a href="${activationLink}">${activationLink}</a>.</p>`,
        });
    }
}
