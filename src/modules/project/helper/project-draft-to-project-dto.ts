import { OpenPositionDto } from '../dtos/open-position.dto';
import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { ProjectDraft } from '../entities/project-draft.entity';

export const convertProjectDraftToProjectDto = (projectDraft: ProjectDraft) => {
    return new ProjectDto({
        id: projectDraft.id,
        name: projectDraft.name,
        shortDescription: projectDraft.shortDescription,
        description: projectDraft.description,
        fundingObjectives: projectDraft.fundingObjectives,
        organizationId: projectDraft.ownerOrganizationId,
        organizationName: projectDraft.ownerOrganization.name,
        openPositions: projectDraft.openPositions,
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
