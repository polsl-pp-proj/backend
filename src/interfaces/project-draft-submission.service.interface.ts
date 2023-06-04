import { SubmissionDto } from 'src/modules/project/dtos/submission.dto';

export abstract class IProjectDraftSubmissionService {
    abstract getSubmissions(): Promise<SubmissionDto[]>;

    abstract getSubmissionById(submissionId: number): Promise<SubmissionDto>;

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
