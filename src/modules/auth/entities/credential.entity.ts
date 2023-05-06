import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CredentialType } from '../enums/credential-type.enum';

@Entity({ name: 'credentials' })
export class Credential {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'credential' })
    credential: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: CredentialType,
        enumName: 'credential_type',
    })
    type: CredentialType;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
}
