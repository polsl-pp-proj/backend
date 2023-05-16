import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationMemberRole } from '../enums/organization-member-role.enum';
import { Organization } from './organization.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'organizations_users' })
export class OrganizationUser {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'organization_id' })
    organizationId: number;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @Column({ name: 'user_id' })
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
