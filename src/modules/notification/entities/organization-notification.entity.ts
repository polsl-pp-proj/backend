import { User } from '../../user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationNotificationType } from '../enums/organization-notification-type.enum';

@Entity({ name: 'organization_notifications' })
export class OrganizationNotification {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'subject', length: 150 })
    subject: string;

    @Column({ name: 'message' })
    message: string;

    @Column({ name: 'project_id' })
    projectId: number;

    // @ManyToOne(() => Project)
    // @JoinColumn({ name: 'project_id' })
    // project: Project;

    @Column({ name: 'sender_user_id' })
    senderUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_user_id' })
    senderUser: User;

    @Column({
        type: 'enum',
        enum: OrganizationNotificationType,
        enumName: 'organization_notification_type',
        name: 'type',
    })
    type: OrganizationNotificationType;

    @Column({ name: 'seen', default: false })
    seen: boolean;
}
