import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity({ name: 'project_open_positions' })
export class ProjectOpenPosition {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project, (project) => project.openPositions)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'requirements', default: [], type: 'jsonb' })
    requirements: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
