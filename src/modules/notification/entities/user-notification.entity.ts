import { User } from '../../user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_notifications' })
export class UserNotification {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'subject', length: 150 })
    subject: string;

    @Column({ name: 'message' })
    message: string;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'project_id' })
    projectId: number;

    // @ManyToOne(() => Project)
    // @JoinColumn({ name: 'project_id' })
    // project: Project;

    @Column({ name: 'seen', default: false })
    seen: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
