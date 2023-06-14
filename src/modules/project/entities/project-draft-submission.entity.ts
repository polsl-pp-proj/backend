import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { ProjectDraft } from './project-draft.entity';

@Entity({ name: 'project_draft_submissions' })
export class ProjectDraftSubmission {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'project_draft_id' })
    projectDraftId: number;

    @ManyToOne(() => ProjectDraft)
    @JoinColumn({ name: 'project_draft_id' })
    projectDraft: ProjectDraft;

    @Column({
        type: 'enum',
        enum: ProjectDraftSubmissionStatus,
        enumName: 'project_draft_submission_status',
        name: 'status',
    })
    status: ProjectDraftSubmissionStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
