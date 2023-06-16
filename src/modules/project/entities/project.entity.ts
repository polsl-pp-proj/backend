import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ProjectDraft } from './project-draft.entity';
import { ProjectOpenPosition } from './project-open-position.entity';
import { ProjectBase } from './project.entitybase';
import { ProjectGalleryEntry } from 'src/modules/gallery/entities/project-gallery-entry.entity';

@Entity({ name: 'projects' })
export class Project extends ProjectBase {
    @Column({ name: 'draft_id' })
    projectDraftId: number;

    @OneToOne(() => ProjectDraft)
    @JoinColumn({ name: 'draft_id' })
    projectDraft: ProjectDraft;

    @OneToMany(
        () => ProjectOpenPosition,
        (openPosition) => openPosition.project,
        { cascade: true },
    )
    openPositions: ProjectOpenPosition[];

    @OneToMany(
        () => ProjectGalleryEntry,
        (galleryEntry) => galleryEntry.project,
        { cascade: true },
    )
    galleryEntries: ProjectGalleryEntry[];

    // TO DO
    // Connect to: Category, ProjectDonation,
    // ProjectMessage and FavouriteProject
}
