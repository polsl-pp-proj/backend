import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ProjectDraftSubmissionRepository } from '../../repositories/project-draft-submission.repository';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ModifiedAfterReadException } from 'src/exceptions/modified-after-read.exception';
import { IProjectDraftSubmissionService } from 'src/interfaces/project-draft-submission.service.interface';
import { convertProjectDraftSubmissionToSubmissionDto } from '../../helper/submission-to-submission-dto';
import { convertProjectDraftToProjectDto } from '../../helper/project-draft-to-project-dto';
import { ProjectDraftSubmissionStatus } from '../../enums/project-draft-submission-status.enum';
import { NotificationService } from 'src/modules/notification/services/notification/notification.service';
import { NotificationType } from 'src/modules/notification/enums/notification-type.enum';
import { OrganizationNotificationRepository } from 'src/modules/notification/repositories/organization-notification.repository';

@Injectable()
export class ProjectDraftSubmissionService
    implements IProjectDraftSubmissionService
{
    constructor(
        private readonly projectDraftSubmissionRepository: ProjectDraftSubmissionRepository,
        private readonly notificationService: NotificationService,
    ) {}

    async getSubmissions() {
        const submissions = await this.projectDraftSubmissionRepository.find({
            where: {
                projectDraft: { galleryEntries: { indexPosition: 0 } },
                status: ProjectDraftSubmissionStatus.ToBeResolved,
            },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                    galleryEntries: { asset: true },
                },
            },
        });
        return submissions.map((submission) => {
            return convertProjectDraftSubmissionToSubmissionDto(submission);
        });
    }

    async getSubmissionById(submissionId: number) {
        const submission = await this.projectDraftSubmissionRepository.findOne({
            where: {
                id: submissionId,
                status: ProjectDraftSubmissionStatus.ToBeResolved,
            },
            relations: {
                projectDraft: {
                    ownerOrganization: true,
                    openPositions: true,
                    galleryEntries: { asset: true },
                    categories: { category: true },
                },
            },
        });
        if (!submission) {
            throw new RecordNotFoundException('submission_with_id_not_found');
        }
        return convertProjectDraftToProjectDto(submission.projectDraft);
    }

    async rejectSubmission(
        userId: number,
        submissionId: number,
        draftLastModified: Date,
        reason: string,
    ) {
        try {
            await this.projectDraftSubmissionRepository.manager.transaction(
                async (manager) => {
                    const projectDraftSubmissionRepository =
                        new ProjectDraftSubmissionRepository(
                            manager.connection,
                            manager,
                        );
                    const organizationNotificationRepository =
                        new OrganizationNotificationRepository(
                            manager.connection,
                            manager,
                        );

                    const projectDraft =
                        await projectDraftSubmissionRepository.rejectSubmission(
                            submissionId,
                            draftLastModified,
                            reason,
                        );

                    await this.notificationService.createOrganizationNotification(
                        {
                            subject: 'Zgłoszenie odrzucone',
                            message: `Zgłoszenie projektu ${projectDraft.name} Twojej organizacji zostało odrzucone.\nPowód:\n${reason}`,
                            type: NotificationType.ProjectDraftRejection,
                            userId,
                            projectId: projectDraft.id,
                        },
                        organizationNotificationRepository,
                    );
                },
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            if (ex instanceof ModifiedAfterReadException) {
                throw new ConflictException(ex.message);
            }
            throw ex;
        }
    }

    async publishSubmission(
        userId: number,
        submissionId: number,
        draftLastModified: Date,
    ) {
        try {
            await this.projectDraftSubmissionRepository.manager.transaction(
                async (manager) => {
                    const projectDraftSubmissionRepository =
                        new ProjectDraftSubmissionRepository(
                            manager.connection,
                            manager,
                        );
                    const organizationNotificationRepository =
                        new OrganizationNotificationRepository(
                            manager.connection,
                            manager,
                        );

                    const projectDraft =
                        await projectDraftSubmissionRepository.updateProjectFromSubmission(
                            submissionId,
                            draftLastModified,
                        );

                    await this.notificationService.createOrganizationNotification(
                        {
                            subject: 'Zgłoszenie zatwierdzone',
                            message: `Zgłoszenie projektu ${projectDraft.name} Twojej organizacji zostało zatwierdzone.`,
                            type: NotificationType.ProjectDraftPublication,
                            userId,
                            projectId: projectDraft.id,
                        },
                        organizationNotificationRepository,
                    );
                },
            );
        } catch (ex) {
            if (ex instanceof RecordNotFoundException) {
                throw new NotFoundException(ex.message);
            }
            if (ex instanceof ModifiedAfterReadException) {
                throw new ConflictException(ex.message);
            }
            throw ex;
        }
    }
}
