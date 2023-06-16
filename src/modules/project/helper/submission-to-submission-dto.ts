import { SubmissionDto } from '../dtos/submission.dto';
import { ProjectDraftSubmission } from '../entities/project-draft-submission.entity';
import { convertProjectDraftToSimpleProjectDto } from './project-draft-to-project-dto';

export const convertProjectDraftSubmissionToSubmissionDto = (
    submission: ProjectDraftSubmission,
) => {
    return new SubmissionDto({
        id: submission.id,
        projectDraft: convertProjectDraftToSimpleProjectDto(
            submission.projectDraft,
        ),
        status: submission.status,
        createdAt: submission.createdAt,
    });
};
