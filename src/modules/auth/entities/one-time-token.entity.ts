import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Type } from 'class-transformer';
import { OneTimeTokenType } from '../enums/one-time-token-type.enum';

@Entity({ name: 'one_time_tokens' })
export class OneTimeToken {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'uuid' })
    uuid: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: OneTimeTokenType,
        enumName: 'one_time_token_type',
    })
    type: OneTimeTokenType;

    @Column({ name: 'expiry', type: 'timestamp with time zone' })
    @Type(() => Date)
    expiry: Date;

    @Column({ name: 'is_active' })
    isActive: boolean;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
