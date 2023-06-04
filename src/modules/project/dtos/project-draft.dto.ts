import { ProjectDto, SimpleProjectDto } from './project.dto';

export class ProjectDraftDto extends ProjectDto {
    lastModified: Date;
    constructor(partialProjectDraftDto: Partial<ProjectDraftDto>) {
        super(partialProjectDraftDto);
    }
}

export class SimpleProjectDraftDto extends SimpleProjectDto {}
