import { ProjectDto } from './project.dto';

export class ProjectDraftDto extends ProjectDto {
    constructor(partialProjectDraftDto: Partial<ProjectDraftDto>) {
        super(partialProjectDraftDto);
    }
}
