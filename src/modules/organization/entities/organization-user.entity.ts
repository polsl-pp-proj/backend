import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
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

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
