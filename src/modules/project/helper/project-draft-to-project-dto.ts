import { OpenPositionDto } from '../dtos/open-position.dto';
import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { ProjectDraft } from '../entities/project-draft.entity';
import { convertProjectDraftOpenPositionToOpenPositionDto } from './project-open-position-to-open-position-dto';

export const convertProjectDraftToProjectDto = (projectDraft: ProjectDraft) => {
    return new ProjectDto({
        id: projectDraft.id,
        name: projectDraft.name,
        shortDescription: projectDraft.shortDescription,
        description: projectDraft.description,
        fundingObjectives: projectDraft.fundingObjectives,
        organizationId: projectDraft.ownerOrganizationId,
        organizationName: projectDraft.ownerOrganization.name,
        openPositions: projectDraft.openPositions.map((openPosition) =>
            convertProjectDraftOpenPositionToOpenPositionDto(openPosition),
        ),
        createdAt: projectDraft.createdAt.valueOf(),
        updatedAt: projectDraft.updatedAt.valueOf(),
    });
};

export const convertProjectDraftToSimpleProjectDto = (
    projectDraft: ProjectDraft,
) => {
    return new SimpleProjectDto({
        id: projectDraft.id,
        name: projectDraft.name,
        shortDescription: projectDraft.shortDescription,
        organizationId: projectDraft.ownerOrganizationId,
        organizationName: projectDraft.ownerOrganization.name,
        createdAt: projectDraft.createdAt.valueOf(),
        updatedAt: projectDraft.updatedAt.valueOf(),
    });
};
