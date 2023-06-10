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
import { ProjectBase } from './project.entitybase';

@Entity({ name: 'projects' })
export class Project extends ProjectBase {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

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

    // TO DO
    // Connect to: ProjectGalleryEntry, Category,
    // ProjectDonation, ProjectMessage and
    // FavouriteProject
}
