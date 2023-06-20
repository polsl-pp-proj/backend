import { ProjectDto } from 'src/modules/project/dtos/project.dto';
import { SubmissionDto } from 'src/modules/project/dtos/submission.dto';

export abstract class IProjectDraftSubmissionService {
    abstract getSubmissions(): Promise<SubmissionDto[]>;

    abstract getSubmissionById(submissionId: number): Promise<ProjectDto>;

    abstract rejectSubmission(
        userId: number,
        submissionId: number,
        draftLastModified: Date,
        reason: string,
    ): Promise<void>;

    abstract publishSubmission(
        userId: number,
        submissionId: number,
        draftLastModified: Date,
    ): Promise<void>;
}
