import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { Organization } from './organization.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'organizations_users' })
@Unique('UQ_organization_user', ['organizationId', 'userId']) //
export class OrganizationUser {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({
        foreignKeyConstraintName: 'FK_organization_user_organization_id',
    })
    organizationId: number;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    @JoinColumn({
        foreignKeyConstraintName: 'FK_organization_user_organization_id',
    })
    organization: Organization;

    @Column({ foreignKeyConstraintName: 'FK_organization_user_user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({
        foreignKeyConstraintName: 'FK_organization_user_user_id',
    })
    user: User;

    @Column({
        type: 'enum',
        enum: OrganizationMemberRole,
        enumName: 'organization_member_role',
        default: OrganizationMemberRole.Member,
    })
    role: OrganizationMemberRole;
}
