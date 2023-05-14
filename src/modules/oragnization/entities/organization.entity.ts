import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { OrganizationUser } from './organization-user.entity';

@Entity({ name: 'organizations' })
export class Organization {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @OneToMany(() => OrganizationUser, (user) => user.organization, {
        eager: true,
        cascade: true,
    })
    organizationUsers: OrganizationUser[];
}
