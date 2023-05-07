import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
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
    @JoinColumn()
    user: User;
}
