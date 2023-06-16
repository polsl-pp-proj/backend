import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProjectDraft } from '../entities/project-draft.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { Injectable } from '@nestjs/common';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectDraftSubmissionRepository } from './project-draft-submission.repository';
import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { ProjectDraftOpenPositionRepository } from './project-draft-open-position.repository';
import { UpdateProjectDto } from '../dtos/update-project.dto';

@Injectable()
export class ProjectDraftRepository extends Repository<ProjectDraft> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(ProjectDraft, entityManager ?? dataSource.createEntityManager());
    }

    async createProjectDraft(
        uploadProjectDto: CreateProjectDto,
        organizationId: number,
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

            const draft = projectDraftRepository.create({
                name: uploadProjectDto.name,
                shortDescription: uploadProjectDto.shortDescription,
                description: uploadProjectDto.description,
                ownerOrganization: { id: organizationId },
                ownerOrganizationId: organizationId,
                fundingObjectives: uploadProjectDto.fundingObjectives,
            });

            await projectDraftRepository.save(draft, { reload: true });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                draft.id,
                uploadProjectDto.openPositions,
            );

            await submissionRepository.createSubmission(draft.id);
        });
    }

    async updateProjectDraft(
        projectDraftId: number,
        updateProjectDto: UpdateProjectDto,
        organizationId: number,
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
                where: {
                    id: projectDraftId,
                    ownerOrganizationId: organizationId,
                },
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
                ownerOrganization: { id: organizationId },
                ownerOrganizationId: organizationId,
            });

            await projectDraftOpenPositionRepository.updateOpenPositions(
                draft.id,
                updateProjectDto.openPositions,
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
