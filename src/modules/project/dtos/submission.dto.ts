import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { SimpleProjectDto } from './project.dto';

export class SubmissionDto {
    id: number;
    projectDraft: SimpleProjectDto;
    status: ProjectDraftSubmissionStatus;
    createdAt: number;

    constructor(
        submission: Omit<SubmissionDto, 'createdAt'> & { createdAt: Date },
    ) {
        Object.assign(this, submission);
        this.createdAt = submission.createdAt.valueOf();
    }
}
