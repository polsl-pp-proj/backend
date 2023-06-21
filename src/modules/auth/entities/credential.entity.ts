import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
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
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
