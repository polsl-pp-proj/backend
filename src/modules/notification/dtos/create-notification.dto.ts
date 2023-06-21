import { NotificationType } from '../enums/notification-type.enum';

export class CreateNotificationDto {
    subject: string;
    message: string;
    projectId: number;
    userId: number;
    type: NotificationType;
}
