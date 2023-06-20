import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProjectDraftSubmission } from '../entities/project-draft-submission.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ProjectRepository } from './project.repository';
import { ModifiedAfterReadException } from 'src/exceptions/modified-after-read.exception';

export class ProjectDraftSubmissionRepository extends Repository<ProjectDraftSubmission> {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private entityManager?: EntityManager,
    ) {
        super(
            ProjectDraftSubmission,
            entityManager ?? dataSource.createEntityManager(),
        );
    }

    async createSubmission(projectDraftId: number) {
        const submission = this.create({
            projectDraftId,
            status: ProjectDraftSubmissionStatus.ToBeResolved,
        });

        return await this.save(submission);
    }

    async updateProjectFromSubmission(
        submissionId: number,
        draftLastModified: Date,
    ) {
        return await this.entityManager.transaction(async (entityManager) => {
            const projectRepository = new ProjectRepository(
                entityManager.connection,
                entityManager,
            );
            const submissionRepository = new ProjectDraftSubmissionRepository(
                entityManager.connection,
                entityManager,
            );

            const submission = await submissionRepository.findOne({
                where: {
                    id: submissionId,
                    status: ProjectDraftSubmissionStatus.ToBeResolved,
                },
                relations: {
                    projectDraft: {
                        openPositions: true,
                        categories: true,
                        galleryEntries: { asset: true },
                    },
                },
            });

            if (!submission) {
                throw new RecordNotFoundException(
                    'submission_with_id_not_found',
                );
            }

            await projectRepository.importFromProjectDraft(
                submission.projectDraft,
                draftLastModified,
            );
            await submissionRepository.changeSubmissionStatus(
                submissionId,
                ProjectDraftSubmissionStatus.Published,
            );
            return submission.projectDraft;
        });
    }

    async rejectSubmission(
        submissionId: number,
        draftLastModified: Date,
        reason: string,
    ) {
        return await this.manager.transaction(async (entityManager) => {
            const submissionRepository = new ProjectDraftSubmissionRepository(
                entityManager.connection,
                entityManager,
            );
            const submission = await submissionRepository.findOne({
                where: {
                    id: submissionId,
                    status: ProjectDraftSubmissionStatus.ToBeResolved,
                },
                relations: { projectDraft: true },
            });
            if (!submission) {
                throw new RecordNotFoundException(
                    'change_submission_not_found',
                );
            } else if (
                submission.projectDraft.updatedAt.valueOf() !==
                draftLastModified.valueOf()
            ) {
                throw new ModifiedAfterReadException(
                    'draft_modified_after_read',
                );
            }
            await submissionRepository.changeSubmissionStatus(
                submissionId,
                ProjectDraftSubmissionStatus.Rejected,
                reason,
            );
            return submission.projectDraft;
        });
    }

    private async changeSubmissionStatus(
        submissionId: number,
        status: ProjectDraftSubmissionStatus,
        reason?: string,
    ) {
        return await this.update({ id: submissionId }, { status });
    }
}
