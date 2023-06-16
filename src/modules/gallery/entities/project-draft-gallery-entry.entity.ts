import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectGalleryEntryBase } from './project-gallery-entry.entitybase';
import { ProjectDraft } from 'src/modules/project/entities/project-draft.entity';

@Entity({ name: 'project_draft_gallery_entries' })
export class ProjectDraftGalleryEntry extends ProjectGalleryEntryBase {
    @Column({ name: 'project_draft_id' })
    projectDraftId: number;

    @ManyToOne(() => ProjectDraft, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_draft_id' })
    projectDraft: ProjectDraft;
}
