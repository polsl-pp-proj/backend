import { Module } from '@nestjs/common';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { StudentshipMailerService } from './services/studentship-mailer/studentship-mailer.service';

@Module({
    imports: [MailerModule],
    providers: [StudentshipMailerService],
    exports: [StudentshipMailerService],
})
export class StudentshipMailerModule {}
