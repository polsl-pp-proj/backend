import { NotificationDto } from './notification.dto';

export class NotificationsDto {
    page: number;
    pageCount: number;
    notifications: NotificationDto[];

    constructor(notificationsDto: NotificationsDto) {
        Object.assign(this, notificationsDto);
    }
}
