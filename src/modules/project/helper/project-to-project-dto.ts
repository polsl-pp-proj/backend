import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';

export const convertProjectToProjectDto = (
    project: Project,
    organizationName: string,
): ProjectDto => {
    return new ProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        description: project.description,
        fundingObjectives: project.fundingObjectives,
        organizationName,
    });
};

export const convertProjectToSimpleProjectDto = (
    project: Project,
    organizationName: string,
) => {
    return new SimpleProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        organizationName,
    });
};
