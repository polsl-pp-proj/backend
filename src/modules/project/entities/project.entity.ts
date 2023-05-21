import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectDraft } from './project_draft.entity';

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'short_description' })
    shortDescription: string;

    @Column({ name: 'draft_id' })
    projectDraftId: number;

    @OneToOne(() => ProjectDraft)
    @JoinColumn({ name: 'draft_id' })
    projectDraft: ProjectDraft;

    @Column({ name: 'funding_objectives' })
    fundingObjectives: string;

    // TO DO
    // Connect to: ProjectGalleryEntry, Category,
    // ProjectDonation, ProjectMessage, ProjectOpenPosition and
    // FavouriteProject
}
