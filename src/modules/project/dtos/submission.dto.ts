import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { SimpleProjectDraftDto } from './project-draft.dto';

export class SubmissionDto {
    id: number;
    projectDraft: SimpleProjectDraftDto;
    status: ProjectDraftSubmissionStatus;
    createdAt: number;

    constructor(
        submission: Omit<SubmissionDto, 'createdAt'> & { createdAt: Date },
    ) {
        Object.assign(this, submission);
        this.createdAt = submission.createdAt.valueOf();
    }
}
