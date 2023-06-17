import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ProjectDraft } from './project-draft.entity';
import { ProjectOpenPosition } from './project-open-position.entity';
import { ProjectBase } from './project.entitybase';
import { ProjectGalleryEntry } from '../../gallery/entities/project-gallery-entry.entity';
import { ProjectCategory } from './project-category.entity';

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

    @OneToMany(() => ProjectCategory, (category) => category.project, {
        eager: true,
        cascade: true,
    })
    categories: ProjectCategory[];

    @Column({
        type: 'tsvector',
        nullable: true,
        select: false,
        insert: false,
        update: false,
        name: 'search_vector',
    })
    searchVector?: string[];

    rank?: number;
    paymentAmount?: number;
    favoriteCount?: number;
}
