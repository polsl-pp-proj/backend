import {
    ProjectDraftDto,
    SimpleProjectDraftDto,
} from '../dtos/project-draft.dto';
import { ProjectDraft } from '../entities/project-draft.entity';

export const converProjectDraftToProjectDraftDto = (
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
        lastModified: projectDraft.lastModified,
    });
};

export const converProjectDraftToSimpleProjectDraftDto = (
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
