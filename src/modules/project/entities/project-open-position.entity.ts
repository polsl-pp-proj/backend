import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { ProjectOpenPositionBase } from './project-open-position.entitybase';

@Entity({ name: 'project_open_positions' })
export class ProjectOpenPosition extends ProjectOpenPositionBase {
    @Column({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project, (project) => project.openPositions)
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
