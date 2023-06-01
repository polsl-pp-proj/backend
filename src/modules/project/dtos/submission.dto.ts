import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';

export class SubmissionDto {
    id: number;
    projectDraftId: number;
    projectDraftName: string;
    status: ProjectDraftSubmissionStatus;
    createdAt: Date;

    constructor(partialSubmissionSto: Partial<SubmissionDto>) {
        Object.assign(this, partialSubmissionSto);
    }
}
