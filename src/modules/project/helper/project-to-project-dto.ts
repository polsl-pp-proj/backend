import { AssetDto } from 'src/modules/asset/dtos/asset.dto';
import { ProjectDto, SimpleProjectDto } from '../dtos/project.dto';
import { Project } from '../entities/project.entity';
import { convertProjectOpenPositionToOpenPositionDto } from './project-open-position-to-open-position-dto';

export const convertProjectToProjectDto = (project: Project): ProjectDto => {
    return new ProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        description: project.description,
        fundingObjectives: project.fundingObjectives ?? '',
        organizationId: project.projectDraft.ownerOrganizationId,
        organizationName: project.projectDraft.ownerOrganization.name,
        openPositions: project.openPositions.map((openPosition) =>
            convertProjectOpenPositionToOpenPositionDto(openPosition),
        ),
        assets: project.galleryEntries.map(
            (galleryEntry) =>
                new AssetDto({
                    title: galleryEntry.asset.title,
                    url: galleryEntry.asset.url,
                    type: galleryEntry.asset.type,
                }),
        ),
        createdAt: project.createdAt.valueOf(),
        updatedAt: project.updatedAt.valueOf(),
    });
};

export const convertProjectToSimpleProjectDto = (project: Project) => {
    const firstAsset = project.galleryEntries[0].asset;
    return new SimpleProjectDto({
        id: project.id,
        name: project.name,
        shortDescription: project.shortDescription,
        organizationId: project.projectDraft.ownerOrganizationId,
        organizationName: project.projectDraft.ownerOrganization.name,
        createdAt: project.createdAt.valueOf(),
        updatedAt: project.updatedAt.valueOf(),
        thumbnail: new AssetDto({
            title: firstAsset.title,
            url: firstAsset.url,
            type: firstAsset.type,
        }),
    });
};
