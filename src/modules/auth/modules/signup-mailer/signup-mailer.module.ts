import { Module } from '@nestjs/common';
import { SignupMailerService } from './services/signup-mailer/signup-mailer.service';
import { MailerModule } from 'src/modules/mailer/mailer.module';

@Module({
    imports: [MailerModule],
    providers: [SignupMailerService],
    exports: [SignupMailerService],
})
export class SignupMailerModule {}
