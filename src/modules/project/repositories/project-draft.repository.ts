import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { ProjectDraft } from '../entities/project-draft.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { Injectable } from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectDraftSubmissionRepository } from './project-draft-submission.repository';
import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { ProjectDraftOpenPositionRepository } from './project-draft-open-position.repository';
import { UpdateProjectDto } from '../dtos/update-project.dto';
import { AssetRepository } from 'src/modules/asset/repositories/asset.repository';
import { ProjectDraftGalleryEntryRepository } from 'src/modules/gallery/repositories/project-draft-gallery-entry.repository';
import { AssetDto } from 'src/modules/asset/dtos/asset.dto';
import { ProjectDraftCategoryRepository } from './project-draft-category.repository';

@Injectable()
export class ProjectDraftRepository extends Repository<ProjectDraft> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(ProjectDraft, entityManager ?? dataSource.createEntityManager());
    }

    async createProjectDraft(
        organizationId: number,
        createProjectDto: CreateProjectDto,
    ) {
        await this.entityManager.transaction(async (entityManager) => {
            const projectDraftRepository = new ProjectDraftRepository(
                entityManager.connection,
                entityManager,
            );
            const submissionRepository = new ProjectDraftSubmissionRepository(
                entityManager.connection,
                entityManager,
            );
            const projectDraftOpenPositionRepository =
                new ProjectDraftOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );
            const projectDraftCategoryRepository =
                new ProjectDraftCategoryRepository(
                    entityManager.connection,
                    entityManager,
                );

            const draft = projectDraftRepository.create({
                name: createProjectDto.name,
                shortDescription: createProjectDto.shortDescription,
                description: createProjectDto.description,
                ownerOrganization: { id: organizationId },
                ownerOrganizationId: organizationId,
                fundingObjectives:
                    createProjectDto.fundingObjectives.trim() || null,
            });

            await projectDraftRepository.save(draft, { reload: true });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                draft.id,
                createProjectDto.openPositions,
            );

            await projectDraftCategoryRepository.updateProjectDraftCategories(
                draft.id,
                createProjectDto.categories,
            );

            await projectDraftRepository.putInGallery(createProjectDto, draft);

            await submissionRepository.createSubmission(draft.id);
        });
    }

    async updateProjectDraft(
        userId: number,
        projectDraftId: number,
        updateProjectDto: UpdateProjectDto,
    ) {
        this.entityManager.transaction(async (entityManager) => {
            const projectDraftRepository = new ProjectDraftRepository(
                entityManager.connection,
                entityManager,
            );
            const submissionRepository = new ProjectDraftSubmissionRepository(
                entityManager.connection,
                entityManager,
            );
            const projectDraftOpenPositionRepository =
                new ProjectDraftOpenPositionRepository(
                    entityManager.connection,
                    entityManager,
                );
            const projectDraftCategoryRepository =
                new ProjectDraftCategoryRepository(
                    entityManager.connection,
                    entityManager,
                );

            let draft = await projectDraftRepository.findOne({
                where: {
                    id: projectDraftId,
                    ownerOrganization: { organizationUsers: { userId } }, // TODO: check if this is correct
                },
            });

            if (!draft) {
                throw new RecordNotFoundException('draft_with_id_not_found');
            }

            draft = await projectDraftRepository.save(
                {
                    id: projectDraftId,
                    description: updateProjectDto.description,
                    shortDescription: updateProjectDto.shortDescription,
                    name: updateProjectDto.name,
                    fundingObjectives: updateProjectDto.fundingObjectives,
                } as ProjectDraft,
                { reload: true },
            );

            await projectDraftOpenPositionRepository.updateOpenPositions(
                projectDraftId,
                updateProjectDto.openPositions,
            );

            await projectDraftCategoryRepository.updateProjectDraftCategories(
                projectDraftId,
                updateProjectDto.categories,
            );

            await projectDraftRepository.putInGallery(updateProjectDto, draft);

            const submission = await submissionRepository.findOne({
                where: {
                    projectDraftId,
                    status: ProjectDraftSubmissionStatus.ToBeResolved,
                },
            });
            if (!submission) {
                await submissionRepository.createSubmission(projectDraftId);
            }
        });
    }

    private async putInGallery(
        uploadProjectDto: CreateProjectDto | UpdateProjectDto,
        draft: Pick<ProjectDraft, 'id'>,
    ) {
        return await this.manager.transaction(async (manager) => {
            const assetRepository = new AssetRepository(
                manager.connection,
                manager,
            );
            const projectDraftGalleryRepository =
                new ProjectDraftGalleryEntryRepository(
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
                    await projectDraftGalleryRepository.createOrUpdateGalleryEntry(
                        draft.id,
                        i,
                        foundAsset,
                    ),
                );
            }

            await projectDraftGalleryRepository.delete({
                id: Not(In(galleryEntries.map((entry) => entry.id))),
                projectDraftId: draft.id,
            });
        });
    }
}
