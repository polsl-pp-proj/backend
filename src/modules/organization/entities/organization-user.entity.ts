import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { Organization } from './organization.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'organizations_users' })
export class OrganizationUser {
    @PrimaryColumn({ name: 'organization_id' })
    organizationId: number;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'enum',
        enum: OrganizationMemberRole,
        enumName: 'organization_member_role',
        default: OrganizationMemberRole.Member,
        name: 'role',
    })
    role: OrganizationMemberRole;
}
