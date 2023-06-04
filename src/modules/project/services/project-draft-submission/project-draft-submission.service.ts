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

@Injectable()
export class ProjectDraftSubmissionService {
    constructor(
        private readonly projectDraftSubmissionRepository: ProjectDraftSubmissionRepository,
    ) {}

    async getSubmissions() {
        const submissions = await this.projectDraftSubmissionRepository.find();
        return submissions.map((submission) => {
            return new SubmissionDto({
                ...submission,
            });
        });
    }

    async getSubmissionById(submissoionId: number) {
        const submission = this.projectDraftSubmissionRepository.findOne({
            where: { id: submissoionId },
        });
        if (!submission) {
            throw new RecordNotFoundException('submission_with_id_not_found');
        }
        return submission;
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
