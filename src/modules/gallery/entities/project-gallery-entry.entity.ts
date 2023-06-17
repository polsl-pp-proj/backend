import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectGalleryEntryBase } from './project-gallery-entry.entitybase';
import { Project } from '../../project/entities/project.entity';

@Entity({ name: 'project_gallery_entries' })
export class ProjectGalleryEntry extends ProjectGalleryEntryBase {
    @Column({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;
}
