import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectDraft } from './project-draft.entity';
import { ProjectOpenPositionBase } from './project-open-position.entitybase';

@Entity({ name: 'project_draft_open_positions' })
export class ProjectDraftOpenPosition extends ProjectOpenPositionBase {
    @Column({ name: 'project_draft_id' })
    projectDraftId: number;

    @ManyToOne(() => ProjectDraft)
    @JoinColumn({ name: 'project_draft_id' })
    projectDraft: ProjectDraft;
}
