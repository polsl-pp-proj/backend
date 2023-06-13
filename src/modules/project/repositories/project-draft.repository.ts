import { DataSource, EntityManager, In, Not, Repository } from 'typeorm';
import { ProjectDraft } from '../entities/project-draft.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { UploadProjectDto } from '../dtos/upload-project.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectDraftSubmissionRepository } from './project-draft-submission.repository';
import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { ProjectDraftOpenPositionRepository } from './project-draft-open-position.repository';

@Injectable()
export class ProjectDraftRepository extends Repository<ProjectDraft> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(ProjectDraft, entityManager ?? dataSource.createEntityManager());
    }

    async createProjectDraft(uploadProjectDto: UploadProjectDto) {
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

            const draft = projectDraftRepository.create({
                name: uploadProjectDto.name,
                shortDescription: uploadProjectDto.shortDescription,
                description: uploadProjectDto.description,
                ownerOrganization: { id: uploadProjectDto.ownerOrganizationId },
                ownerOrganizationId: uploadProjectDto.ownerOrganizationId,
                fundingObjectives: uploadProjectDto.fundingObjectives,
            });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                uploadProjectDto.openPositions,
                draft.id,
            );

            await projectDraftRepository.save(draft, { reload: true });
            await submissionRepository.createSubmission(draft.id);
        });
    }

    async getDraftById(draftId: number) {
        const draft = await this.findOne({
            where: { id: draftId },
            relations: { ownerOrganization: true },
        });

        if (!draft) {
            throw new RecordNotFoundException('draft_with_id_not_found');
        }

        return draft;
    }

    async updateProjectDraft(
        projectDraftId: number,
        updateProjectDto: UploadProjectDto,
        userId: number,
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

            let draft = await projectDraftRepository.findOne({
                where: { id: projectDraftId },
            });

            if (!draft) {
                throw new RecordNotFoundException('draft_with_id_not_found');
            }

            draft = await projectDraftRepository.save({
                ...draft,
                description: updateProjectDto.description,
                shortDescription: updateProjectDto.shortDescription,
                name: updateProjectDto.name,
                fundingObjectives: updateProjectDto.fundingObjectives,
                ownerOrganization: { id: updateProjectDto.ownerOrganizationId },
                ownerOrganizationId: updateProjectDto.ownerOrganizationId,
            });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                updateProjectDto.openPositions,
                draft.id,
            );

            const submission = await submissionRepository.findOne({
                where: {
                    projectDraftId: draft.id,
                    status: ProjectDraftSubmissionStatus.ToBeResolved,
                },
            });

            if (!submission) {
                await submissionRepository.createSubmission(draft.id);
            }
        });
    }
}
