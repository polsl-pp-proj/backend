import { ProjectDraftDto } from 'src/modules/project/dtos/project-draft.dto';
import { SubmissionDto } from 'src/modules/project/dtos/submission.dto';

export abstract class IProjectDraftSubmissionService {
    abstract getPublicationSubmissions(): Promise<SubmissionDto[]>;

    abstract getChangeSubmissions(): Promise<SubmissionDto[]>;

    abstract getSubmssionProjectDraft(
        submissinId: number,
    ): Promise<ProjectDraftDto>;

    abstract rejectSubmission(
        submissionId: number,
        draftLastModified: Date,
        reason: string,
    ): Promise<void>;

    abstract publishSubmission(
        submissionId: number,
        draftLastModified: Date,
    ): Promise<void>;
}
