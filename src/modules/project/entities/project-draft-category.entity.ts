import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProjectDraft } from './project-draft.entity';
import { ProjectCategoryBase } from './project-category.entitybase';

@Entity({ name: 'project_draft_categories' })
export class ProjectDraftCategory extends ProjectCategoryBase {
    @PrimaryColumn({ name: 'project_draft_id' })
    projectDraftId: number;

    @ManyToOne(() => ProjectDraft, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_draft_id' })
    projectDraft: ProjectDraft;
}
