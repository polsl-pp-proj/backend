import { AssetDto } from 'src/modules/asset/dtos/asset.dto';
import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { ProjectDraft } from '../entities/project-draft.entity';
import { convertProjectDraftOpenPositionToOpenPositionDto } from './project-open-position-to-open-position-dto';
import { convertCategoryToCategoryDto } from 'src/modules/category/helpers/category-to-category-dto.helper';

export const convertProjectDraftToProjectDto = (projectDraft: ProjectDraft) => {
    return new ProjectDto({
        id: projectDraft.id,
        name: projectDraft.name,
        shortDescription: projectDraft.shortDescription,
        description: projectDraft.description,
        fundingObjectives: projectDraft.fundingObjectives ?? '',
        organizationId: projectDraft.ownerOrganizationId,
        organizationName: projectDraft.ownerOrganization.name,
        openPositions: projectDraft.openPositions.map((openPosition) =>
            convertProjectDraftOpenPositionToOpenPositionDto(openPosition),
        ),
        categories: projectDraft.categories.map((category) =>
            convertCategoryToCategoryDto(category.category),
        ),
        assets: projectDraft.galleryEntries.map(
            (galleryEntry) =>
                new AssetDto({
                    title: galleryEntry.asset.title,
                    url: galleryEntry.asset.url,
                    type: galleryEntry.asset.type,
                }),
        ),
        createdAt: projectDraft.createdAt.valueOf(),
        updatedAt: projectDraft.updatedAt.valueOf(),
    });
};

export const convertProjectDraftToSimpleProjectDto = (
    projectDraft: ProjectDraft,
) => {
    const firstAsset = projectDraft.galleryEntries[0].asset;
    return new SimpleProjectDto({
        id: projectDraft.id,
        name: projectDraft.name,
        shortDescription: projectDraft.shortDescription,
        organizationId: projectDraft.ownerOrganizationId,
        organizationName: projectDraft.ownerOrganization.name,
        createdAt: projectDraft.createdAt.valueOf(),
        updatedAt: projectDraft.updatedAt.valueOf(),
        thumbnail: new AssetDto({
            title: firstAsset.title,
            url: firstAsset.url,
            type: firstAsset.type,
        }),
    });
};
