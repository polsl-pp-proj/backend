import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { OrganizationUser } from 'src/modules/organization/entities/organization-user.entity';

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

    @OneToMany(
        () => OrganizationUser,
        (organizationUser) => organizationUser.user,
    )
    userOrganizations: OrganizationUser[];
}
