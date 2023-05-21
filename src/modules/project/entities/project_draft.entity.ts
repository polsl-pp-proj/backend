import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'project_drafts' })
export class ProjectDraft {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'short_description' })
    shortDescription: string;

    // TO DO
    // Add owner_organization_id column

    @Column({ name: 'funding_objectives' })
    foundingObjectives: string;

    // TO DO
    // Connect to: Category, ProjectDraftOpenPosition,
    // ProjectDraftSubmission
}
