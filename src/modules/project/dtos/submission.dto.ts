import { ProjectDraftSubmissionStatus } from '../enums/project-draft-submission-status.enum';
import { SimpleProjectDraftDto } from './project-draft.dto';

export class SubmissionDto {
    id: number;
    projectDraft: SimpleProjectDraftDto;
    status: ProjectDraftSubmissionStatus;
    createdAt: Date;

    constructor(partialSubmissionSto: Partial<SubmissionDto>) {
        Object.assign(this, partialSubmissionSto);
    }
}
