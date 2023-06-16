import { OpenPositionDto } from '../dtos/open-position.dto';
import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';
import { convertProjectOpenPositionToOpenPositionDto } from './project-open-position-to-open-position-dto';

export const convertProjectToProjectDto = (project: Project): ProjectDto => {
    return new ProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        description: project.description,
        fundingObjectives: project.fundingObjectives,
        organizationName: project.projectDraft.ownerOrganization.name,
        openPositions: project.openPositions.map((openPosition) =>
            convertProjectOpenPositionToOpenPositionDto(openPosition),
        ),
        createdAt: project.createdAt.valueOf(),
        updatedAt: project.updatedAt.valueOf(),
    });
};

export const convertProjectToSimpleProjectDto = (project: Project) => {
    return new SimpleProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        organizationName: project.projectDraft.ownerOrganization.name,
        createdAt: project.createdAt.valueOf(),
        updatedAt: project.updatedAt.valueOf(),
    });
};
