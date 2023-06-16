import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ProjectDraftSubmissionRepository } from '../../repositories/project-draft-submission.repository';
import { ProjectDraftSubmissionStatus } from '../../enums/project-draft-submission-status.enum';
import { SubmissionDto } from '../../dtos/submission.dto';
import { RecordNotFoundException } from 'src/exceptions/record-not-found.exception';
import { ModifiedAfterReadException } from 'src/exceptions/modified-after-read.exception';
import { IProjectDraftSubmissionService } from 'src/interfaces/project-draft-submission.service.interface';
import { convertProjectDraftSubmissionToSubmissionDto } from '../../helper/submission-to-submission-dto';
import { convertProjectDraftToProjectDto } from '../../helper/project-draft-to-project-dto';

@Injectable()
export class ProjectDraftSubmissionService
    implements IProjectDraftSubmissionService
{
    constructor(
        private readonly projectDraftSubmissionRepository: ProjectDraftSubmissionRepository,
    ) {}

    async getSubmissions() {
        const submissions = await this.projectDraftSubmissionRepository.find({
            relations: { projectDraft: { ownerOrganization: true } },
        });
        return submissions.map((submission) => {
            return convertProjectDraftSubmissionToSubmissionDto(submission);
        });
    }

    async getSubmissionById(submissionId: number) {
        const submission = await this.projectDraftSubmissionRepository.findOne({
            where: { id: submissionId },
            relations: { projectDraft: { ownerOrganization: true } },
        });
        if (!submission) {
            throw new RecordNotFoundException('submission_with_id_not_found');
        }
        return convertProjectDraftToProjectDto(submission.projectDraft);
    }

    async rejectSubmission(
        submissionId: number,
        draftLastModified: Date,
        reason: string,
    ) {
        try {
            await this.projectDraftSubmissionRepository.rejectSubmission(
                submissionId,
                draftLastModified,
                reason,
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

    async publishSubmission(submissionId: number, draftLastModified: Date) {
        try {
            await this.projectDraftSubmissionRepository.updateProjectFromSubmission(
                submissionId,
                draftLastModified,
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
