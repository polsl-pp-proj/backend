import { Injectable } from '@nestjs/common';
import {
    ISendMailOptions,
    MailerService as NestMailerService,
} from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
    constructor(private readonly mailerService: NestMailerService) {}

    async sendMail(sendMailOptions: ISendMailOptions) {
        return await this.mailerService.sendMail(sendMailOptions);
    }

    getEmailAddress(emailName: string) {
        return `${emailName}@${process.env['MAIL_VISIBLE_DOMAIN']}`;
    }
}
