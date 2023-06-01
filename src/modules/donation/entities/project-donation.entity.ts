import { User } from '../../user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'project_donations' })
export class ProjectDonation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

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
}
