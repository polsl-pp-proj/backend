import { SubmissionDto } from '../dtos/submission.dto';
import { ProjectDraftSubmission } from '../entities/project-draft-submission.entity';

export const convertProjectDraftSubmissionToSubmissionDto = (
    submission: ProjectDraftSubmission,
) => {
    return new SubmissionDto({
        id: submission.id,
        projectDraftId: submission.projectDraftId,
        projectDraftName: submission.projectDraft.name,
        status: submission.status,
        createdAt: submission.createdAt,
    });
};
