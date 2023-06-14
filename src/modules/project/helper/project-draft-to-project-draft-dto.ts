import { OpenPositionDto } from '../dtos/open-position.dto';
import {
    ProjectDraftDto,
    SimpleProjectDraftDto,
} from '../dtos/project-draft.dto';
import { ProjectDraft } from '../entities/project-draft.entity';

export const convertProjectDraftToProjectDraftDto = (
    projectDraft: ProjectDraft,
    organizationName: string,
) => {
    return new ProjectDraftDto({
        id: projectDraft.id,
        name: projectDraft.name,
        organizationName,
        shortDescription: projectDraft.shortDescription,
        description: projectDraft.description,
        fundingObjectives: projectDraft.fundingObjectives,
        lastModified: projectDraft.updatedAt,
        openPositions: projectDraft.openPositions,
    });
};

export const convertProjectDraftToSimpleProjectDraftDto = (
    projectDraft: ProjectDraft,
    organizationName: string,
) => {
    return new SimpleProjectDraftDto({
        id: projectDraft.id,
        name: projectDraft.name,
        organizationName,
        shortDescription: projectDraft.shortDescription,
    });
};
