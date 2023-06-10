import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectDraft } from './project-draft.entity';
import { ProjectOpenPosition } from './project-open-position.entity';

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

    @OneToMany(
        () => ProjectOpenPosition,
        (openPosition) => openPosition.project,
        { cascade: true },
    )
    openPositions: ProjectOpenPosition[];

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;

    // TO DO
    // Connect to: ProjectGalleryEntry, Category,
    // ProjectDonation, ProjectMessage and
    // FavouriteProject
}
