import { NotificationType } from '../enums/notification-type.enum';
import { INotification } from '../interfaces/notification.interface';

export class NotificationDto {
    id: number;
    subject: string;
    message: string;
    project: { id: number; name: string };
    organization: { id: number; name: string };
    type: NotificationType;
    seen: boolean;
    createdAt: number;
    updatedAt: number;

    constructor(notificationData: INotification) {
        this.id = notificationData.id;
        this.subject = notificationData.subject;
        this.message = notificationData.message;
        this.project = {
            id: notificationData.projectId,
            name: notificationData.projectName,
        };
        this.organization = {
            id: notificationData.organizationId,
            name: notificationData.organizationName,
        };
        this.type = notificationData.type;
        this.seen = notificationData.seen;
        this.createdAt = notificationData.createdAt.valueOf();
        this.updatedAt = notificationData.updatedAt.valueOf();
    }
}
