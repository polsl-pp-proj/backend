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
import { ProjectBase } from './project.entitybase';

@Entity({ name: 'project_drafts' })
export class ProjectDraft extends ProjectBase {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

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

    // TO DO
    // Connect to: Category
}
