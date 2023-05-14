import { Module } from '@nestjs/common';
import { SignupMailerService } from './services/signup-mailer/signup-mailer.service';

@Module({
    providers: [SignupMailerService],
})
export class SignupMailerModule {}
