import { NotificationType } from '../enums/notification-type.enum';
import { INotification } from '../interfaces/notification.interface';

export class NotificationDto {
    id: number;
    subject: string;
    message: string;
    projectId: number;
    organizationName: string;
    type: NotificationType;
    seen: boolean;
    createdAt: number;
    updatedAt: number;

    constructor(notificationDto: INotification) {
        Object.assign(this, notificationDto);
        this.createdAt = (this.createdAt as unknown as Date).valueOf();
        this.updatedAt = (this.updatedAt as unknown as Date).valueOf();
    }
}
