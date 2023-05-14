import { Module } from '@nestjs/common';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { AuthMailerService } from './services/auth-mailer/auth-mailer.service';

@Module({
    imports: [MailerModule],
    providers: [AuthMailerService],
})
export class AuthMailerModule {}
