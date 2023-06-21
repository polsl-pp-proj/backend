import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'issued_refresh_tokens' })
export class IssuedRefreshToken {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'uuid' })
    uuid: string;

    @Column({ name: 'for_auth_token_uuid' })
    forAuthTokenUuid: string;

    @Column({ name: 'expiry', type: 'timestamp with time zone' })
    expiry: Date;

    @Column({ name: 'ip_address' })
    ipAddress: string;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
