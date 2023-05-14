import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './services/mailer/mailer.service';

@Module({
    imports: [
        NestMailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                secure: true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from: '"StudentHub" <contact@studenthub.pb.smallhost.pl>',
            },
        }),
    ],
    providers: [MailerService],
})
export class MailerModule {}
