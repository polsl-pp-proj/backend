import { Organization } from 'src/modules/organization/entities/organization.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectDraftOpenPosition } from './project-draft-open-position.entity';

@Entity({ name: 'project_drafts' })
export class ProjectDraft {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'short_description' })
    shortDescription: string;

    @Column({ name: 'owner_organization_id' })
    ownerOrganizationId: number;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'owner_organization_id' })
    ownerOrganization: Organization;

    @Column({ name: 'funding_objectives' })
    fundingObjectives: string;

    @OneToMany(
        () => ProjectDraftOpenPosition,
        (projectDraftOpenPosition) => projectDraftOpenPosition.projectDraft,
        { cascade: true },
    )
    openPositions: ProjectDraftOpenPosition[];

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;
    // TO DO
    // Connect to: Category
}
