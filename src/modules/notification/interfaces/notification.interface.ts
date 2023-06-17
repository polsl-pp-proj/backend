import { NotificationType } from '../enums/notification-type.enum';

export interface INotification {
    id: number;
    subject: string;
    message: string;
    projectId: number;
    projectName: string;
    organizationId: number;
    organizationName: string;
    type: NotificationType;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
}
