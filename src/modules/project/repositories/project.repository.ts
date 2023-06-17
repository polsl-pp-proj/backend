import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectDraft } from '../entities/project-draft.entity';
import { ModifiedAfterReadException } from 'src/exceptions/modified-after-read.exception';
import { ProjectOpenPositionRepository } from './project-open-position.repository';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { AssetRepository } from 'src/modules/asset/repositories/asset.repository';
import { ProjectGalleryEntryRepository } from 'src/modules/gallery/repositories/project-gallery-entry.repository';
import { AssetDto } from 'src/modules/asset/dtos/asset.dto';
import { ProjectCategoryRepository } from './project-category.repository';

@Injectable()
export class ProjectRepository extends Repository<Project> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(Project, entityManager ?? dataSource.createEntityManager());
    }

    async importFromProjectDraft(
        projectDraft: ProjectDraft,
        draftLastModified: Date,
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectRepository = new ProjectRepository(
                entityManager.connection,
                entityManager,
            );
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );
            const projectGalleryEntryRepository =
                new ProjectGalleryEntryRepository(
                    entityManager.connection,
                    entityManager,
                );
            const projectCategoryRepository = new ProjectCategoryRepository(
                entityManager.connection,
                entityManager,
            );

            if (
                projectDraft.updatedAt.valueOf() !== draftLastModified.valueOf()
            ) {
                throw new ModifiedAfterReadException(
                    'draft_modified_after_read',
                );
            }

            let project = await projectRepository.findOne({
                where: {
                    projectDraft: { id: projectDraft.id },
                    projectDraftId: projectDraft.id,
                },
            });

            if (project) {
                project.name = projectDraft.name;
                project.description = projectDraft.description;
                project.shortDescription = projectDraft.shortDescription;
                project.fundingObjectives = projectDraft.fundingObjectives;
            } else {
                project = projectRepository.create({
                    name: projectDraft.name,
                    description: projectDraft.description,
                    shortDescription: projectDraft.shortDescription,
                    fundingObjectives: projectDraft.fundingObjectives,
                    projectDraft: projectDraft,
                    projectDraftId: projectDraft.id,
                });
            }

            project = await projectRepository.save(project, { reload: true });

            await projectOpenPositionRepository.importOpenPositionsFromDraft(
                project.id,
                projectDraft.openPositions,
            );
            await projectCategoryRepository.importCategoriesFromProjectDraft(
                project.id,
                projectDraft.categories,
            );
            await projectGalleryEntryRepository.importFromProjectDraftGallery(
                project.id,
                projectDraft.galleryEntries,
            );
        });
    }

    async editProjectContent(
        projectId: number,
        updateProjectDto: UpdateProjectDto,
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectRepository = new ProjectRepository(
                entityManager.connection,
                entityManager,
            );
            const projectOpenPositionRepository =
                new ProjectOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );
            const projectCategoryRepository = new ProjectCategoryRepository(
                entityManager.connection,
                entityManager,
            );

            const queryResult = await projectRepository.update(
                { id: projectId },
                {
                    name: updateProjectDto.name,
                    shortDescription: updateProjectDto.shortDescription,
                    description: updateProjectDto.description,
                    fundingObjectives: updateProjectDto.fundingObjectives,
                },
            );

            if (queryResult.affected === 0) {
                throw new RecordNotFoundException('project_with_id_not_found');
            }

            await projectOpenPositionRepository.editProjectOpenPositions(
                projectId,
                updateProjectDto.openPositions,
            );

            await projectCategoryRepository.updateProjectCategories(
                projectId,
                updateProjectDto.categories,
            );

            await projectRepository.putInGallery(updateProjectDto, {
                id: projectId,
            });
        });
    }

    private async putInGallery(
        uploadProjectDto: UpdateProjectDto,
        project: Pick<Project, 'id'>,
    ) {
        return await this.manager.transaction(async (manager) => {
            const assetRepository = new AssetRepository(
                manager.connection,
                manager,
            );
            const projectGalleryRepository = new ProjectGalleryEntryRepository(
                manager.connection,
                manager,
            );

            const galleryEntries = [];

            for (let i = 0; i < uploadProjectDto.assets.length; ++i) {
                const asset = uploadProjectDto.assets[i] as AssetDto;
                let foundAsset = await assetRepository.findOne({
                    where: { url: asset.url },
                });
                if (!foundAsset) {
                    foundAsset = await assetRepository.createAsset(asset);
                }
                galleryEntries.push(
                    await projectGalleryRepository.createOrUpdateGalleryEntry(
                        project.id,
                        i,
                        foundAsset,
                    ),
                );
            }

            await projectGalleryRepository.delete({
                id: Not(In(galleryEntries.map((entry) => entry.id))),
                projectId: project.id,
            });
        });
    }
}
