import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationNotification } from './entities/organization-notification.entity';
import { UserNotification } from './entities/user-notification.entity';
import { NotificationController } from './controllers/notification/notification.controller';
import { OrganizationNotificationRepository } from './repositories/organization-notification.repository';
import { UserNotificationRepository } from './repositories/user-notification.repository';
import { RedisPubSubModule } from 'nest-pubsub';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrganizationNotification, UserNotification]),
        RedisPubSubModule.register({
            path: process.env.REDIS_SOCK,
            password: process.env.REDIS_PASS,
        }),
    ],
    providers: [
        NotificationService,
        OrganizationNotificationRepository,
        UserNotificationRepository,
    ],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule {}
