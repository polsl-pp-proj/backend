import { SubmissionDto } from '../dtos/submission.dto';
import { ProjectDraftSubmission } from '../entities/project-draft-submission.entity';

export const convertProjectDraftSubmissionToSubmissionDto = (
    submission: ProjectDraftSubmission,
) => {
    return new SubmissionDto({
        id: submission.id,
        projectDraft: {
            id: submission.projectDraftId,
            name: submission.projectDraft.name,
            organizationName: submission.projectDraft.ownerOrganization.name,
            shortDescription: submission.projectDraft.shortDescription,
            createdAt: submission.projectDraft.createdAt.valueOf(),
            updatedAt: submission.projectDraft.updatedAt.valueOf(),
        },
        status: submission.status,
        createdAt: submission.createdAt,
    });
};
