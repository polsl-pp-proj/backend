import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/modules/mailer/services/mailer/mailer.service';
import * as dotenv from 'dotenv';
import { base64UrlEncode } from 'src/helpers/base64url.helper';
dotenv.config();

@Injectable()
export class SignupMailerService {
    constructor(private readonly mailerService: MailerService) {}

    async sendConfirmSignupMail({
        emailAddress,
        firstName,
        lastName,
        accountActivationToken,
    }: {
        emailAddress: string;
        firstName: string;
        lastName: string;
        accountActivationToken: string;
    }) {
        const fromEmail = this.mailerService.getEmailAddress('signup');
        const activationLink = `${
            process.env['FRONTEND_URL']
        }/signup/confirm/${base64UrlEncode(
            emailAddress,
        )}/${accountActivationToken}`;
        return await this.mailerService.sendMail({
            to: `"${firstName} ${lastName}" <${emailAddress}>`,
            from: `"Rejestracja StudentHub" <${fromEmail}>`,
            subject: 'Aktywuj swoje konto',
            html: `<p>Twoje konto zostało utworzone!</p><p>Aktywuj je, przechodząc pod link <a href="${activationLink}">${activationLink}</a>.</p>`,
        });
    }

    async sendSignupConfirmedMail({
        emailAddress,
        firstName,
        lastName,
    }: {
        emailAddress: string;
        firstName: string;
        lastName: string;
    }) {
        const fromEmail = this.mailerService.getEmailAddress('signup');
        return await this.mailerService.sendMail({
            to: `"${firstName} ${lastName}" <${emailAddress}>`,
            from: `"Rejestracja StudentHub" <${fromEmail}>`,
            subject: 'Konto aktywowane',
            html: `<p>Twoje konto zostało aktywowane!</p><p>Możesz teraz w pełni korzystać z serwisu.</p><p>Jeśli posiadasz status studenta, zweryfikuj go, przechodząc do strony zarządzania kontem.</p>`,
        });
    }
}
