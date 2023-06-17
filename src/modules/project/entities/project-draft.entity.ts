import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProjectDraftOpenPosition } from './project-draft-open-position.entity';
import { ProjectBase } from './project.entitybase';
import { Organization } from '../../organization/entities/organization.entity';
import { ProjectDraftGalleryEntry } from '../../gallery/entities/project-draft-gallery-entry.entity';

@Entity({ name: 'project_drafts' })
export class ProjectDraft extends ProjectBase {
    @Column({ name: 'owner_organization_id' })
    ownerOrganizationId: number;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'owner_organization_id' })
    ownerOrganization: Organization;

    @OneToMany(
        () => ProjectDraftOpenPosition,
        (projectDraftOpenPosition) => projectDraftOpenPosition.projectDraft,
        { cascade: true },
    )
    openPositions: ProjectDraftOpenPosition[];

    @OneToMany(
        () => ProjectDraftGalleryEntry,
        (galleryEntry) => galleryEntry.projectDraft,
        { cascade: true },
    )
    galleryEntries: ProjectDraftGalleryEntry[];

    // TO DO
    // Connect to: Category
}
