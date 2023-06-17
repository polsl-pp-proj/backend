import { Project } from '../../project/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project_donations' })
export class ProjectDonation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'is_anonymous' })
    isAnonymous: boolean;

    @Column({ name: 'payment_intent_id' })
    paymentIntentId: string;

    @Column({ name: 'payment_finished' })
    paymentFinished: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
