import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCategoryBase } from './project-category.entitybase';

@Entity({ name: 'project_categories' })
export class ProjectCategory extends ProjectCategoryBase {
    @PrimaryColumn({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
