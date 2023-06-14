import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectDraft } from './project-draft.entity';

@Entity({ name: 'project_draft_open_positions' })
export class ProjectDraftOpenPosition {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'project_draft_id' })
    projectDraftId: number;

    @ManyToOne(() => ProjectDraft)
    @JoinColumn({ name: 'project_draft_id' })
    projectDraft: ProjectDraft;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'requirements', default: [], type: 'jsonb' })
    requirements: string[];

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;
}
