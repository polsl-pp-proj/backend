import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'email_address' })
    emailAddress: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({
        name: 'last_verified_as_student',
        type: 'timestamp with time zone',
        nullable: true,
        default: null,
    })
    lastVerifiedAsStudent: Date | null;

    @Column({
        name: 'role',
        enum: UserRole,
        enumName: 'user_role',
    })
    role: UserRole;

    @Column({
        name: 'is_active',
    })
    isActive: boolean;
}
