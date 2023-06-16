import { OpenPositionDto } from '../dtos/open-position.dto';
import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';

export const convertProjectToProjectDto = (project: Project): ProjectDto => {
    return new ProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        description: project.description,
        fundingObjectives: project.fundingObjectives,
        organizationName: project.projectDraft.ownerOrganization.name,
        openPositions: project.openPositions,
    });
};

export const convertProjectToSimpleProjectDto = (project: Project) => {
    return new SimpleProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        organizationName: project.projectDraft.ownerOrganization.name,
    });
};
